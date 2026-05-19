"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Search, Truck, Clock, CheckCircle, ClipboardList, ArrowUpRight, DollarSign, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function ComprasPage() {
  const [search, setSearch] = useState("");

  const purchases = [
    { id: 1, ref: "COM-2026-042", supplier: "Forn. de Materiais Ltda", itemsCount: 15, value: 2150.0, deliveryDate: "18/05/2026", status: "A caminho" },
    { id: 2, ref: "COM-2026-041", supplier: "Distribuidora Tech S.A.", itemsCount: 4, value: 5800.0, deliveryDate: "20/05/2026", status: "Em cotação" },
    { id: 3, ref: "COM-2026-040", supplier: "Importadora Global ME", itemsCount: 50, value: 12400.0, deliveryDate: "14/05/2026", status: "Entregue" },
    { id: 4, ref: "COM-2026-039", supplier: "Forn. de Materiais Ltda", itemsCount: 8, value: 1250.0, deliveryDate: "10/05/2026", status: "Entregue" },
    { id: 5, ref: "COM-2026-038", supplier: "Distribuidora Tech S.A.", itemsCount: 2, value: 950.0, deliveryDate: "05/05/2026", status: "Cancelada" },
  ];

  const filteredPurchases = purchases.filter(
    (p) =>
      p.supplier.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-emerald-400" /> Suprimentos & Compras
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie cotações de preços de fornecedores, ordens de compra emitidas e recebimento de mercadorias no estoque.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Solicitar Compra
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <CheckCircle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Entregues</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">2 Pedidos</h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Insumos já integrados ao estoque</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Em Cotação</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{formatCurrency(5800.0)}</h3>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">1 Pedido aguardando aprovação</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Em Trânsito</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{formatCurrency(2150.0)}</h3>
          <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Entrega estimada para hoje</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-secondary text-slate-400 flex items-center justify-center border border-border">
              <ClipboardList className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Custo de Suprimentos</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{formatCurrency(22550.0)}</h3>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">5 Compras processadas</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Ordens de Compra</CardTitle>
            <p className="text-[10px] text-muted-foreground">Monitore o fluxo de aquisição e recepção física de insumos.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por fornecedor ou referência..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {filteredPurchases.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma ordem de compra encontrada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Doc. Compra</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fornecedor Razão</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Itens Totais</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Faturado</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data de Entrega</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">{p.ref}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{p.supplier}</td>
                    <td className="p-3.5 text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{p.itemsCount} itens</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-100">{formatCurrency(p.value)}</td>
                    <td className="p-3.5 text-muted-foreground font-medium">{p.deliveryDate}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          p.status === "Entregue" ? "success" :
                            p.status === "A caminho" ? "info" :
                              p.status === "Em cotação" ? "warning" : "destructive"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 pr-6 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-emerald-400 flex items-center justify-end gap-1 font-semibold ml-auto">
                        Detalhes <ArrowUpRight className="h-3.5 w-3.5" />
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
