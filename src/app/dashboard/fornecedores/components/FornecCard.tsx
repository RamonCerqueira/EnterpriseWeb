"use client";

import React from "react";
import { Edit2, Trash2, Phone, Mail, MapPin, Building, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FornecCardProps {
  fornec: any;
  onEdit: (fornec: any) => void;
  onDelete: (codFor: number) => void;
}

export default function FornecCard({ fornec, onEdit, onDelete }: FornecCardProps) {
  // Format CPF/CNPJ
  const formatDocumento = (cgc?: string, cpf?: string) => {
    if (cgc) return `CNPJ: ${cgc}`;
    if (cpf) return `CPF: ${cpf}`;
    return "Documento: Não informado";
  };

  // Status mapping
  const getStatusDetails = (sit?: string) => {
    switch (sit) {
      case "A":
        return { label: "Ativo / Liberado", color: "text-sky-400 bg-sky-950/40 border-sky-500/30" };
      case "I":
      case "D":
        return { label: "Inativo / Bloqueado", color: "text-rose-400 bg-rose-950/40 border-rose-500/30" };
      default:
        return { label: "Ativo / Liberado", color: "text-sky-400 bg-sky-950/40 border-sky-500/30" };
    }
  };

  const status = getStatusDetails(fornec.Situacao);

  return (
    <div className="bg-[#111625]/60 hover:bg-[#131a2d]/80 border border-border/50 hover:border-slate-600 p-4 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-lg group select-none min-h-[195px] relative overflow-hidden">
      
      {/* Decorative top stripe */}
      <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${
        fornec.Situacao === "I" || fornec.Situacao === "D" 
          ? "from-rose-500 to-red-500" 
          : "from-sky-500 to-indigo-400"
      }`} />

      {/* Header Info */}
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-sky-400 font-extrabold uppercase tracking-wider block">
              CÓDIGO #{fornec.CodFor}
            </span>
            <h4 className="text-xs font-black text-slate-100 truncate group-hover:text-sky-400 transition-colors" title={fornec.Fornec || "DIVERSOS"}>
              {fornec.Fornec || "DIVERSOS"}
            </h4>
            <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5" title={fornec.Razao || ""}>
              {fornec.Razao || "Diversos Fornec Ltda"}
            </p>
          </div>

          <div className="h-7 w-7 rounded-lg bg-sky-950/40 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
            {(fornec.Fornec || "F").substring(0, 2)}
          </div>
        </div>

        {/* Document & Address */}
        <div className="space-y-1.5 text-[10.5px] border-t border-border/10 pt-2 text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{formatDocumento(fornec.CGC, fornec.CPF)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              {fornec.Cidade || "Não informada"} - {fornec.Estado || "SP"}
            </span>
          </div>

          {fornec.EMail && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate font-mono text-[9.5px] text-slate-400">{fornec.EMail}</span>
            </div>
          )}

          {fornec.Tel && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-sky-500 shrink-0" />
              <span className="truncate font-semibold">{fornec.Tel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls & status */}
      <div className="flex items-center justify-between border-t border-border/10 pt-3 mt-3">
        <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border ${status.color}`}>
          {status.label}
        </span>

        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(fornec)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-md cursor-md"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(fornec.CodFor)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-md cursor-md"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

    </div>
  );
}
