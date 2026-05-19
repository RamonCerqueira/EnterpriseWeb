"use client";

import React from "react";
import { Users, Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CollaboratorsSidebarProps {
  users: any[];
  isLoading: boolean;
  search: string;
  setSearch: (v: string) => void;
  selectedUser: any;
  loadUserRecord: (u: any) => void;
  handleStartCreateNew: () => void;
}

export default function CollaboratorsSidebar({
  users,
  isLoading,
  search,
  setSearch,
  selectedUser,
  loadUserRecord,
  handleStartCreateNew
}: CollaboratorsSidebarProps) {
  
  const filteredUsersList = users.filter(u => 
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.usuario.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[320px] flex flex-col bg-[#121826]/75 border border-border/80 rounded-2xl backdrop-blur-xl shrink-0 overflow-hidden text-slate-100">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/40 space-y-3 bg-[#0E131F]/30">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Contas & Equipe
          </h3>
          <Badge className="text-[9px] bg-slate-800 border-border text-slate-300">Total: {users.length}</Badge>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            type="text"
            placeholder="Buscar colaborador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#0F1420] border border-border/70 text-[11px] text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 font-semibold"
          />
        </div>

        <Button
          type="button"
          onClick={handleStartCreateNew}
          className="w-full h-8.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2.5">
            <Loader2 className="h-5.5 w-5.5 text-emerald-400 animate-spin" />
            <span className="text-[10px] text-muted-foreground font-mono">Buscando banco...</span>
          </div>
        ) : filteredUsersList.length === 0 ? (
          <div className="py-12 text-center text-[10px] text-muted-foreground">
            Nenhum colaborador encontrado.
          </div>
        ) : (
          filteredUsersList.map((u) => {
            const isActive = !u.inativo;
            const hasCol = !!u.colaborador;
            const isSel = selectedUser?.id === u.id;

            return (
              <div
                key={u.id}
                onClick={() => loadUserRecord(u)}
                className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSel
                    ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.06)]"
                    : "bg-[#0E1320]/40 border-border/50 hover:bg-[#1C2538]/30 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-extrabold text-[10px] border shrink-0 ${
                    isSel 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-[#0F1420] border-border text-slate-400"
                  }`}>
                    {u.nome.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex flex-col min-w-0 text-left">
                    <span className={`text-[11px] font-bold truncate ${isSel ? "text-slate-100" : "text-slate-300"}`}>
                      {u.nome}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono truncate">
                      @{u.usuario} • {hasCol ? (u.colaborador.cargo || "Ficha") : "Sem ficha"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
