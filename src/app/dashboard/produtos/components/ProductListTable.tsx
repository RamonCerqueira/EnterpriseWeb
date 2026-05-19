"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductListTableProps {
  products: any[];
  onEdit: (p: any) => void;
  onDelete: (id: number) => void;
}

export function ProductListTable({ products, onEdit, onDelete }: ProductListTableProps) {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="border-b border-border bg-[#0E131F]/50">
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Código SKU</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Produto / Fabricante</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Preço Comercial</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Custo</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Localização</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoria / Unidade</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Físico Atual</th>
          <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/20">
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-secondary/15 transition-colors text-xs">
            {/* SKU */}
            <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">
              {p.codigo}
              {p.inativo && (
                <span className="ml-1.5 text-[8px] bg-red-950/45 text-red-400 border border-red-500/20 px-1 py-0.5 rounded uppercase">
                  Inativo
                </span>
              )}
            </td>

            {/* Name & Manufacturer */}
            <td className="p-3.5">
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-200">{p.nome}</span>
                <span className="text-[10px] text-muted-foreground">
                  {p.fabricante || "Fabricante não informado"} {p.marca ? `(${p.marca})` : ""}
                </span>
              </div>
            </td>

            {/* Prices */}
            <td className="p-3.5 font-bold text-slate-100">
              <div className="flex flex-col">
                <span>{formatCurrency(p.preco)}</span>
                {p.preco2 > 0 && <span className="text-[9px] text-muted-foreground font-normal">Preço 2: {formatCurrency(p.preco2)}</span>}
              </div>
            </td>

            {/* Cost */}
            <td className="p-3.5 text-slate-300 font-semibold">{formatCurrency(p.custo)}</td>

            {/* Location */}
            <td className="p-3.5 font-semibold text-muted-foreground">{p.localizacao || "—"}</td>

            {/* Category & Unit */}
            <td className="p-3.5">
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[9px] font-bold uppercase">{p.categoria}</Badge>
                <Badge variant="outline" className="text-[9px] px-1 font-mono">{p.unidade}</Badge>
              </div>
            </td>

            {/* Stock status pill */}
            <td className="p-3.5 font-bold">
              <div className="flex flex-col gap-1">
                <span className="text-slate-100">{p.estoque} un</span>
                {p.estoque <= 0 ? (
                  <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">Sem Estoque</span>
                ) : p.estoque <= p.minimo ? (
                  <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">Estoque Crítico</span>
                ) : (
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Estoque Normal</span>
                )}
              </div>
            </td>

            {/* Action buttons */}
            <td className="p-3.5 pr-6 text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(p)}
                  className="h-7 w-7 p-0 hover:text-emerald-400 hover:bg-slate-800/40 rounded-lg cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(p.id)}
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
