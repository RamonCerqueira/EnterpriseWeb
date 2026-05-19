"use client";

import React, { useState } from "react";
import { Contact, Plus, Search, Mail, Phone, MapPin, Loader2, AlertCircle, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContatosPage() {
  const [search, setSearch] = useState("");

  const contacts = [
    { id: 1, name: "Lucas Pereira", company: "Supermercado Pão Bom", role: "Gerente de Compras", email: "lucas@paobom.com", phone: "(11) 98888-7766", status: "Cliente" },
    { id: 2, name: "Beatriz Oliveira", company: "Empresa ABC Ltda", role: "Diretora Financeira", email: "beatriz@empresaabc.com", phone: "(11) 97777-6655", status: "Cliente" },
    { id: 3, name: "Roberto Santos", company: "Importadora Global ME", role: "Despachante Aduaneiro", email: "roberto@importadoraglobal.com", phone: "(21) 96666-5544", status: "Fornecedor" },
    { id: 4, name: "Juliana Costa", company: "SoftLine Sistemas", role: "Atendente de Suporte", email: "juliana.costa@softline.com", phone: "(11) 95555-4433", status: "Parceiro" },
  ];

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Contact className="h-6 w-6 text-emerald-400" /> Agenda de Contatos CRM
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cadastre, edite e consulte a lista de representantes, contatos corporativos e interlocutores dos seus clientes e fornecedores.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Novo Contato
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Contatos Cadastrados</div>
          <div className="text-2xl font-extrabold text-slate-100">4 Pessoas</div>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Acesso unificado do comercial</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Última Interação</div>
          <div className="text-md font-extrabold text-slate-100">Lucas Pereira</div>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Fatura enviada via WhatsApp</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Novos Contatos (Mês)</div>
          <div className="text-2xl font-extrabold text-slate-100">+2 no Período</div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">Crescimento de 50% vs abril</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Banco de Contatos CRM</CardTitle>
            <p className="text-[10px] text-muted-foreground">Localize interlocutores por nome, cargo ou empresa parceira.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por nome, empresa ou cargo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhum contato correspondente localizado.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Nome Completo</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Empresa</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cargo / Função</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">E-mail</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Celular</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Perfil</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6 font-semibold text-slate-200">{c.name}</td>
                    <td className="p-3.5 text-slate-200 font-bold">{c.company}</td>
                    <td className="p-3.5 text-slate-300 font-semibold">{c.role}</td>
                    <td className="p-3.5 text-slate-300 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{c.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          c.status === "Cliente" ? "success" :
                            c.status === "Fornecedor" ? "warning" : "info"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:text-emerald-400">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:text-rose-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
