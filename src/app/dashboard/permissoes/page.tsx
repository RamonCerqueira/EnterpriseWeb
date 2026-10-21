"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Search, Shield, Key } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PermissoesPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Administrador");

  const roles = [
    { id: 1, name: "Administrador", desc: "Acesso irrestrito a todas as operações, módulos de faturamento, e configurações globais." },
    { id: 2, name: "Vendedor", desc: "Acesso básico de cadastro de clientes, preenchimento de propostas e registro de vendas." },
    { id: 3, name: "Técnico / Operador", desc: "Acesso restrito para consultar, preencher e fechar ordens de serviço (OS) alocadas." },
    { id: 4, name: "Financeiro", desc: "Acesso de contas a receber, fluxo de caixa, conciliação e geração de relatórios de DRE." },
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
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-emerald-700" /> Níveis de Acesso & Permissões
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consulte perfis de referência. As permissões efetivas são configuradas por usuário.
          </p>
        </div>

        <Link
          href="/dashboard/usuarios?view=usuarios"
          className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-500 px-4 text-xs font-semibold text-black shadow-[0_0_10px_rgba(16,185,129,0.15)] transition-colors hover:bg-emerald-400"
        >
          Gerenciar permissões por usuário
        </Link>
      </div>

      {/* Split pane for roles list and specific active settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Roles list */}
        <Card className="lg:col-span-2 bg-[#FFFFFF]/75 border border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/40 bg-[#F8FAFC]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 font-bold">Grupos Definidos</CardTitle>
              <p className="text-[10px] text-muted-foreground">Perfis ilustrativos; não são grupos persistidos no banco.</p>
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
                className="w-full h-8 px-9 pr-4 rounded-lg bg-[#FFFFFF] border border-border/80 text-xs text-slate-800 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
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
                    ? "border-emerald-500/40 bg-emerald-50"
                    : "border-border/80 bg-[#F8FAFC] hover:border-border/100"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className={`h-4 w-4 ${selectedRole === role.name ? "text-emerald-700" : "text-muted-foreground"}`} />
                    <h4 className="text-xs font-bold text-slate-800">{role.name}</h4>
                  </div>
                  <p className="text-[10px] text-muted-foreground max-w-md leading-relaxed font-semibold">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Side: Specific active permissions toggle details */}
        <Card className="bg-[#FFFFFF]/75 border border-border/60 p-5 flex flex-col h-fit">
          <div className="border-b border-border/40 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-bold">
              <Key className="h-4 w-4 text-emerald-700" /> Operações de: {selectedRole}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Esta matriz é apenas uma referência visual. Edite os níveis de acesso no cadastro do usuário.</p>
          </div>

          <div className="space-y-3.5">
            {[
              { op: "Op91", label: "Administração Geral", desc: "Permite controle total do ERP e logs", enabled: selectedRole === "Administrador" },
              { op: "Op3", label: "Cadastro de Clientes", desc: "Visualizar e editar base de clientes/comercial", enabled: selectedRole === "Administrador" || selectedRole === "Vendedor" },
              { op: "Op9", label: "Faturamento de Vendas", desc: "Permite liquidar vendas e emitir pedidos", enabled: selectedRole === "Administrador" || selectedRole === "Vendedor" },
              { op: "Op15", label: "Financeiro & Contas", desc: "Acessar duplicatas, caixa e lançamentos", enabled: selectedRole === "Administrador" || selectedRole === "Financeiro" },
              { op: "Op52", label: "Ordens de Serviço", desc: "Permite emitir e concluir OS de suporte", enabled: selectedRole === "Administrador" || selectedRole === "Técnico / Operador" },
            ].map((permission) => (
              <div key={permission.op} className="flex items-start justify-between gap-3 p-2.5 rounded border border-border/40 bg-[#F8FAFC]/50 select-none">
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 border border-emerald-500/10 rounded">
                      {permission.op}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{permission.label}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold">{permission.desc}</p>
                </div>

                <Badge variant={permission.enabled ? "default" : "secondary"} className="mt-0.5 text-[9px]">
                  {permission.enabled ? "Acesso" : "Sem acesso"}
                </Badge>
              </div>
            ))}
          </div>
          <Link href="/dashboard/usuarios?view=usuarios" className="mt-4 text-center text-xs font-semibold text-emerald-700 hover:underline">
            Abrir cadastro de usuários
          </Link>
        </Card>
      </div>
    </div>
  );
}
