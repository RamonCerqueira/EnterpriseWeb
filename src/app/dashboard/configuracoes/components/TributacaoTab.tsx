"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Percent, Building2, Sliders } from "lucide-react";

interface TributacaoTabProps {
  data: any;
  onChange: (field: string, val: any) => void;
}

export default function TributacaoTab({ data, onChange }: TributacaoTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Sub-grid 1: Mercado Interno */}
      <div className="space-y-3">
        <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-wider bg-slate-950/45 px-3 py-1.5 rounded flex items-center gap-1.5 border border-border/30">
          <Percent className="h-3.5 w-3.5 text-cyan-400" /> Mercado Interno
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">ISS %</label>
            <Input
              type="number"
              step="0.01"
              value={data.IssDestacavel || 0}
              onChange={(e) => onChange("IssDestacavel", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 text-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">ICMS %</label>
            <Input
              type="number"
              step="0.01"
              value={data.ICMSAutomatico || 0}
              onChange={(e) => onChange("ICMSAutomatico", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 text-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">Alíquota PIS %</label>
            <Input
              type="number"
              step="0.01"
              value={data.Pis || 0}
              onChange={(e) => onChange("Pis", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 text-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">Alíquota COFINS %</label>
            <Input
              type="number"
              step="0.01"
              value={data.Cofins || 0}
              onChange={(e) => onChange("Cofins", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 text-cyan-400"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 col-span-2 sm:col-span-4 flex flex-wrap gap-4 pt-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={data.Atacadista === "S"}
                onChange={(e) => onChange("Atacadista", e.target.checked ? "S" : "N")}
                className="h-4.5 w-4.5 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              Atacadista
            </label>

            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={data.Industria === "S"}
                onChange={(e) => onChange("Industria", e.target.checked ? "S" : "N")}
                className="h-4.5 w-4.5 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              Industrial
            </label>

            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                className="h-4.5 w-4.5 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              BC PIS/COFINS Diferenciado
            </label>
          </div>
        </div>
      </div>

      {/* Sub-grid 2: Mercado Externo */}
      <div className="space-y-3">
        <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-wider bg-slate-950/45 px-3 py-1.5 rounded flex items-center gap-1.5 border border-border/30">
          <Building2 className="h-3.5 w-3.5 text-cyan-400" /> Mercado Externo
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">PIS Importação %</label>
            <Input
              type="number"
              step="0.01"
              value={data.PisI || 0}
              onChange={(e) => onChange("PisI", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">COFINS Importação %</label>
            <Input
              type="number"
              step="0.01"
              value={data.CofinsI || 0}
              onChange={(e) => onChange("CofinsI", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80"
            />
          </div>

          <div className="col-span-2 pt-5">
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={data.Importador === "S"}
                onChange={(e) => onChange("Importador", e.target.checked ? "S" : "N")}
                className="h-4.5 w-4.5 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              Importador
            </label>
          </div>
        </div>
      </div>

      {/* Sub-grid 3: Simples Nacional */}
      <div className="space-y-3">
        <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-wider bg-slate-950/45 px-3 py-1.5 rounded flex items-center gap-1.5 border border-border/30">
          <Sliders className="h-3.5 w-3.5 text-cyan-400" /> Simples Nacional & Faturamento
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">Faixa SN % (Geral)</label>
            <Input
              type="number"
              step="0.01"
              value={data.FaixaSN || 0}
              onChange={(e) => onChange("FaixaSN", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 text-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">Faixa SN % (Serviço)</label>
            <Input
              type="number"
              step="0.01"
              value={data.FaixaSNServico || 0}
              onChange={(e) => onChange("FaixaSNServico", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 text-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">CRT (Regime Tributário)</label>
            <Input
              type="text"
              value={data.CRT || ""}
              onChange={(e) => onChange("CRT", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">CNAE Principal</label>
            <Input
              type="text"
              value={data.CNAE || ""}
              onChange={(e) => onChange("CNAE", e.target.value)}
              className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
