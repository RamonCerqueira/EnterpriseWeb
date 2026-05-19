"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, Plus, Sparkles, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductSearchPanelProps {
  tipoPreco: string;
  onAddItem: (product: any, quantity: number) => void;
}

export default function ProductSearchPanel({
  tipoPreco,
  onAddItem
}: ProductSearchPanelProps) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.trim().length < 2) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/produtos?search=${encodeURIComponent(search)}&limit=15`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.items || []);
        }
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const handleQtyChange = (productId: number, val: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, val)
    }));
  };

  const getQty = (productId: number) => {
    return quantities[productId] || 1;
  };

  const handleAdd = (prod: any) => {
    const qty = getQty(prod.CodPro);
    onAddItem(prod, qty);
    
    // Clear quantities for this product and refocus input
    setQuantities(prev => ({
      ...prev,
      [prod.CodPro]: 1
    }));
    
    // Smooth visual feedback: keep search or clear it for next entry?
    // Let's clear search so they can immediately type the next item SKU/Name!
    setSearch("");
    setProducts([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <Card className="bg-[#121826]/75 border border-border/60 shadow-xl overflow-hidden relative">
      {/* Visual background gradient accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <CardHeader className="p-4 border-b border-border/30 bg-[#070A12]/20">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-emerald-950/45 text-emerald-400 border border-emerald-500/10 flex items-center justify-center">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-xs font-bold text-slate-200">Adicionar Produtos & Serviços (Sem Modal)</CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground">Pesquise por código SKU ou descrição e insira múltiplos itens consecutivamente.</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Search input bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Digite o código SKU, referência ou descrição de prateleira para filtrar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-9 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all font-semibold"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Results layout */}
        {search.trim().length >= 2 && (
          <div className="border border-border/40 rounded-xl overflow-hidden bg-[#0A0D18]/50 max-h-80 overflow-y-auto divide-y divide-border/20">
            {products.length === 0 && !loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground font-semibold">
                Nenhum produto cadastrado com esse nome.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-slate-950/60 font-bold text-muted-foreground uppercase text-[8px] tracking-wider">
                    <th className="p-2 pl-4 w-12">Foto</th>
                    <th className="p-2">Código</th>
                    <th className="p-2">Descrição / Referência</th>
                    <th className="p-2 text-right">Preço Tab.</th>
                    <th className="p-2 text-center">Estoque</th>
                    <th className="p-2 text-center w-20">Qtd</th>
                    <th className="p-2 pr-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {products.map((p) => {
                    const isServ = p.Servico === "S";
                    let priceSelected = p.Preco1 ? Number(p.Preco1) : 0;
                    if (tipoPreco === "2" && p.Preco2) priceSelected = Number(p.Preco2);
                    if (tipoPreco === "3" && p.Preco3) priceSelected = Number(p.Preco3);
                    if (tipoPreco === "4" && p.Preco4) priceSelected = Number(p.Preco4);

                    const stockQty = Number(p.Estoque || 0);
                    // Placeholder genérico (se p.Caminho for nulo ou vazio)
                    const imgUrl = p.Caminho ? p.Caminho : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.Produto || "P")}&background=0F1420&color=10B981&size=64&font-size=0.4&rounded=true`;

                    return (
                      <tr key={p.CodPro} className="hover:bg-emerald-500/5 transition-colors">
                        <td className="p-2 pl-4">
                          <div className="h-8 w-8 rounded-md overflow-hidden border border-border/40 bg-[#0F1420] flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imgUrl} alt={p.Produto} className="h-full w-full object-cover" />
                          </div>
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-400">{p.CodPro}</td>
                        <td className="p-2.5 font-bold text-slate-200">
                          <div className="flex flex-col gap-0.5">
                            <span>{p.Produto || "Sem nome"}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.Referencia && (
                                <span className="text-[8px] font-mono text-slate-500">Ref: {p.Referencia}</span>
                              )}
                              <Badge
                                className="text-[7px] py-0 px-1 font-bold"
                                variant={isServ ? "info" : "success"}
                              >
                                {isServ ? "Serviço" : "Produto"}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-extrabold text-emerald-400">
                          {formatCurrency(priceSelected)}
                        </td>
                        <td className="p-2.5 text-center font-bold">
                          {isServ ? (
                            <span className="text-slate-500 text-[10px]">—</span>
                          ) : (
                            <span
                              className={
                                stockQty <= 0
                                  ? "text-rose-400"
                                  : stockQty <= 5
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }
                            >
                              {stockQty}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min="1"
                            value={getQty(p.CodPro)}
                            onChange={(e) => handleQtyChange(p.CodPro, parseInt(e.target.value) || 1)}
                            className="w-12 h-7 rounded bg-[#121826] border border-border/60 text-center text-xs font-black text-slate-100 focus:outline-none"
                          />
                        </td>
                        <td className="p-2.5 pr-4 text-right">
                          <Button
                            type="button"
                            onClick={() => handleAdd(p)}
                            className="h-7 px-3 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase flex items-center gap-1 ml-auto cursor-pointer border-none"
                          >
                            <Plus className="h-3 w-3" /> Inserir
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {search.trim().length < 2 && (
          <div className="bg-[#05080E]/60 border border-border/40 p-4 rounded-xl text-center text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Digite código SKU ou nome acima para pesquisar e adicionar itens em tempo de execução rápida.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
