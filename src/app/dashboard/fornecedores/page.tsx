"use client";

import React, { useState } from "react";
import { Truck, Plus, Search, Mail, Phone, MapPin, Loader2, AlertCircle, Edit, Trash2, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FornecedoresPage() {
  const [search, setSearch] = useState("");

  const suppliers = [
    { id: 1, name: "Forn. de Materiais Ltda", cnpj: "12.345.678/0001-90", email: "contato@fornmateriais.com", phone: "(11) 3322-1100", category: "Cabos & Conectores", city: "São Paulo - SP" },
    { id: 2, name: "Distribuidora Tech S.A.", cnpj: "98.765.432/0001-10", email: "compras@distribuidoratech.com.br", phone: "(11) 4004-9900", category: "Equipamentos de Rede", city: "Campinas - SP" },
    { id: 3, name: "Importadora Global ME", cnpj: "45.888.111/0001-20", email: "global@importadoraglobal.com", phone: "(21) 2500-1200", category: "Sobressalentes", city: "Rio de Janeiro - RJ" },
    { id: 4, name: "Metalúrgica Força Ltda", cnpj: "33.222.111/0001-50", email: "vendas@metalforca.com.br", phone: "(41) 3222-4400", category: "Ferragens & Racks", city: "Curitiba - PR" },
  ];

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.cnpj.includes(search)
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Truck className="h-6 w-6 text-emerald-400" /> Cadastro de Fornecedores
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cadastre, pesquise e controle a listagem de parceiros atacadistas e fornecedores de insumos integrada à tabela `fornecedor`.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Plus className="h-4 w-4" /> Adicionar Fornecedor
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Fornecedores Ativos</div>
          <div className="text-2xl font-extrabold text-slate-100">4 Cadastrados</div>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Todos com homologação fiscal ativa</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Categorias de Insumos</div>
          <div className="text-md font-extrabold text-slate-100">4 Especialidades</div>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Equipamentos, Cabos, Metalurgia</span>
        </Card>

        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Última Aquisição</div>
          <div className="text-2xl font-extrabold text-slate-100">Hoje, 10:30</div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">Cabo HDMI 2m de Forn. de Materiais</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Parceiros de Suprimento</CardTitle>
            <p className="text-[10px] text-muted-foreground">Listagem de fornecedores e empresas prestadoras de serviço.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por nome, CNPJ ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {filteredSuppliers.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhum fornecedor correspondente cadastrado.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Razão / Nome Fantasia</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CNPJ</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">E-mail de Compras</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefone Comercial</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoria Fornecida</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Localidade</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="p-3.5 pl-6 font-semibold text-slate-200">{s.name}</td>
                    <td className="p-3.5 text-muted-foreground font-mono font-bold">{s.cnpj}</td>
                    <td className="p-3.5 text-slate-300 font-semibold">{s.email}</td>
                    <td className="p-3.5 text-slate-300 font-semibold">{s.phone}</td>
                    <td className="p-3.5">
                      <Badge variant="info">
                        {s.category}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-slate-300 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{s.city}</span>
                      </div>
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
