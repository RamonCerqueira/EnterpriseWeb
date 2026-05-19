"use client";

import React, { useState } from "react";
import { Boxes, Plus, Search, Tag, DollarSign, Layers, AlertTriangle, CheckCircle, Package, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EstoquePage() {
  const [search, setSearch] = useState("");

  const transactions = [
    { id: 1, type: "Entrada", item: "Cabo HDMI 2m High Speed", qty: 50, ref: "NFE-5421", date: "15/05/2026 10:30", user: "Ramon Silva" },
    { id: 2, type: "Saída", item: "Conector RJ45 Cat6", qty: 250, ref: "OS-1289", date: "14/05/2026 09:15", user: "Carlos Souza" },
    { id: 3, type: "Entrada", item: "Roteador Wireless AC1200", qty: 10, ref: "NFE-5419", date: "12/05/2026 08:45", user: "Ramon Silva" },
    { id: 4, type: "Saída", item: "Cabo HDMI 2m High Speed", qty: 3, ref: "OS-1286", date: "11/05/2026 16:20", user: "Fabio Lima" },
    { id: 5, type: "Ajuste", item: "Alicate de Crimpagem Pro", qty: -1, ref: "AJ-0012", date: "10/05/2026 14:10", user: "Ramon Silva" },
  ];

  const filteredTrans = transactions.filter(
    (t) =>
      t.item.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Boxes className="h-6 w-6 text-emerald-400" /> Controle de Estoque
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acompanhe o saldo do inventário físico, controle entradas de fornecedores, saídas por ordens de serviço e auditorias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="text-xs font-semibold h-9 border border-border/80 bg-card cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-1 animate-spin-slow" /> Ajuste Físico
          </Button>
          <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
            <Plus className="h-4 w-4" /> Registrar Entrada
          </Button>
        </div>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <Package className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total de Itens</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">1.482 Unidades</h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Saldos atualizados em tempo real</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <Boxes className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Valores em Estoque</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">R$ 48.200,00</h3>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Preço de custo ponderado</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-rose-950/45 text-rose-400 flex items-center justify-center border border-rose-500/10">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Itens Críticos</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">5 SKU Críticos</h3>
          <span className="text-[9px] text-rose-400 font-semibold mt-1 block">Abaixo do estoque de segurança</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Sem Giro</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">12 Itens Ociosos</h3>
          <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Sem movimentações há 90 dias</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Histórico de Movimentação</CardTitle>
            <p className="text-[10px] text-muted-foreground">Extrato de entradas, saídas e acertos de mercadoria.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por item, referência ou tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          {filteredTrans.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma movimentação de estoque encontrada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Direção</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Item Descritivo</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quantidade</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Doc. Referência</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Registrado por</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right font-medium">Data Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredTrans.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6">
                      <div className="flex items-center gap-1.5 font-bold">
                        {t.type === "Entrada" ? (
                          <>
                            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400">Entrada</span>
                          </>
                        ) : t.type === "Saída" ? (
                          <>
                            <ArrowDownRight className="h-4 w-4 text-rose-400" />
                            <span className="text-rose-400">Saída</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
                            <span className="text-amber-400">Ajuste</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 font-semibold">{t.item}</td>
                    <td className="p-3.5 font-bold text-slate-100">
                      {t.qty > 0 ? `+${t.qty}` : t.qty} un
                    </td>
                    <td className="p-3.5 text-muted-foreground font-mono font-bold">{t.ref}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{t.user}</td>
                    <td className="p-3.5 text-muted-foreground pr-6 text-right font-semibold">{t.date}</td>
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
