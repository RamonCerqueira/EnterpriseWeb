"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface SmtpTabProps {
  data: any;
  onChange: (field: string, val: any) => void;
}

export default function SmtpTab({ data, onChange }: SmtpTabProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h4 className="text-xs font-extrabold text-emerald-400 border-b border-border/40 pb-1.5 uppercase tracking-wider">Servidor de E-Mail (SMTP/POP) & WEB</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Servidor de Entrada POP</label>
          <Input
            type="text"
            value={data.ServidorPop || ""}
            onChange={(e) => onChange("ServidorPop", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">E-Mail POP Remetente</label>
          <Input
            type="email"
            value={data.EMailPop || ""}
            onChange={(e) => onChange("EMailPop", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Senha POP E-mail</label>
          <Input
            type="password"
            value={data.SenhaPop || ""}
            onChange={(e) => onChange("SenhaPop", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 text-amber-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Sincronizador Servidor WEB</label>
          <Input
            type="text"
            value={data.ServidorWeb || ""}
            onChange={(e) => onChange("ServidorWeb", e.target.value)}
            className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase block">Rodapé / Texto de E-mail (PopTexto)</label>
          <textarea
            value={data.TextoPop || ""}
            onChange={(e) => onChange("TextoPop", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border/80 bg-[#05080E]/90 text-[10px] font-semibold text-slate-200 p-2.5 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
