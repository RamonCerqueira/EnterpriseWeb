"use client";

import React, { useState } from "react";
import { ShieldAlert, Plus, Search, CheckCircle, Shield, Edit, Trash2, Key, Users, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PermissoesPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Administrador");

  const roles = [
    { id: 1, name: "Administrador", desc: "Acesso irrestrito a todas as operações, módulos de faturamento, e configurações globais.", usersCount: 1, ops: ["Op91", "Op3", "Op5", "Op15", "Op28"] },
    { id: 2, name: "Vendedor", desc: "Acesso básico de cadastro de clientes, preenchimento de propostas e registro de vendas.", usersCount: 2, ops: ["Op3", "Op84", "Op9"] },
    { id: 3, name: "Técnico / Operador", desc: "Acesso restrito para consultar, preencher e fechar ordens de serviço (OS) alocadas.", usersCount: 2, ops: ["Op52"] },
    { id: 4, name: "Financeiro", desc: "Acesso de contas a receber, fluxo de caixa, conciliação e geração de relatórios de DRE.", usersCount: 1, ops: ["Op15", "Op33"] },
  ];

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-emerald-400" /> Níveis de Acesso & Permissões
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure grupos de permissão (roles) e atribua privilégios com chaves operacionais específicas do SoftLine ERP.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Novo Nível de Acesso
        </Button>
      </div>

      {/* Split pane for roles list and specific active settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Roles list */}
        <Card className="lg:col-span-2 bg-[#121826]/75 border border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/40 bg-[#0E131F]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-200 font-bold">Grupos Definidos</CardTitle>
              <p className="text-[10px] text-muted-foreground">Perfis de acesso cadastrados na base.</p>
            </div>
            
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Filtrar perfis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 px-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="p-4 space-y-3">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.name)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                  selectedRole === role.name
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-border/80 bg-[#0E1320] hover:border-border/100"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className={`h-4 w-4 ${selectedRole === role.name ? "text-emerald-400" : "text-muted-foreground"}`} />
                    <h4 className="text-xs font-bold text-slate-200">{role.name}</h4>
                    <Badge variant="secondary" className="text-[9px] font-extrabold px-1.5 py-0.5">
                      {role.usersCount} usuários
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground max-w-md leading-relaxed font-semibold">{role.desc}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button variant="ghost" size="sm" className="h-7 px-2 hover:text-emerald-400">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 hover:text-rose-400" disabled={role.name === "Administrador"}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Side: Specific active permissions toggle details */}
        <Card className="bg-[#121826]/75 border border-border/60 p-5 flex flex-col h-fit">
          <div className="border-b border-border/40 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 font-bold">
              <Key className="h-4 w-4 text-emerald-400" /> Operações de: {selectedRole}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Ajuste fino dos privilégios de transação SQL.</p>
          </div>

          <div className="space-y-3.5">
            {[
              { op: "Op91", label: "Administração Geral", desc: "Permite controle total do ERP e logs", enabled: selectedRole === "Administrador" },
              { op: "Op3", label: "Cadastro de Clientes", desc: "Visualizar e editar base de clientes/comercial", enabled: selectedRole === "Administrador" || selectedRole === "Vendedor" },
              { op: "Op9", label: "Faturamento de Vendas", desc: "Permite liquidar vendas e emitir pedidos", enabled: selectedRole === "Administrador" || selectedRole === "Vendedor" },
              { op: "Op15", label: "Financeiro & Contas", desc: "Acessar duplicatas, caixa e lançamentos", enabled: selectedRole === "Administrador" || selectedRole === "Financeiro" },
              { op: "Op52", label: "Ordens de Serviço", desc: "Permite emitir e concluir OS de suporte", enabled: selectedRole === "Administrador" || selectedRole === "Técnico / Operador" },
            ].map((permission) => (
              <div key={permission.op} className="flex items-start justify-between gap-3 p-2.5 rounded border border-border/40 bg-[#0E1320]/50 select-none">
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1 border border-emerald-500/10 rounded">
                      {permission.op}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{permission.label}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold">{permission.desc}</p>
                </div>

                <input
                  type="checkbox"
                  checked={permission.enabled}
                  onChange={() => {}}
                  disabled={selectedRole === "Administrador"}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50 mt-0.5"
                />
              </div>
            ))}
          </div>

          {selectedRole !== "Administrador" && (
            <Button className="w-full text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black mt-4 flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
              Salvar Privilégios
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
