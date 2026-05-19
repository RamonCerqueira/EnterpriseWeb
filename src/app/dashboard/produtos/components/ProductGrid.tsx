"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductGridProps {
  products: any[];
  onEdit: (p: any) => void;
  onDelete: (id: number) => void;
}

export function ProductGrid({ products, onEdit, onDelete }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-[#0F1420]/75 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all group relative min-h-[190px]"
        >
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider line-clamp-1">
                {p.codigo}
              </span>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-[8px] px-1 font-mono">{p.unidade}</Badge>
                {p.inativo && (
                  <span className="text-[8px] bg-red-950/45 text-red-400 px-1 py-0.5 rounded font-bold uppercase">
                    Inativo
                  </span>
                )}
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-relaxed mb-1">{p.nome}</h4>
            <p className="text-[10px] text-muted-foreground line-clamp-1 mb-3">
              {p.fabricante || "Sem Fabricante"} {p.marca ? `(${p.marca})` : ""}
            </p>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-muted-foreground block">Venda</span>
              <span className="text-xs font-extrabold text-slate-100">{formatCurrency(p.preco)}</span>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-muted-foreground block">Estoque</span>
              <span className={`text-xs font-extrabold ${p.estoque <= 5 ? "text-amber-400" : "text-slate-100"}`}>
                {p.estoque} un
              </span>
            </div>
          </div>

          {/* Quick Actions overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#131926]/90 p-1 rounded-lg border border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(p)}
              className="h-6.5 w-6.5 p-0 hover:text-emerald-400 cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(p.id)}
              className="h-6.5 w-6.5 p-0 hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
