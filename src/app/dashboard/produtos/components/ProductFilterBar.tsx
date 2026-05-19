"use client";

import React from "react";
import { Search, List, Grid } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (s: string) => void;
  stockFilter: string;
  setStockFilter: (s: string) => void;
  viewMode: "list" | "grid";
  setViewMode: (v: "list" | "grid") => void;
  categoriesList: string[];
}

export function ProductFilterBar({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  viewMode,
  setViewMode,
  categoriesList,
}: ProductFilterBarProps) {
  return (
    <div className="p-5 border-b border-border/40 flex flex-col xl:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
      <div>
        <CardTitle className="text-sm font-bold text-slate-200">Inventário Geral</CardTitle>
        <p className="text-[10px] text-muted-foreground">Listagem e filtros do acervo de produtos comerciais.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto font-semibold">
        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            type="text"
            placeholder="Nome, código, fabricante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
          />
        </div>

        {/* Category Selector */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8.5 px-3 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer w-full sm:w-auto"
        >
          <option value="TODAS">Categorias: Todas</option>
          {categoriesList.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Stock Status Selector */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="h-8.5 px-3 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer w-full sm:w-auto"
        >
          <option value="TODOS">Estoque: Todos</option>
          <option value="SEM">Sem Estoque (0)</option>
          <option value="BAIXO">Estoque Baixo (1 a 5)</option>
          <option value="OK">Estoque Normal (&gt; 5)</option>
        </select>

        {/* View togglers */}
        <div className="flex items-center gap-1.5 bg-[#0F1420] p-1 rounded-lg border border-border/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-6.5 w-7.5 p-0 hover:bg-[#1C2436] ${viewMode === "list" ? "bg-[#1F293D] text-emerald-400" : "text-muted-foreground"}`}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-6.5 w-7.5 p-0 hover:bg-[#1C2436] ${viewMode === "grid" ? "bg-[#1F293D] text-emerald-400" : "text-muted-foreground"}`}
          >
            <Grid className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
