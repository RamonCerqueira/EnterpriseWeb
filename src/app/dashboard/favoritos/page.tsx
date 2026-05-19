"use client";

import React, { useState } from "react";
import { Star, Search, ArrowUpRight, Trash2, ShieldAlert, FileText, DollarSign, Users, Award, Pin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FavoritosPage() {
  const [search, setSearch] = useState("");

  const favorites = [
    { id: 1, type: "Cliente", title: "João da Silva ME", detail: "Faturamento Anual: R$ 150.000", icon: Users, color: "text-emerald-400 bg-emerald-950/20" },
    { id: 2, type: "Relatório", title: "DRE Mensal Consolidado", detail: "Atualizado em: Hoje, 14:30", icon: FileText, color: "text-blue-400 bg-blue-950/20" },
    { id: 3, type: "Financeiro", title: "Contas a Receber (Vencidos)", detail: "12 faturas pendentes de liquidação", icon: DollarSign, color: "text-rose-400 bg-rose-950/20" },
    { id: 4, type: "Proposta", title: "Proposta Comercial #P-2345", detail: "Status: Enviado para aprovação", icon: FileText, color: "text-amber-400 bg-amber-950/20" },
    { id: 5, type: "Segurança", title: "Auditoria de Permissões", detail: "Última verificação: Há 2 dias", icon: ShieldAlert, color: "text-purple-400 bg-purple-950/20" },
  ];

  const filteredFavs = favorites.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Star className="h-6 w-6 text-emerald-400 fill-emerald-400/20 animate-pulse" /> Meus Favoritos
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acesso rápido aos seus relatórios, propostas, clientes e transações marcados como prioritários.
          </p>
        </div>
      </div>

      {/* Grid Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Total de Favoritos</div>
          <div className="text-2xl font-extrabold text-slate-100">5 Itens</div>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Atalhos configurados no sistema</span>
        </Card>
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Mais Acessado</div>
          <div className="text-md font-extrabold text-slate-100">DRE Mensal Consolidado</div>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Visualizado 14 vezes essa semana</span>
        </Card>
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Última Modificação</div>
          <div className="text-2xl font-extrabold text-slate-100">Há 20 min</div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">Removido 1 item obsoleto</span>
        </Card>
      </div>

      {/* Card Grid Container */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Meus Atalhos Marcados</CardTitle>
            <p className="text-[10px] text-muted-foreground">Listagem personalizada de links e ferramentas prioritárias.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por nome ou tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Favorites list */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFavs.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhum atalho favorito encontrado.
            </div>
          ) : (
            filteredFavs.map((fav) => (
              <div
                key={fav.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/80 bg-[#0E1320] hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${fav.color} shrink-0`}>
                    <fav.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-secondary text-slate-300 tracking-wider">
                      {fav.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200 mt-1 group-hover:text-emerald-400 transition-colors">
                      {fav.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{fav.detail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-400 shrink-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400 shrink-0">
                    <Trash2 className="h-4 w-4" />
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
