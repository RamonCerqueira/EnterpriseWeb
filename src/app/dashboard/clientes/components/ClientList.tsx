"use client";

import React from "react";
import { Edit, Trash2, Phone, Mail, MapPin, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientListProps {
  clients: any[];
  onEdit: (client: any) => void;
  onDelete: (codCli: number) => void;
}

export default function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  // Format Document
  const formatDocumento = (cgc?: string, cpf?: string) => {
    if (cgc) return cgc;
    if (cpf) return cpf;
    return "-";
  };

  // Status mapping
  const getStatusDetails = (sit?: string) => {
    switch (sit) {
      case "A":
        return { label: "Excelente / Ativo", color: "text-emerald-400 bg-emerald-950/20 border-emerald-500/20" };
      case "B":
        return { label: "Regular", color: "text-blue-400 bg-blue-950/20 border-blue-500/20" };
      case "C":
        return { label: "Restrito", color: "text-amber-400 bg-amber-950/20 border-amber-500/20" };
      case "D":
        return { label: "Inativo", color: "text-rose-400 bg-rose-950/20 border-rose-500/20" };
      default:
        return { label: "Regular", color: "text-blue-400 bg-blue-950/20 border-blue-500/20" };
    }
  };

  return (
    <div className="overflow-x-auto select-none w-full scrollbar-thin">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-[#0E131F]/60">
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6 w-[120px]">Código</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome Fantasia</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Razão Social / Completo</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Documento</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefone</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cidade / UF</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Situação</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right w-[100px]">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {clients.map((c) => {
            const status = getStatusDetails(c.Situacao);
            return (
              <tr key={c.CodCli} className="hover:bg-secondary/10 transition-colors text-[11px] font-semibold text-slate-200">
                {/* ID */}
                <td className="p-3.5 pl-6 font-mono text-emerald-400">
                  #{c.CodCli}
                </td>
                {/* Nome Fantasia */}
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 flex items-center justify-center font-bold text-[9px] uppercase">
                      {(c.Cliente || "D").substring(0, 2)}
                    </div>
                    <span className="font-extrabold truncate max-w-[150px]">{c.Cliente || "DIVERSOS"}</span>
                  </div>
                </td>
                {/* Razão Social */}
                <td className="p-3.5 text-slate-300 font-medium truncate max-w-[180px]" title={c.Razao || ""}>
                  {c.Razao || "Diversos"}
                </td>
                {/* Document */}
                <td className="p-3.5 font-mono text-slate-400 text-[10px]">
                  {formatDocumento(c.CGC, c.CPF)}
                </td>
                {/* Telefone */}
                <td className="p-3.5 text-slate-300 font-medium">
                  {c.Tel || "-"}
                </td>
                {/* Cidade / UF */}
                <td className="p-3.5 text-slate-300 font-medium">
                  {c.Cidade || "ITAPETININGA"} - {c.Estado || "SP"}
                </td>
                {/* Situação */}
                <td className="p-3.5">
                  <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border ${status.color}`}>
                    {status.label}
                  </span>
                </td>
                {/* Actions */}
                <td className="p-3.5 pr-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(c)}
                      className="h-7 w-7 p-0 hover:text-emerald-400 hover:bg-slate-800 rounded-md cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(c.CodCli)}
                      className="h-7 w-7 p-0 hover:text-rose-400 hover:bg-slate-800 rounded-md cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
