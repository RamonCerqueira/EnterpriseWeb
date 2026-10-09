import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import modelsMetadata from "@/lib/models-metadata.json";
import { Prisma } from "@prisma/client";
import { buildCadastroSearch, cadastrosConfig } from "@/lib/cadastros-config";
import { CrudValidationError, decodeCrudImage, serializeCrudRecord, validateBankNumber } from "@/lib/crud-values";

interface MetadataField {
  name: string;
  type: string;
  isNullable: boolean;
  isList: boolean;
  isId: boolean;
  isAutoincrement: boolean;
}

interface ModelMetadata {
  name: string;
  dbMap: string;
  primaryKey: {
    field: string;
    type: string;
    isCompound: boolean;
  };
  fields: MetadataField[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { model } = await params;
    const metadata = (modelsMetadata as Record<string, ModelMetadata>)[model];
    if (!metadata) {
      return NextResponse.json({ error: `Tabela '${model}' não encontrada ou não é gerenciável.` }, { status: 404 });
    }

    // Map Prisma key (lowercase first char)
    const prismaKey = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[prismaKey];
    if (!delegate) {
      return NextResponse.json({ error: `Modelo '${model}' não mapeado no Prisma Client.` }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));
    const search = searchParams.get("search") || "";
    const searchField = searchParams.get("searchField") || "";
    const config = cadastrosConfig[model];
    if (config && searchField && !config.searchFields.some(field => field.name === searchField)) {
      return NextResponse.json({ error: "Filtro de pesquisa inválido." }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    // Build dynamic search filter across all String fields
    const where: any = config ? buildCadastroSearch(model, search, searchField) : {};
    if (!config && search.trim()) {
      const stringFields = metadata.fields.filter(f => f.type === "String");
      if (stringFields.length > 0) {
        where.OR = stringFields.map(f => ({
          [f.name]: {
            contains: search.trim()
          }
        }));
      }
    }

    // Fetch total count and items in parallel
    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [metadata.primaryKey.field]: "desc"
        }
      }),
      delegate.count({ where })
    ]);

    return NextResponse.json({
      items: items.map((item: Record<string, unknown>) => serializeCrudRecord(item, model)),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error("[CRUD API GET Error]:", error);
    return NextResponse.json({ error: error.message || "Erro ao buscar registros da tabela." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Only administrators or supervisors can make changes to tables directly
    const isAdmin = session.role === "Administrador" || session.permissions["Op91"];
    if (!isAdmin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores podem fazer alterações." }, { status: 403 });
    }

    const { model } = await params;
    const metadata = (modelsMetadata as Record<string, ModelMetadata>)[model];
    if (!metadata) {
      return NextResponse.json({ error: `Tabela '${model}' não encontrada.` }, { status: 404 });
    }

    const prismaKey = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[prismaKey];
    if (!delegate) {
      return NextResponse.json({ error: `Modelo '${model}' não mapeado no Prisma Client.` }, { status: 404 });
    }

    const body = await req.json();
    const data: any = {};

    // Cast fields to correct types
    for (const field of metadata.fields) {
      // If it is autoincrement ID, skip letting database handle it
      if (field.isId && field.isAutoincrement) {
        continue;
      }

      const val = body[field.name];
      if (val === undefined) continue;

      if (val === undefined || val === null || val === "") {
        if (field.isNullable) {
          data[field.name] = null;
        }
        continue;
      }

      if (field.type === "Int") {
        const parsed = parseInt(val, 10);
        data[field.name] = isNaN(parsed) ? 0 : parsed;
      } else if (model === "Banco" && field.name === "NossoNumero") {
        data[field.name] = validateBankNumber(val);
      } else if (field.type === "Float" || field.type === "Decimal") {
        const parsed = parseFloat(val);
        data[field.name] = isNaN(parsed) ? 0.0 : parsed;
      } else if (field.type === "Boolean") {
        data[field.name] = val === true || val === "true" || val === 1 || val === "1";
      } else if (field.type === "DateTime") {
        data[field.name] = new Date(val);
      } else if (field.type === "Bytes") {
        data[field.name] = decodeCrudImage(val);
      } else {
        data[field.name] = String(val);
      }
    }

    const createItem = async () => {
      // These legacy tables have integer keys without IDENTITY. Allocate a key
      // inside a serializable transaction so simultaneous inserts cannot reuse it.
      if (!cadastrosConfig[model] || data[metadata.primaryKey.field] !== undefined) return delegate.create({ data });
      for (let attempt = 0; ; attempt++) {
        try {
          return await prisma.$transaction(async tx => {
            const transactionDelegate = (tx as unknown as Record<string, typeof delegate>)[prismaKey];
            const maximum = await transactionDelegate.aggregate({ _max: { [metadata.primaryKey.field]: true } });
            const id = (maximum._max[metadata.primaryKey.field] ?? 0) + 1;
            return transactionDelegate.create({ data: { ...data, [metadata.primaryKey.field]: id } });
          }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
        } catch (error) {
          if (attempt >= 2 || !(error instanceof Prisma.PrismaClientKnownRequestError) || !["P2034", "P2002"].includes(error.code)) throw error;
        }
      }
    };
    const newItem = await createItem();
    return NextResponse.json({ success: true, item: serializeCrudRecord(newItem, model) });
  } catch (error: any) {
    console.error("[CRUD API POST Error]:", error);
    return NextResponse.json({ error: error.message || "Erro ao criar registro." }, { status: error instanceof CrudValidationError ? 400 : 500 });
  }
}
