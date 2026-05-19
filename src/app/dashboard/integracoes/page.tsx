"use client";

import React, { useState } from "react";
import { Network, Plus, Search, HelpCircle, ToggleLeft, ToggleRight, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IntegracoesPage() {
  const [search, setSearch] = useState("");

  const integrations = [
    { id: 1, name: "WhatsApp Gateway Z-API", type: "Comunicação", desc: "Envio automático de ordens de serviço, faturas e propostas PDF pelo WhatsApp.", status: "Ativo", icon: MessageSquare, color: "text-emerald-400 bg-emerald-950/20" },
    { id: 2, name: "Asaas Gateway de Pagamentos", type: "Financeiro", desc: "Geração e baixa automatizada de boletos bancários, Pix dinâmico e cobranças recorrentes.", status: "Ativo", icon: Sparkles, color: "text-blue-400 bg-blue-950/20" },
    { id: 3, name: "Focus NFe (Emissão de Notas)", type: "Fiscal", desc: "Integração para emissão e cancelamento automático de NF-e, NFS-e e NFC-e junto à SEFAZ.", status: "Inativo", icon: Network, color: "text-rose-400 bg-rose-950/20" },
    { id: 4, name: "Correios API (Cálculo de Frete)", type: "Logística", desc: "Consulta em tempo real de prazos, preços de frete e rastreio de pacotes de despacho.", status: "Ativo", icon: Network, color: "text-amber-400 bg-amber-950/20" },
  ];

  const filteredIntegrations = integrations.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Network className="h-6 w-6 text-emerald-400" /> Integrações & APIs
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie conexões externas, webhooks, credenciais de APIs e gateways de pagamento do ERP.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Nova Integração
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Canais Conectados</div>
          <div className="text-2xl font-extrabold text-slate-100">3 Gateways</div>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">WhatsApp, Asaas e Correios em operação</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Status do Focus NFe</div>
          <div className="text-md font-extrabold text-rose-400 flex items-center gap-1">
            <ShieldAlert className="h-4 w-4" /> Inativo / Offline
          </div>
          <span className="text-[9px] text-rose-400 font-semibold mt-1 block">Verifique as credenciais da SEFAZ</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Chamadas de API (Mês)</div>
          <div className="text-2xl font-extrabold text-slate-100">12.482 Req</div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">99.98% de requisições bem sucedidas</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Painel de Conexões</CardTitle>
            <p className="text-[10px] text-muted-foreground">Monitore o status do webhook ativo e credenciais de autenticação.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar integrações por nome ou tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Integration list cards */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIntegrations.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma integração ativa correspondente.
            </div>
          ) : (
            filteredIntegrations.map((i) => (
              <div
                key={i.id}
                className="flex flex-col p-4 rounded-lg border border-border/80 bg-[#0E1320] hover:border-emerald-500/30 transition-all duration-300 group justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-8.5 w-8.5 rounded-lg flex items-center justify-center ${i.color} shrink-0`}>
                        <i.icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-secondary text-slate-300 tracking-wider">
                          {i.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200 mt-0.5 group-hover:text-emerald-400 transition-colors">
                          {i.name}
                        </h4>
                      </div>
                    </div>

                    <Badge
                      variant={i.status === "Ativo" ? "success" : "destructive"}
                    >
                      {i.status}
                    </Badge>
                  </div>

                  <p className="text-[10px] text-muted-foreground font-medium leading-relaxed text-left min-h-[40px]">
                    {i.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-3">
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-semibold">
                    {i.status === "Ativo" ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Sincronizado há 2 min</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                        <span>Requer reautenticação</span>
                      </>
                    )}
                  </div>

                  <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    Configurar <ArrowUpRight className="h-3.5 w-3.5" />
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
