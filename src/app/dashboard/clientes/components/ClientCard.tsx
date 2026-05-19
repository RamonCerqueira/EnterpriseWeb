"use client";

import React from "react";
import { Edit2, Trash2, Phone, Mail, MapPin, Building, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientCardProps {
  client: any;
  onEdit: (client: any) => void;
  onDelete: (codCli: number) => void;
}

export default function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
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
        return { label: "Excelente / Ativo", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30" };
      case "B":
        return { label: "Regular", color: "text-blue-400 bg-blue-950/40 border-blue-500/30" };
      case "C":
        return { label: "Restrito", color: "text-amber-400 bg-amber-950/40 border-amber-500/30" };
      case "D":
        return { label: "Inativo", color: "text-rose-400 bg-rose-950/40 border-rose-500/30" };
      default:
        return { label: "Regular", color: "text-blue-400 bg-blue-950/40 border-blue-500/30" };
    }
  };

  const status = getStatusDetails(client.Situacao);

  return (
    <div className="bg-[#111625]/60 hover:bg-[#131a2d]/80 border border-border/50 hover:border-slate-600 p-4 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-lg group select-none min-h-[195px] relative overflow-hidden">
      
      {/* Small top decorative stripe based on status */}
      <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${
        client.Situacao === "A" ? "from-emerald-500 to-teal-400" :
        client.Situacao === "C" ? "from-amber-500 to-orange-400" :
        client.Situacao === "D" ? "from-rose-500 to-red-500" :
        "from-blue-500 to-indigo-400"
      }`} />

      {/* Header Info */}
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase tracking-wider block">
              CÓDIGO #{client.CodCli}
            </span>
            <h4 className="text-xs font-black text-slate-100 truncate group-hover:text-emerald-400 transition-colors" title={client.Cliente || "DIVERSOS"}>
              {client.Cliente || "DIVERSOS"}
            </h4>
            <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5" title={client.Razao || ""}>
              {client.Razao || "Diversos Ltda"}
            </p>
          </div>

          <div className="h-7 w-7 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
            {(client.Cliente || "D").substring(0, 2)}
          </div>
        </div>

        {/* Document & Address */}
        <div className="space-y-1.5 text-[10.5px] border-t border-border/10 pt-2 text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{formatDocumento(client.CGC, client.CPF)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              {client.Cidade || "ITAPETININGA"} - {client.Estado || "SP"}
            </span>
          </div>

          {client.EMail && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate font-mono text-[9.5px] text-slate-400">{client.EMail}</span>
            </div>
          )}

          {client.Tel && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate font-semibold">{client.Tel}</span>
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
            onClick={() => onEdit(client)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-md cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(client.CodCli)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-md cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

    </div>
  );
}
