"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface EnderecoTabProps {
  data: any;
  onChange: (field: string, val: any) => void;
}

export default function EnderecoTab({ data, onChange }: EnderecoTabProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h4 className="text-xs font-extrabold text-emerald-400 border-b border-border/40 pb-1.5 uppercase tracking-wider">Endereço & Canais de Comunicação</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">C.E.P.</label>
          <Input
            type="text"
            value={data.CEP || ""}
            onChange={(e) => onChange("CEP", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Endereço (Logradouro)</label>
          <Input
            type="text"
            value={data.Endereco || ""}
            onChange={(e) => onChange("Endereco", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Nº</label>
          <Input
            type="text"
            value={data.Numero || ""}
            onChange={(e) => onChange("Numero", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Complemento</label>
          <Input
            type="text"
            value={data.Complemento || ""}
            onChange={(e) => onChange("Complemento", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Bairro</label>
          <Input
            type="text"
            value={data.Bairro || ""}
            onChange={(e) => onChange("Bairro", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Cidade</label>
          <Input
            type="text"
            value={data.Cidade || ""}
            onChange={(e) => onChange("Cidade", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">UF (Estado)</label>
          <Input
            type="text"
            value={data.Estado || ""}
            onChange={(e) => onChange("Estado", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Telefone 1 (Tel1)</label>
          <Input
            type="text"
            value={data.Tel || ""}
            onChange={(e) => onChange("Tel", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Telefone 2 (Tel2)</label>
          <Input
            type="text"
            value={data.Tel2 || ""}
            onChange={(e) => onChange("Tel2", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        {/* WhatsApp animation */}
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 block">
            WhatsApp <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </label>
          <Input
            type="text"
            placeholder="Mesmo número de contato..."
            defaultValue={data.Tel || ""}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500 text-emerald-400"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">E-Mail Oficial</label>
          <Input
            type="email"
            value={data.EMail || ""}
            onChange={(e) => onChange("EMail", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Site / Portal</label>
          <Input
            type="text"
            value={data.Site || ""}
            onChange={(e) => onChange("Site", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
