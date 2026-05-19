"use client";

import React from "react";
import { 
  Search, Users, Briefcase, Mail, Phone, ShieldCheck, ToggleLeft, ToggleRight, Edit, Trash2, Loader2
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UnifiedUsersTableProps {
  users: any[];
  isLoading: boolean;
  search: string;
  setSearch: (v: string) => void;
  editingUser: any;
  loadUserForEdit: (u: any) => void;
  setCurrentStep: (step: "user" | "collaborator") => void;
  handleToggleActive: (u: any) => void;
  setDeletingUser: (u: any) => void;
}

export default function UnifiedUsersTable({
  users,
  isLoading,
  search,
  setSearch,
  editingUser,
  loadUserForEdit,
  setCurrentStep,
  handleToggleActive,
  setDeletingUser
}: UnifiedUsersTableProps) {
  
  const filteredUsers = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.usuario.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden backdrop-blur-md">
      <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
        <div>
          <CardTitle className="text-sm font-bold text-slate-200">Lista Unificada de Credenciais e Equipes</CardTitle>
          <p className="text-[10px] text-muted-foreground">Monitore acessos ao ERP e associe informações de colaboradores.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            type="text"
            placeholder="Filtrar por nome ou login..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-7 w-7 text-emerald-400 animate-spin" />
            <span className="text-xs text-muted-foreground font-semibold font-mono">Buscando registros em Senha e Indicado...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
            Nenhum usuário cadastrado correspondente encontrado.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-[#0E131F]/50 text-slate-400 font-bold text-[10px]">
                <th className="p-3.5 pl-6 uppercase tracking-wider">Usuário (Conta Senha)</th>
                <th className="p-3.5 uppercase tracking-wider">Perfil Colaborador (Tabela Indicado)</th>
                <th className="p-3.5 uppercase tracking-wider">Grupo Acesso</th>
                <th className="p-3.5 uppercase tracking-wider">Status ERP</th>
                <th className="p-3.5 uppercase tracking-wider">Permissões</th>
                <th className="p-3.5 pr-6 text-right uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-xs text-slate-300">
              {filteredUsers.map((u) => {
                const opsCount = Object.values(u.permissions || {}).filter(v => v !== "0" && v !== "N" && v !== undefined).length;
                const hasCol = !!u.colaborador;

                return (
                  <tr key={u.id} className={`hover:bg-[#1C2538]/30 transition-all ${u.inativo ? "opacity-60" : ""}`}>
                    
                    <td className="p-3.5 pl-6 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-[10px] border ${
                          u.inativo 
                            ? "bg-slate-950/40 border-slate-500/15 text-slate-400"
                            : "bg-emerald-950/40 border-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.05)]"
                        }`}>
                          {u.nome.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-200 text-xs">{u.nome}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">@{u.usuario}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {hasCol ? (
                        <div className="flex flex-col gap-1 max-w-[220px] bg-[#0E1320]/45 p-2 rounded-lg border border-border/30">
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 shrink-0" /> {u.colaborador.cargo || "Colaborador"}
                          </span>
                          {u.colaborador.email && (
                            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono truncate">
                              <Mail className="h-3 w-3 shrink-0" /> {u.colaborador.email}
                            </span>
                          )}
                          {u.colaborador.telefone && (
                            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                              <Phone className="h-3 w-3 shrink-0" /> {u.colaborador.telefone}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60 italic">Nenhum perfil de colaborador</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <Badge
                        variant={u.role === "Administrador" ? "success" : "info"}
                        className="text-[9px] font-bold px-2 py-0.5"
                      >
                        {u.role}
                      </Badge>
                    </td>

                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u)}
                        className="flex items-center gap-1.5 font-semibold transition-all hover:opacity-85 cursor-pointer text-slate-300"
                      >
                        {u.inativo ? (
                          <>
                            <ToggleLeft className="h-5 w-5 text-rose-500 shrink-0" />
                            <span className="text-rose-400 font-bold text-[10px]">Inativo</span>
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-5 w-5 text-emerald-400 shrink-0" />
                            <span className="text-emerald-400 font-bold text-[10px]">Ativo</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5 text-slate-300 font-semibold font-mono">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className={`h-4 w-4 ${u.inativo ? "text-slate-500" : "text-emerald-400"}`} />
                        <span>{opsCount} / 105</span>
                      </div>
                    </td>

                    <td className="p-3.5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            loadUserForEdit(u);
                            setCurrentStep("user");
                          }}
                          className="h-8 px-2.5 text-[10px] font-bold hover:text-emerald-400 hover:bg-emerald-500/5 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeletingUser(u)}
                          className="h-8 px-2.5 text-[10px] font-bold hover:text-rose-400 hover:bg-rose-500/5 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                        </Button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
