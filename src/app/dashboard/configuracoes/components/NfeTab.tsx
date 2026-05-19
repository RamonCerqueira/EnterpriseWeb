"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface NfeTabProps {
  data: any;
  onChange: (field: string, val: any) => void;
}

export default function NfeTab({ data, onChange }: NfeTabProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h4 className="text-xs font-extrabold text-emerald-400 border-b border-border/40 pb-1.5 uppercase tracking-wider">Números de Sequências Fiscais (NF-e, NFS-e e ECF)</h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">NF-e (Próximo Nº)</label>
          <Input
            type="number"
            value={data.NF || 0}
            onChange={(e) => onChange("NF", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-black border-border/80 text-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">NF Serv. (NFS-e Nº)</label>
          <Input
            type="number"
            value={data.NF2 || 0}
            onChange={(e) => onChange("NF2", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-black border-border/80 text-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Contigência CCe Nº</label>
          <Input
            type="number"
            value={data.CCe || 0}
            onChange={(e) => onChange("CCe", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-black border-border/80"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Série ECF (Atual)</label>
          <Input
            type="text"
            value={data.Serie_ECF || ""}
            onChange={(e) => onChange("Serie_ECF", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Programa Emissor NF</label>
          <Input
            type="text"
            value={data.ProgramaNF || ""}
            onChange={(e) => onChange("ProgramaNF", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Programa Emissor NFS-e</label>
          <Input
            type="text"
            value={data.ProgramaNF2 || ""}
            onChange={(e) => onChange("ProgramaNF2", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Lote NFS-e Serv.</label>
          <Input
            type="number"
            value={data.LoteServico || 0}
            onChange={(e) => onChange("LoteServico", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">RPS Atual</label>
          <Input
            type="number"
            value={data.Rps || 0}
            onChange={(e) => onChange("Rps", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80"
          />
        </div>
      </div>
    </div>
  );
}
