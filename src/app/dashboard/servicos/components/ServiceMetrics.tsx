"use client";

import React from "react";
import { ClipboardList, ShieldCheck, DollarSign, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ServiceMetricsProps {
  services: any[];
}

export function ServiceMetrics({ services }: ServiceMetricsProps) {
  const activeCount = services.filter((s) => !s.inativo).length;
  
  const avgPrice = services.length > 0 
    ? services.reduce((acc, s) => acc + s.preco, 0) / services.length 
    : 0;

  const avgCommission = services.length > 0
    ? services.reduce((acc, s) => acc + s.comissao, 0) / services.length
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
            <ClipboardList className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Catálogo Geral</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{services.length} Serviços</h3>
        <span className="text-[9px] text-muted-foreground">Cadastrados no ERP</span>
      </Card>

      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Serviços Ativos</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{activeCount} ativos</h3>
        <span className="text-[9px] text-muted-foreground">Disponíveis para venda e OS</span>
      </Card>

      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
            <DollarSign className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Ticket Médio</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{formatCurrency(avgPrice)}</h3>
        <span className="text-[9px] text-muted-foreground">Valor médio por hora/diária</span>
      </Card>

      <Card className="p-4 bg-[#121826]/75 border border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-950/45 text-indigo-400 flex items-center justify-center border border-indigo-500/10">
            <Percent className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Comissão Média</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">{avgCommission.toFixed(2)}%</h3>
        <span className="text-[9px] text-muted-foreground">Comissão paga a vendedores</span>
      </Card>
    </div>
  );
}
