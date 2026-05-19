"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Percent, Plus, Search, DollarSign, ShoppingBag, 
  TrendingUp, RefreshCw, ChevronLeft, ChevronRight
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SaleRecord {
  id: number;
  invoice: string;
  client: string;
  itemsCount: number;
  value: number;
  method: string;
  rep: string;
  date: string;
  status: string;
}

interface SaleStats {
  totalBilling: number;
  totalOrders: number;
  averageTicket: number;
}

export default function VendasPage() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [stats, setStats] = useState<SaleStats>({ totalBilling: 0, totalOrders: 0, averageTicket: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Debounced trigger
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Sales Ledger from database
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/vendas?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setSales(data.items || []);
        setTotalPages(data.pages || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [debouncedSearch, page]);

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-slate-100 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Percent className="h-6 w-6 text-emerald-400" /> Registro de Vendas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize as transações comerciais liquidadas, controle reservas dinâmicas e lance novos faturamentos de caixa.
          </p>
        </div>

        <Link href="/dashboard/vendas/nova">
          <Button 
            className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Registrar Venda
          </Button>
        </Link>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Faturamento Acumulado</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {stats.totalBilling.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Faturamento bruto em tempo real</span>
        </Card>

        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Volume de Vendas</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {stats.totalOrders} <span className="text-xs font-semibold text-muted-foreground">pedidos</span>
          </h3>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Transações físicas no banco</span>
        </Card>

        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Tíquete Médio</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {stats.averageTicket.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h3>
          <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Sinal de excelente conversão</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#0E1322]/80 border border-border/60 overflow-hidden shadow-xl backdrop-blur-md">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0D18]/45">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Histórico de Pedidos de Venda</CardTitle>
            <p className="text-[10px] text-muted-foreground">Listagem de faturamento físico e reservas comerciais registradas.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por cliente ou código fatura..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#05080E]/90 border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-2">
              <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin" />
              <span className="text-xs text-muted-foreground font-semibold">Consultando faturamentos no SQL Server...</span>
            </div>
          ) : sales.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma venda correspondente encontrada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-[#0E1322]/55">
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider pl-6">Código Fatura</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Cliente / Comprador</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Itens</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Valor Líquido</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Status</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Vendedor</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider pr-6 text-right">Data Emissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition-colors text-xs">
                    <td className="p-3.5 pl-6">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
                        {s.invoice}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-200 font-semibold">{s.client}</td>
                    <td className="p-3.5 text-slate-300 text-center font-bold">{s.itemsCount} un</td>
                    <td className="p-3.5 font-black text-slate-100">
                      {s.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="p-3.5 text-center">
                      {s.status === "Finalizado" ? (
                        <Badge className="bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 font-black uppercase text-[9px] tracking-wider px-2 py-0.5">
                          Finalizado
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-950/50 text-amber-400 border border-amber-500/20 font-black uppercase text-[9px] tracking-wider px-2 py-0.5 animate-pulse-slow">
                          Pendente
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-200 font-semibold">{s.rep}</td>
                    <td className="p-3.5 text-muted-foreground pr-6 text-right font-medium">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Pagination Footer */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-border/40 flex items-center justify-between bg-[#0A0D18]/30">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Página <strong className="text-slate-300">{page}</strong> de <strong className="text-slate-300">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
