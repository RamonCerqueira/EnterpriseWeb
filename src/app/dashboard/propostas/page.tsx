"use client";

import React, { useState } from "react";
import { FileText, Plus, Search, CheckCircle, Clock, AlertTriangle, FileSpreadsheet, Loader2, ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function PropostasPage() {
  const [search, setSearch] = useState("");

  const proposals = [
    { id: 1, ref: "PROP-2026-001", client: "João da Silva ME", value: 12480.0, date: "15/05/2026", validUntil: "30/05/2026", status: "Aprovada" },
    { id: 2, ref: "PROP-2026-002", client: "Empresa ABC Ltda", value: 34500.0, date: "14/05/2026", validUntil: "14/06/2026", status: "Em análise" },
    { id: 3, ref: "PROP-2026-003", client: "Condomínio Central", value: 8500.0, date: "12/05/2026", validUntil: "27/05/2026", status: "Pendente" },
    { id: 4, ref: "PROP-2026-004", client: "Supermercado Pão Bom", value: 18900.0, date: "10/05/2026", validUntil: "10/06/2026", status: "Recusada" },
    { id: 5, ref: "PROP-2026-005", client: "Faturamento Anual ME", value: 54000.0, date: "09/05/2026", validUntil: "09/06/2026", status: "Aprovada" },
  ];

  const filteredProps = proposals.filter(
    (p) =>
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-400" /> Prospecção & Propostas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Elabore, gerencie e acompanhe a listagem de propostas comerciais e cotações ativas.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <CheckCircle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Aprovadas</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{formatCurrency(66480.0)}</h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">2 Propostas ganhas</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Em Análise</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{formatCurrency(34500.0)}</h3>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Aguardando retorno do cliente</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Pendentes</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{formatCurrency(8500.0)}</h3>
          <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Exige envio de minuta física</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-secondary text-slate-400 flex items-center justify-center border border-border">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total de Propostas</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{formatCurrency(128780.0)}</h3>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">5 Propostas registradas</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Painel de Propostas</CardTitle>
            <p className="text-[10px] text-muted-foreground">Listagem comercial e vencimento de orçamentos emitidos.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por cliente ou referência..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {filteredProps.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma proposta correspondente encontrada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Referência</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente Razão</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Bruto</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Emissão</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vencimento</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredProps.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">{p.ref}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{p.client}</td>
                    <td className="p-3.5 font-bold text-slate-100">{formatCurrency(p.value)}</td>
                    <td className="p-3.5 text-muted-foreground font-medium">{p.date}</td>
                    <td className="p-3.5 text-muted-foreground font-medium">{p.validUntil}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          p.status === "Aprovada" ? "success" :
                            p.status === "Em análise" ? "info" :
                              p.status === "Pendente" ? "warning" : "destructive"
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
