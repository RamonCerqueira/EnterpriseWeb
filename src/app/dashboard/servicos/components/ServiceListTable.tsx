"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ServiceListTableProps {
  services: any[];
  onEdit: (s: any) => void;
  onDelete: (id: number) => void;
}

export function ServiceListTable({ services, onEdit, onDelete }: ServiceListTableProps) {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="border-b border-border bg-[#0E131F]/50">
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Código SKU</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descrição do Serviço</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor do Serviço</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Custo (Provisão)</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoria / Unidade</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Código de Serviço</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/20">
        {services.map((s) => (
          <tr key={s.id} className="hover:bg-secondary/15 transition-colors text-xs">
            {/* SKU */}
            <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">
              {s.codigo}
            </td>

            {/* Name / Description */}
            <td className="p-3.5 font-bold text-slate-200">
              <div className="flex flex-col text-left">
                <span>{s.nome}</span>
                {s.descricao && <span className="text-[10px] text-muted-foreground font-normal line-clamp-1">{s.descricao}</span>}
              </div>
            </td>

            {/* Price */}
            <td className="p-3.5 font-bold text-slate-100">
              {formatCurrency(s.preco)}
            </td>

            {/* Cost */}
            <td className="p-3.5 text-slate-300 font-semibold">
              {s.custo > 0 ? formatCurrency(s.custo) : "—"}
            </td>

            {/* Category / Unit */}
            <td className="p-3.5">
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[9px] font-bold uppercase">{s.categoria}</Badge>
                <Badge variant="outline" className="text-[9px] px-1 font-mono">{s.unidade}</Badge>
              </div>
            </td>

            {/* Fiscal / Tax Code */}
            <td className="p-3.5 font-mono text-muted-foreground font-semibold">
              {s.classificacaoFiscal || "—"}
            </td>

            {/* Inactive Badge */}
            <td className="p-3.5">
              {s.inativo ? (
                <span className="text-[8px] bg-red-950/45 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Inativo
                </span>
              ) : (
                <span className="text-[8px] bg-emerald-950/45 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Ativo
                </span>
              )}
            </td>

            {/* Action buttons */}
            <td className="p-3.5 pr-6 text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(s)}
                  className="h-7 w-7 p-0 hover:text-emerald-400 hover:bg-slate-800/40 rounded-lg cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(s.id)}
                  className="h-7 w-7 p-0 hover:text-rose-400 hover:bg-slate-800/40 rounded-lg cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
