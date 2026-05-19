"use client";

import React, { useState } from "react";
import { BarChart3, Search, FileSpreadsheet, Download, FileText, Calendar, TrendingUp, Users, Boxes, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RelatoriosPage() {
  const [search, setSearch] = useState("");

  const reports = [
    { id: 1, title: "Demonstrativo do Resultado do Exercício (DRE)", desc: "Resumo financeiro mensal de faturamento, despesas operacionais e margem líquida.", category: "Financeiro", format: "PDF / XLSX", icon: DollarSign, color: "text-emerald-400 bg-emerald-950/20" },
    { id: 2, title: "Inventário de Estoque Consolidado", desc: "Saldos físicos atuais, custo ponderado de aquisições e alertas de SKU crítico.", category: "Estoque", format: "XLSX", icon: Boxes, color: "text-amber-400 bg-amber-950/20" },
    { id: 3, title: "Performance de Vendas por Vendedor", desc: "Relatório de conversões, tíquete médio e faturamento emitido por atendente.", category: "Vendas", format: "PDF / CSV", icon: TrendingUp, color: "text-blue-400 bg-blue-950/20" },
    { id: 4, title: "Relação de Clientes e Indicadores (Colaboradores)", desc: "Lista de parceiros ativos cadastrados e indicados na tabela de comissões.", category: "Clientes", format: "PDF", icon: Users, color: "text-purple-400 bg-purple-950/20" },
  ];

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-400" /> Relatórios & Exportador
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gere planilhas consolidadas, baixe demonstrativos fiscais e analise a saúde da sua empresa.
          </p>
        </div>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Relatórios Disponíveis</div>
          <div className="text-2xl font-extrabold text-slate-100">4 Modelos</div>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Prontos para download ou impressão</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Frequência de Acesso</div>
          <div className="text-md font-extrabold text-slate-100">DRE Semanal</div>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Mais gerado pelos administradores</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Última Exportação</div>
          <div className="text-2xl font-extrabold text-slate-100">Ontem, 16:20</div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">Planilha de inventário de estoque</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Exportador Inteligente</CardTitle>
            <p className="text-[10px] text-muted-foreground">Clique para fazer download das planilhas em tempo real.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar relatórios por nome ou tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Reports list */}
        <div className="p-5 grid grid-cols-1 gap-4">
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhum modelo de relatório correspondente.
            </div>
          ) : (
            filteredReports.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border/80 bg-[#0E1320] hover:border-emerald-500/30 transition-all duration-300 group gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${r.color} shrink-0`}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-secondary text-slate-300 tracking-wider">
                        {r.category}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground">Formato: {r.format}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                      {r.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed max-w-2xl">{r.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button size="sm" className="text-xs font-semibold h-8 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
                    <Download className="h-4 w-4" /> Exportar Dados
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
