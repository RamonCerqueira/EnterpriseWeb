"use client";

import React from "react";
import { Boxes, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ProductMetricsProps {
  products: any[];
}

export function ProductMetrics({ products }: ProductMetricsProps) {
  const totalStockItems = products.reduce((acc, p) => acc + p.estoque, 0);
  const lowStockCount = products.filter((p) => p.estoque <= 5).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.preco * p.estoque, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total de Itens</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{products.length} produtos</h3>
        <span className="text-[9px] text-muted-foreground">Cadastrados no ERP</span>
      </Card>

      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Saldo Total Físico</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{totalStockItems} unidades</h3>
        <span className="text-[9px] text-muted-foreground">Estocadas fisicamente</span>
      </Card>

      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-rose-950/45 text-rose-400 flex items-center justify-center border border-rose-500/10">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Alerta Estoque Crítico</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{lowStockCount} itens</h3>
        <span className="text-[9px] text-rose-400 font-semibold">Abaixo ou com saldo 0</span>
      </Card>

      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
            <DollarSign className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Valor total em Venda</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{formatCurrency(totalInventoryValue)}</h3>
        <span className="text-[9px] text-muted-foreground">Preço de venda * estoque</span>
      </Card>
    </div>
  );
}
