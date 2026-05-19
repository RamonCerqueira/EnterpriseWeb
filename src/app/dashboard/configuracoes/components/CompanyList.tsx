"use client";

import React from "react";
import { Search, RefreshCw, Building2 } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompanyListItem {
  id: number;
  nome: string;
  razao: string;
  cnpj: string;
}

interface CompanyListProps {
  companies: CompanyListItem[];
  selectedCompanyId: number | null;
  onSelectCompany: (id: number) => void;
  search: string;
  onSearchChange: (val: string) => void;
  isLoading: boolean;
}

export default function CompanyList({
  companies,
  selectedCompanyId,
  onSelectCompany,
  search,
  onSearchChange,
  isLoading,
}: CompanyListProps) {
  const filtered = companies.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cnpj.includes(search) ||
      c.razao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <CardTitle className="text-xs font-extrabold text-slate-200 uppercase tracking-wider block">Lista de Filiais</CardTitle>
        <CardDescription className="text-[10px] text-muted-foreground mt-0.5">
          Escolha a filial para gerenciar dados.
        </CardDescription>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground">
          <Search className="h-3 w-3" />
        </span>
        <input
          type="text"
          placeholder="Filtrar filiais..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-8 pl-8 pr-3 rounded bg-[#05080E]/90 border border-border/75 text-[10px] text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
        />
      </div>

      {/* List items */}
      {isLoading ? (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-1">
          <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
          <span className="text-[9px] text-muted-foreground font-semibold">Carregando lista...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-4 text-[10px] text-muted-foreground">Nenhuma filial encontrada.</div>
      ) : (
        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCompany(c.id)}
              className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1 cursor-pointer ${
                selectedCompanyId === c.id
                  ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-400"
                  : "bg-[#05080E]/40 border-border/40 hover:bg-slate-900/40 text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[9px] bg-slate-950/65 px-1.5 py-0.5 rounded font-black text-cyan-400">
                  COD {c.id}
                </span>
                {selectedCompanyId === c.id && (
                  <Badge className="bg-emerald-500 text-black text-[8px] font-black h-3.5 px-1 uppercase tracking-wider">Ativa</Badge>
                )}
              </div>
              <span className="text-xs font-bold leading-tight truncate">{c.nome}</span>
              <span className="text-[9px] text-muted-foreground font-mono truncate">{c.cnpj || "Sem CNPJ"}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
