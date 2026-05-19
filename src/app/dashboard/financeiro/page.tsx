"use client";

import React, { useState } from "react";
import { DollarSign, Plus, Search, TrendingUp, TrendingDown, Wallet, Calendar, AlertCircle, ArrowUpRight, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function FinanceiroPage() {
  const [search, setSearch] = useState("");

  const transactions = [
    { id: 1, type: "Recebimento", desc: "Pagamento de Duplicata NFE-201", ref: "REC-5421", entity: "João da Silva ME", value: 1250.0, status: "Liquidado", date: "14/05/2026" },
    { id: 2, type: "Despesa", desc: "Fornecimento de Cabos e Racks", ref: "PAG-1082", entity: "Forn. de Materiais Ltda", value: 2150.0, status: "Pendente", date: "13/05/2026" },
    { id: 3, type: "Recebimento", desc: "Faturamento Fatura VEN-882", ref: "REC-5420", entity: "Empresa ABC Ltda", value: 3450.0, status: "Liquidado", date: "12/05/2026" },
    { id: 4, type: "Despesa", desc: "Hospedagem AWS e Cloudflare", ref: "PAG-1081", entity: "Amazon AWS Services", value: 580.0, status: "Liquidado", date: "10/05/2026" },
    { id: 5, type: "Despesa", desc: "Aluguel da Sede Administrativa", ref: "PAG-1080", entity: "Imobiliária Central", value: 4500.0, status: "Liquidado", date: "05/05/2026" },
  ];

  const filteredTrans = transactions.filter(
    (t) =>
      t.entity.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-400" /> Fluxo de Caixa & Finanças
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie o plano de contas, contas a pagar, contas a receber, faturamentos, e conciliação bancária do ERP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="text-xs font-semibold h-9 border border-border/80 bg-card cursor-pointer">
            <BarChart3 className="h-4 w-4 mr-1" /> DRE Mensal
          </Button>
          <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
            <Plus className="h-4 w-4" /> Novo Lançamento
          </Button>
        </div>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Receitas (Mês)</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">{formatCurrency(4700.0)}</h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">↑ 18.2% vs mês anterior</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-rose-950/45 text-rose-400 flex items-center justify-center border border-rose-500/10">
              <TrendingDown className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Despesas (Mês)</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">{formatCurrency(7230.0)}</h3>
          <span className="text-[9px] text-rose-400 font-semibold mt-1 block">↓ 8.5% economia em AWS</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Saldo Líquido</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">{formatCurrency(-2530.0)}</h3>
          <span className="text-[9px] text-rose-400 font-semibold mt-1 block">Déficit provisório de capital</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <AlertCircle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Inadimplência</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">{formatCurrency(28650.5)}</h3>
          <span className="text-[9px] text-rose-400 font-semibold mt-1 block">12 Títulos vencidos</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Livro de Lançamentos</CardTitle>
            <p className="text-[10px] text-muted-foreground">Transações de entradas e saídas correntes e previstas.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por cliente, referência ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {filteredTrans.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma transação financeira correspondente.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Direção</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descrição / Lançamento</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Referência</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente / Favorecido</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Líquido</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Conciliação</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right font-medium">Data Emissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredTrans.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6">
                      <div className="flex items-center gap-1.5 font-bold">
                        {t.type === "Recebimento" ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                            <span className="text-emerald-400">Recebimento</span>
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                            <span className="text-rose-400">Despesa</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 font-semibold">{t.desc}</td>
                    <td className="p-3.5 text-muted-foreground font-mono font-bold">{t.ref}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{t.entity}</td>
                    <td className="p-3.5 font-bold text-slate-100">{formatCurrency(t.value)}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={t.status === "Liquidado" ? "success" : "warning"}
                      >
                        {t.status}
                      </Badge>
                    </td>
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
