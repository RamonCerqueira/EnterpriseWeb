"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FornecListProps {
  fornecedores: any[];
  onEdit: (fornec: any) => void;
  onDelete: (codFor: number) => void;
}

export default function FornecList({ fornecedores, onEdit, onDelete }: FornecListProps) {
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
        return { label: "Ativo / Liberado", color: "text-sky-400 bg-sky-950/20 border-sky-500/20" };
      case "I":
      case "D":
        return { label: "Inativo / Bloqueado", color: "text-rose-400 bg-rose-950/20 border-rose-500/20" };
      default:
        return { label: "Ativo / Liberado", color: "text-sky-400 bg-sky-950/20 border-sky-500/20" };
    }
  };

  return (
    <div className="overflow-x-auto select-none w-full scrollbar-thin">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-[#0E131F]/60">
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6 w-[120px]">Código</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nome Fantasia</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Razão Social</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Documento</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefone</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cidade / UF</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Situação</th>
            <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right w-[100px]">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {fornecedores.map((f) => {
            const status = getStatusDetails(f.Situacao);
            return (
              <tr key={f.CodFor} className="hover:bg-secondary/10 transition-colors text-[11px] font-semibold text-slate-200">
                {/* ID */}
                <td className="p-3.5 pl-6 font-mono text-sky-400">
                  #{f.CodFor}
                </td>
                {/* Nome Fantasia */}
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-sky-950/40 text-sky-400 border border-sky-500/10 flex items-center justify-center font-bold text-[9px] uppercase">
                      {(f.Fornec || "F").substring(0, 2)}
                    </div>
                    <span className="font-extrabold truncate max-w-[150px]">{f.Fornec || "DIVERSOS"}</span>
                  </div>
                </td>
                {/* Razão Social */}
                <td className="p-3.5 text-slate-300 font-medium truncate max-w-[180px]" title={f.Razao || ""}>
                  {f.Razao || "Diversos Ltda"}
                </td>
                {/* Document */}
                <td className="p-3.5 font-mono text-slate-400 text-[10px]">
                  {formatDocumento(f.CGC, f.CPF)}
                </td>
                {/* Telefone */}
                <td className="p-3.5 text-slate-300 font-medium">
                  {f.Tel || "-"}
                </td>
                {/* Cidade / UF */}
                <td className="p-3.5 text-slate-300 font-medium">
                  {f.Cidade || "Não informada"} - {f.Estado || "SP"}
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
                      onClick={() => onEdit(f)}
                      className="h-7 w-7 p-0 hover:text-sky-400 hover:bg-slate-800 rounded-md cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(f.CodFor)}
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
