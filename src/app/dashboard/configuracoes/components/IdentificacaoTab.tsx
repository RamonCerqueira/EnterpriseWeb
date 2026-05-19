"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface IdentificacaoTabProps {
  data: any;
  onChange: (field: string, val: any) => void;
}

export default function IdentificacaoTab({ data, onChange }: IdentificacaoTabProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h4 className="text-xs font-extrabold text-emerald-400 border-b border-border/40 pb-1.5 uppercase tracking-wider">Identificação Geral da Filial</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Código Filial</label>
          <Input
            type="text"
            value={data.CodEmp || ""}
            disabled
            className="h-8.5 bg-[#05080E]/60 font-mono text-[10px] font-bold text-cyan-400 border-border/40"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Código de Barras / Apelido</label>
          <Input
            type="text"
            value={data.CodigoBarras || ""}
            onChange={(e) => onChange("CodigoBarras", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Grupo Empresa</label>
          <Input
            type="text"
            value={data.Grupo || ""}
            onChange={(e) => onChange("Grupo", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Nome Fantasia (Cliente)</label>
          <Input
            type="text"
            value={data.Empresa || ""}
            onChange={(e) => onChange("Empresa", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Tipo Pessoa</label>
          <select
            value={data.Tipo || "J"}
            onChange={(e) => onChange("Tipo", e.target.value)}
            className="w-full h-8.5 rounded-lg border border-border/80 bg-[#05080E]/90 text-[10px] font-bold text-slate-200 px-2.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="J">Jurídica (CNPJ)</option>
            <option value="F">Física (CPF)</option>
          </select>
        </div>

        <div className="sm:col-span-3 space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Razão Social</label>
          <Input
            type="text"
            value={data.Razao || ""}
            onChange={(e) => onChange("Razao", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">CNPJ / CGC</label>
          <Input
            type="text"
            value={data.CGC || ""}
            onChange={(e) => onChange("CGC", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Inscrição Estadual</label>
          <Input
            type="text"
            value={data.IE || ""}
            onChange={(e) => onChange("IE", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Inscrição Municipal</label>
          <Input
            type="text"
            value={data.IM || ""}
            onChange={(e) => onChange("IM", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">CPF (Física)</label>
          <Input
            type="text"
            value={data.CPF || ""}
            onChange={(e) => onChange("CPF", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">R.G. (Física)</label>
          <Input
            type="text"
            value={data.RG || ""}
            onChange={(e) => onChange("RG", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
