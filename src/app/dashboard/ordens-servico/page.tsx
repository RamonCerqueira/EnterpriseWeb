"use client";

import React, { useState } from "react";
import { ClipboardList, Plus, Search, CheckCircle, Clock, AlertTriangle, User, Calendar, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrdensServicoPage() {
  const [search, setSearch] = useState("");

  const orders = [
    { id: 1, ref: "OS-1289", client: "Condomínio Central", service: "Manutenção Preventiva de Motores", tech: "Carlos Souza", date: "14/05/2026", deadline: "17/05/2026", status: "Em andamento" },
    { id: 2, ref: "OS-1288", client: "Empresa ABC Ltda", service: "Instalação Elétrica Trifásica", tech: "Fabio Lima", date: "13/05/2026", deadline: "15/05/2026", status: "Atrasada" },
    { id: 3, ref: "OS-1287", client: "João da Silva ME", service: "Configuração de Rede e Servidor", tech: "Carlos Souza", date: "11/05/2026", deadline: "12/05/2026", status: "Concluída" },
    { id: 4, ref: "OS-1286", client: "Supermercado Pão Bom", service: "Reparo de Câmaras de Resfriamento", tech: "Fabio Lima", date: "10/05/2026", deadline: "11/05/2026", status: "Concluída" },
    { id: 5, ref: "OS-1285", client: "Faturamento Anual ME", service: "Consultoria em TI / Integração", tech: "Carlos Souza", date: "09/05/2026", deadline: "15/05/2026", status: "Pendente" },
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.ref.toLowerCase().includes(search.toLowerCase()) ||
      o.tech.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-emerald-400" /> Ordens de Serviço (OS)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Controle as ordens de serviço preventivas e corretivas, atribua técnicos e gerencie prazos de entrega.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Registrar Nova OS
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <CheckCircle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Concluídas</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">2 Ordens</h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">100% de satisfação do cliente</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Em Andamento</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">1 Ordem</h3>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Técnico Carlos Souza alocado</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-rose-950/45 text-rose-400 flex items-center justify-center border border-rose-500/10">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Atrasadas</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">1 Ordem</h3>
          <span className="text-[9px] text-rose-400 font-semibold mt-1 block">Instalação elétrica sob risco</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-secondary text-slate-400 flex items-center justify-center border border-border">
              <ClipboardList className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Registrado</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">5 Ordens</h3>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">Média de 3.2 dias para término</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Painel Operacional de OS</CardTitle>
            <p className="text-[10px] text-muted-foreground">Monitore o status do serviço executado em campo e cronograma.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por cliente, referência ou técnico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma ordem de serviço correspondente encontrada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Código OS</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente Razão</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Serviço Solicitado</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Responsável Técnico</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Registro</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Entrega</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">{o.ref}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">{o.client}</td>
                    <td className="p-3.5 text-slate-300 font-medium">{o.service}</td>
                    <td className="p-3.5 text-slate-200 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{o.tech}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-muted-foreground font-medium">{o.date}</td>
                    <td className="p-3.5 text-muted-foreground font-medium">{o.deadline}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          o.status === "Concluída" ? "success" :
                            o.status === "Em andamento" ? "info" :
                              o.status === "Pendente" ? "warning" : "destructive"
                        }
                      >
                        {o.status}
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
