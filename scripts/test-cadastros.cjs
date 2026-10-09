const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");
const { Prisma } = require("@prisma/client");

const root = path.resolve(__dirname, "..");
function loadTypeScript(file, mocks = {}) {
  const filename = path.join(root, file);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const resolve = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith("@/")) {
      const relative = "src/" + name.slice(2);
      return relative.endsWith(".json") ? require(path.join(root, relative)) : loadTypeScript(relative + ".ts", mocks);
    }
    return require(name);
  };
  new Function("require", "module", "exports", source)(resolve, module, module.exports);
  return module.exports;
}

const { cadastrosConfig } = loadTypeScript("src/lib/cadastros-config.ts");
const metadata = require("../src/lib/models-metadata.json");
function routes(delegate, session = { role: "Administrador", permissions: {} }) {
  const prisma = Object.fromEntries(Object.keys(cadastrosConfig).map(model => [model[0].toLowerCase() + model.slice(1), delegate]));
  prisma.$transaction = async (callback, options) => {
    assert.equal(options.isolationLevel, "Serializable");
    return callback(prisma);
  };
  const mocks = {
    "@/lib/db": { prisma },
    "@/lib/auth": { getSession: async () => session },
    "next/server": { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
  };
  return {
    list: loadTypeScript("src/app/api/crud/[model]/route.ts", mocks),
    item: loadTypeScript("src/app/api/crud/[model]/[id]/route.ts", mocks),
  };
}
const context = (model, id = "7") => ({ params: Promise.resolve({ model, id }) });
const request = (body = {}, query = "") => ({ url: `http://localhost/api/crud/test?${query}`, json: async () => body });

test("only five cadastros are shown and every configured field exists in its model", () => {
  assert.deepEqual(Object.keys(cadastrosConfig).sort(), ["Banco", "CentroCusto", "Forma", "Ref_Ban", "Tipo"]);
  for (const [model, config] of Object.entries(cadastrosConfig)) {
    assert.equal(config.id, metadata[model].primaryKey.field);
    for (const field of [...config.fields, ...config.columns, ...config.searchFields]) {
      assert.ok(metadata[model].fields.some(item => item.name === field.name), `${model}.${field.name}`);
    }
    assert.ok(!config.columns.some(column => column.name === "actions"));
  }
});

test("code searches match numeric keys and text searches use only the requested columns", async () => {
  let query;
  const api = routes({ findMany: async args => { query = args; return []; }, count: async () => 0 });
  await api.list.GET(request({}, "search=7&searchField=CodForma"), context("Forma"));
  assert.deepEqual(query.where, { OR: [{ CodForma: 7 }] });
  await api.list.GET(request({}, "search=PIX"), context("Forma"));
  assert.deepEqual(query.where, { OR: [{ Forma: { contains: "PIX" } }] });
  await api.list.GET(request({}, "search=1.2&searchField=Classificacao"), context("CentroCusto"));
  assert.deepEqual(query.where, { OR: [{ Classificacao: { contains: "1.2" } }] });
  const invalid = await api.list.GET(request({}, "search=foo&searchField=ContaCredito"), context("Forma"));
  assert.equal(invalid.status, 400);
});

test("editing one visible field preserves hidden columns, dates and unchanged flags", async () => {
  let update;
  const original = { CodForma: 7, Forma: "Dinheiro", Indice: "1.5", Cartao: null, ContaCredito: "12345" };
  const api = routes({ update: async args => { update = args; return { ...original, ...args.data }; } });
  const result = await api.item.PUT(request({ Forma: "PIX" }), context("Forma"));
  assert.equal(result.status, 200);
  assert.deepEqual(update, { where: { CodForma: 7 }, data: { Forma: "PIX" } });
  assert.equal(result.body.item.ContaCredito, "12345");
  assert.equal(result.body.item.Cartao, null);
});

test("explicitly clearing a field stores null and cannot change the primary key", async () => {
  let update;
  const api = routes({ update: async args => { update = args; return { CodRef: 7, ...args.data }; } });
  await api.item.PUT(request({ CodRef: 99, Descricao: "" }), context("Ref_Ban"));
  assert.deepEqual(update.data, { Descricao: null });
  assert.deepEqual(update.where, { CodRef: 7 });
});

test("bank numbers preserve digits without floating point conversion", async () => {
  let update;
  const api = routes({ update: async args => { update = args; return { CodBan: 7, ...args.data }; } });
  await api.item.PUT(request({ NossoNumero: "12345678901", NossoNumero2: "12345678901234567" }), context("Banco"));
  assert.equal(update.data.NossoNumero, "12345678901");
  assert.equal(update.data.NossoNumero2, "12345678901234567");
  const previousError = console.error;
  console.error = () => {};
  try {
    assert.equal((await api.item.PUT(request({ NossoNumero: "123456789012" }), context("Banco"))).status, 400);
  } finally { console.error = previousError; }
});

test("bank logos decode to bytes, return base64, and can be removed", async () => {
  let update;
  const api = routes({ update: async args => { update = args; return { CodBan: 7, ...args.data }; } });
  const encoded = Buffer.from([137, 80, 78, 71]).toString("base64");
  const result = await api.item.PUT(request({ Logo: `data:image/png;base64,${encoded}` }), context("Banco"));
  assert.ok(Buffer.isBuffer(update.data.Logo));
  assert.equal(result.body.item.Logo, encoded);
  await api.item.PUT(request({ Logo: "" }), context("Banco"));
  assert.equal(update.data.Logo, null);
});

test("new records receive generated IDs with a serializable transaction", async () => {
  let created;
  const api = routes({ aggregate: async () => ({ _max: { CodCen: 41 } }), create: async args => { created = args.data; return args.data; } });
  const result = await api.list.POST(request({ Centro: "Matriz", Inativo: "N" }), context("CentroCusto"));
  assert.equal(result.status, 200);
  assert.deepEqual(created, { Centro: "Matriz", Inativo: "N", CodCen: 42 });
  assert.ok(!Object.hasOwn(created, "Classificacao"));
});

test("key allocation retries concurrent transaction conflicts", async () => {
  let attempts = 0;
  const api = routes({
    aggregate: async () => ({ _max: { CodRef: 1 } }),
    create: async args => {
      if (++attempts === 1) throw new Prisma.PrismaClientKnownRequestError("conflict", { code: "P2034", clientVersion: "6.19.3" });
      return args.data;
    },
  });
  const result = await api.list.POST(request({ Referencia: "001" }), context("Ref_Ban"));
  assert.equal(result.body.item.CodRef, 2);
  assert.equal(attempts, 2);
});

test("deletion targets the selected record and enforces administrator permissions", async () => {
  let deletion;
  const delegate = { delete: async args => { deletion = args; } };
  const api = routes(delegate);
  assert.equal((await api.item.DELETE(request(), context("Banco", "9"))).status, 200);
  assert.deepEqual(deletion, { where: { CodBan: 9 } });
  deletion = null;
  const restricted = routes(delegate, { role: "Operador", permissions: {} });
  assert.equal((await restricted.item.DELETE(request(), context("Banco"))).status, 403);
  assert.equal(deletion, null);
  const anonymous = routes(delegate, null);
  assert.equal((await anonymous.list.POST(request(), context("Forma"))).status, 401);
});
