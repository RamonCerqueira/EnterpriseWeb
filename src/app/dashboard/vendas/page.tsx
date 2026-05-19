"use client";

import React, { useState } from "react";
import { Percent, Plus, Search, DollarSign, ShoppingBag, ArrowUpRight, TrendingUp, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function VendasPage() {
  const [search, setSearch] = useState("");

  const sales = [
    { id: 1, invoice: "VEN-2026-889", client: "Empresa ABC Ltda", itemsCount: 4, value: 3450.0, method: "Pix", rep: "Ramon Silva", date: "14/05/2026" },
    { id: 2, invoice: "VEN-2026-888", client: "João da Silva ME", itemsCount: 2, value: 1250.0, method: "Cartão de Crédito", rep: "Aline Santos", date: "14/05/2026" },
    { id: 3, invoice: "VEN-2026-887", client: "Condomínio Central", itemsCount: 1, value: 850.0, method: "Boleto Bancário", rep: "Ramon Silva", date: "13/05/2026" },
    { id: 4, invoice: "VEN-2026-886", client: "Supermercado Pão Bom", itemsCount: 12, value: 8900.0, method: "Boleto Faturado", rep: "Lucas Pereira", date: "12/05/2026" },
    { id: 5, invoice: "VEN-2026-885", client: "Faturamento Anual ME", itemsCount: 8, value: 12400.0, method: "Pix", rep: "Aline Santos", date: "11/05/2026" },
  ];

  const filteredSales = sales.filter(
    (s) =>
      s.client.toLowerCase().includes(search.toLowerCase()) ||
      s.invoice.toLowerCase().includes(search.toLowerCase()) ||
      s.rep.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Percent className="h-6 w-6 text-emerald-400" /> Registro de Vendas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize as transações comerciais liquidadas, os faturamentos de pedidos e a performance dos vendedores.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Nova Venda
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Faturamento Total</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">{formatCurrency(26850.0)}</h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">↑ 14.5% vs semana anterior</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Volume de Pedidos</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">5 Vendas</h3>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Média de 5.4 itens por pedido</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Tíquete Médio</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">{formatCurrency(5370.0)}</h3>
          <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Sinal de excelente conversão</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Histórico de Vendas</CardTitle>
            <p className="text-[10px] text-muted-foreground">Listagem de faturamento consolidado emitido no caixa.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por cliente, fatura ou vendedor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {filteredSales.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma venda correspondente encontrada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Código Fatura</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente / Comprador</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Qtd Itens</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Líquido</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Meio de Pagto</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vendedor</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Faturamento</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">{s.invoice}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{s.client}</td>
                    <td className="p-3.5 text-slate-300 font-semibold">{s.itemsCount} un</td>
                    <td className="p-3.5 font-bold text-slate-100">{formatCurrency(s.value)}</td>
                    <td className="p-3.5">
                      <Badge variant="info">
                        {s.method}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-slate-200 font-semibold">{s.rep}</td>
                    <td className="p-3.5 text-muted-foreground font-medium">{s.date}</td>
                    <td className="p-3.5 pr-6 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-emerald-400 flex items-center justify-end gap-1 font-semibold ml-auto">
                        Visualizar <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
