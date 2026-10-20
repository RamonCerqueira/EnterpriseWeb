"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Search, Tags } from "lucide-react";

type PriceItem = {
  id: number;
  nome: string;
  codigo: string;
  custoTabela: number;
  markupTabela: number;
  preco: number;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function PriceTablePage() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ limit: "1000" });
        if (search.trim()) params.set("search", search.trim());
        const response = await fetch(`/api/produtos?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Não foi possível carregar a tabela.");
        setItems(data.items || []);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Não foi possível carregar a tabela.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [search, reload]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-100 md:text-2xl"><Tags className="h-6 w-6 text-emerald-400" /> Tabela de Preços</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Consulta dos valores de tabela, custo e markup dos itens cadastrados.</p>
        </div>
        <button type="button" onClick={() => setReload(value => value + 1)} className="flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-secondary/40 px-3 text-xs font-semibold text-slate-200 hover:bg-secondary">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
      </div>

      <section className="overflow-hidden rounded-xl border border-border/60 bg-[#121826]/75">
        <div className="border-b border-border/40 p-4">
          <label className="relative block max-w-xl">
            <span className="sr-only">Buscar item na tabela</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por código ou descrição..." className="h-9 w-full rounded-lg border border-border/70 bg-[#0F1420] pl-9 pr-3 text-xs text-slate-100 outline-none focus:border-emerald-500" />
          </label>
        </div>
        {error ? <p role="alert" className="m-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">{error}</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-[#0E131F]/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><tr><th className="p-3.5">Código</th><th className="p-3.5">Item</th><th className="p-3.5 text-right">Custo tabela</th><th className="p-3.5 text-right">Markup</th><th className="p-3.5 text-right">Preço de venda</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={5} className="p-14 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-400" /><span className="mt-2 block text-muted-foreground">Carregando tabela...</span></td></tr>
                  : items.length === 0 ? <tr><td colSpan={5} className="p-14 text-center text-muted-foreground">Nenhum item encontrado.</td></tr>
                  : items.map(item => <tr key={item.id} className="border-t border-border/40 hover:bg-slate-800/35"><td className="p-3.5 font-semibold text-emerald-400">{item.codigo || item.id}</td><td className="p-3.5 font-medium text-slate-200">{item.nome}</td><td className="p-3.5 text-right text-slate-300">{currency.format(item.custoTabela || 0)}</td><td className="p-3.5 text-right text-slate-300">{item.markupTabela || 0}%</td><td className="p-3.5 text-right font-bold text-emerald-300">{currency.format(item.preco || 0)}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
