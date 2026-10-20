"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Plus, RefreshCw, Save, Search } from "lucide-react";
import { cadastrosConfig } from "@/lib/cadastros-config";

type RecordData = Record<string, unknown>;
type FormData = Record<string, string>;
const inputStyle = "w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-70";

function imageSource(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.startsWith("data:") ? value : `data:image/*;base64,${value}`;
  const object = value as Record<string, unknown>;
  const bytes = Array.isArray(object.data) ? object.data : Object.values(object);
  return `data:image/*;base64,${btoa(bytes.map(byte => String.fromCharCode(Number(byte))).join(""))}`;
}

function isCheckedCheckbox(value: string | undefined): boolean {
  return ["S", "X", "1", "TRUE"].includes(value?.trim().toUpperCase() ?? "N");
}

function CadastroEditor({ model }: { model: string }) {
  const config = cadastrosConfig[model];
  const [records, setRecords] = useState<RecordData[]>([]);
  const [selected, setSelected] = useState<RecordData | null>(null);
  const [form, setForm] = useState<FormData>({});
  const [changed, setChanged] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [deleteOnSave, setDeleteOnSave] = useState(false);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; text: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: "15", search, searchField });
        const response = await fetch(`/api/crud/${model}?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Falha ao buscar registros.");
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, data.pages);
        if (page > lastPage) { setPage(lastPage); return; }
        setRecords(data.items);
        setPages(lastPage);
        setTotal(data.total);
      } catch (error) {
        if (!controller.signal.aborted) setFeedback({ error: true, text: error instanceof Error ? error.message : "Erro ao conectar com o servidor." });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [model, search, searchField, page, reload]);

  function selectRecord(record: RecordData | null) {
    const values: FormData = {};
    for (const field of config.fields) {
      const value = record?.[field.name];
      values[field.name] = field.kind === "image" ? imageSource(value)
        : field.kind === "checkbox" ? String(value ?? "N")
        : field.kind === "date" ? String(value ?? "").slice(0, 10)
        : String(value ?? "");
    }
    setSelected(record);
    setForm(values);
    setChanged([]);
    setEditing(true);
    setDeleteOnSave(false);
    setFeedback(null);
  }

  function changeField(name: string, value: string) {
    setForm(current => ({ ...current, [name]: value }));
    setChanged(current => current.includes(name) ? current : [...current, name]);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing || saving || (deleteOnSave && !selected)) return;
    setSaving(true);
    setFeedback(null);
    try {
      const id = selected?.[config.id];
      const payload = Object.fromEntries(config.fields
        .filter(field => !selected || changed.includes(field.name))
        .map(field => [field.name, form[field.name] ?? ""]));
      const response = await fetch(`/api/crud/${model}${selected ? `/${id}` : ""}`, {
        method: deleteOnSave ? "DELETE" : selected ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        ...(deleteOnSave ? {} : { body: JSON.stringify(payload) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível gravar o registro.");
      const wasDeleted = deleteOnSave;
      if (wasDeleted) { setSelected(null); setForm({}); setEditing(false); setDeleteOnSave(false); }
      else selectRecord(data.item);
      setFeedback({ error: false, text: wasDeleted ? "Registro excluído com sucesso." : "Registro gravado com sucesso." });
      setReload(current => current + 1);
    } catch (error) {
      setFeedback({ error: true, text: error instanceof Error ? error.message : "Erro ao gravar." });
    } finally { setSaving(false); }
  }

  async function loadImage(file: File | undefined) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/gif", "image/webp", "image/bmp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setFeedback({ error: true, text: "Escolha uma imagem PNG, JPEG, GIF, WebP ou BMP de até 2 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => changeField("Logo", String(reader.result));
    reader.onerror = () => setFeedback({ error: true, text: "Não foi possível ler a imagem." });
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold">{config.label}</h1>
        <div className="flex gap-2">
          <button type="button" disabled={saving} onClick={() => setReload(current => current + 1)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"><RefreshCw size={15} /> Atualizar</button>
          <button type="button" disabled={saving} onClick={() => selectRecord(null)} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-black disabled:opacity-50"><Plus size={16} /> Novo</button>
        </div>
      </div>
      {feedback && <p role={feedback.error ? "alert" : "status"} className={`rounded-lg border p-3 text-sm ${feedback.error ? "border-red-500/40 bg-red-500/10 text-red-700" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"}`}>{feedback.text}</p>}
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 p-4">
            <label className="sr-only" htmlFor="search-field">Pesquisar por</label>
            <select id="search-field" value={searchField} onChange={event => { setSearchField(event.target.value); setPage(1); setLoading(true); }} className={`${inputStyle} !w-auto`}>
              <option value="">Todos os filtros</option>
              {config.searchFields.map(field => <option key={field.name} value={field.name}>{field.label}</option>)}
            </select>
            <div className="relative min-w-40 flex-1">
              <Search size={16} className="absolute left-3 top-3 text-slate-500" />
              <input aria-label="Pesquisar registros" placeholder={`Pesquisar por ${searchField ? config.searchFields.find(field => field.name === searchField)?.label.toLowerCase() : config.searchFields.map(field => field.label.toLowerCase()).join(", ")}...`} value={search} onChange={event => { setSearch(event.target.value); setPage(1); setLoading(true); }} className={`${inputStyle} pl-9`} />
            </div>
          </div>
          <div className="overflow-x-auto" aria-busy={loading}>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/50 text-xs text-slate-600"><tr>{config.columns.map(column => <th key={column.name} className="whitespace-nowrap px-4 py-3">{column.label}</th>)}</tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={config.columns.length} className="p-8 text-center text-slate-600"><Loader2 size={20} className="mx-auto animate-spin" /><span className="sr-only">Carregando registros</span></td></tr>
                  : records.length === 0 ? <tr><td colSpan={config.columns.length} className="p-8 text-center text-slate-500">Nenhum registro encontrado.</td></tr>
                  : records.map(record => {
                    const active = selected?.[config.id] === record[config.id];
                    return <tr key={String(record[config.id])} tabIndex={saving ? -1 : 0} aria-selected={active} onClick={() => { if (!saving) selectRecord(record); }} onKeyDown={event => { if (!saving && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); selectRecord(record); } }} className={`cursor-pointer border-t border-slate-200 outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${active ? deleteOnSave ? "bg-red-500/15 text-red-700" : "bg-emerald-500/10 text-emerald-700" : "hover:bg-slate-100/50"}`}>
                      {config.columns.map(column => <td key={column.name} className="px-4 py-3">{String(record[column.name] ?? "")}</td>)}
                    </tr>;
                  })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 p-3 text-xs text-slate-600">
            <span>{total} registros • Página {page} de {pages}</span>
            <div className="flex gap-2">
              <button aria-label="Página anterior" disabled={page <= 1 || loading || saving} onClick={() => { setPage(current => current - 1); setLoading(true); }} className="rounded border border-slate-200 p-1.5 disabled:opacity-30"><ChevronLeft size={16} /></button>
              <button aria-label="Próxima página" disabled={page >= pages || loading || saving} onClick={() => { setPage(current => current + 1); setLoading(true); }} className="rounded border border-slate-200 p-1.5 disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>
        <form onSubmit={save} className={`rounded-xl border p-5 transition-colors ${deleteOnSave ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 bg-slate-50/60"}`}>
          <h2 className="mb-4 font-semibold">{selected ? "Dados do registro" : editing ? "Novo registro" : "Selecione uma linha ou clique em Novo"}</h2>
          <fieldset disabled={!editing || saving || deleteOnSave} className={`space-y-4 ${deleteOnSave ? "[&_input]:border-red-500/60 [&_input]:bg-red-50 [&_input]:text-red-700 [&_button]:border-red-500/60" : ""}`}>
            <label className="block text-xs font-semibold">Código
              <input disabled value={String(selected?.[config.id] ?? "")} placeholder={editing ? "Gerado ao gravar" : ""} className={`${inputStyle} mt-1`} />
            </label>
            {config.fields.map(field => field.kind === "checkbox" ? (
              <label key={field.name} className="flex items-center gap-2 text-sm"><input type="checkbox" className={`h-4 w-4 ${deleteOnSave ? "accent-red-500" : "accent-emerald-500"}`} checked={isCheckedCheckbox(form[field.name])} onChange={event => changeField(field.name, event.target.checked ? "S" : "N")} />{field.label}</label>
            ) : field.kind === "image" ? (
              <div key={field.name} className="space-y-2">
                <label htmlFor="bank-logo" className="block text-xs font-semibold">{field.label}</label>
                {form.Logo && <div role="img" aria-label="Logotipo do banco" className={`h-20 w-36 rounded border ${deleteOnSave ? "border-red-500 opacity-50" : "border-slate-200"} bg-contain bg-center bg-no-repeat`} style={{ backgroundImage: `url("${form.Logo}")` }} />}
                <input id="bank-logo" type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/bmp" className={`${inputStyle} text-xs`} onChange={event => void loadImage(event.target.files?.[0])} />
                {form.Logo && <button type="button" onClick={() => changeField("Logo", "")} className="rounded border border-slate-200 px-2 py-1 text-xs">Remover logotipo</button>}
              </div>
            ) : (
              <label key={field.name} className="block text-xs font-semibold">{field.label}
                <input type={field.kind === "date" ? "date" : field.kind === "number" ? "number" : "text"} min={field.kind === "number" ? "1" : undefined} step={field.kind === "number" ? "1" : undefined} maxLength={field.maxLength} pattern={field.name.startsWith("NossoNumero") ? "[0-9]*" : undefined} inputMode={field.name.startsWith("NossoNumero") ? "numeric" : undefined} value={form[field.name] ?? ""} onChange={event => changeField(field.name, event.target.value)} className={`${inputStyle} mt-1`} />
              </label>
            ))}
          </fieldset>
          <div className="mt-5 space-y-3 border-t border-slate-200 pt-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-red-700">
              <input type="checkbox" checked={deleteOnSave} disabled={!selected || saving} onChange={event => setDeleteOnSave(event.target.checked)} className="h-4 w-4 accent-red-500" /> Excluir registro ao gravar
            </label>
            {deleteOnSave && <p role="alert" className="text-xs text-red-700">O registro de código {String(selected?.[config.id])} será excluído ao clicar em Gravar.</p>}
            <div className="flex justify-end gap-2">
              <button type="button" disabled={!editing || saving} onClick={() => { setEditing(false); setSelected(null); setForm({}); setDeleteOnSave(false); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40">Cancelar</button>
              <button type="submit" disabled={!editing || saving} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-40 ${deleteOnSave ? "bg-red-600 text-white" : "bg-emerald-500 text-black"}`}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? "Gravando..." : "Gravar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CadastrosCRUDPage() {
  const searchParams = useSearchParams();
  const [model, setModel] = useState("Forma");

  useEffect(() => {
    const requestedModel = searchParams.get("model");
    if (requestedModel && cadastrosConfig[requestedModel]) setModel(requestedModel);
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      <CadastroEditor key={model} model={model} />
    </div>
  );
}
