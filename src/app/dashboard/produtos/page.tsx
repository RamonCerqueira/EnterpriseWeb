"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Search, Tag, DollarSign, Layers, AlertTriangle, CheckCircle, Loader2, AlertCircle, Trash2, Edit, TextQuote } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form Fields
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoria, setCategoria] = useState("Acessórios");
  const [descricao, setDescricao] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/produtos");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form validations
    if (!nome.trim() || !codigo.trim() || !preco || !estoque) {
      setFormError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const priceNum = parseFloat(preco);
    const stockNum = parseInt(estoque);

    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("O preço do produto deve ser maior que R$ 0,00.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setFormError("O estoque do produto não pode ser um número negativo.");
      return;
    }

    setIsSubmitLoading(true);

    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          codigo: codigo.toUpperCase(),
          preco: priceNum,
          estoque: stockNum,
          categoria,
          descricao,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Reset form
        setCodigo("");
        setNome("");
        setPreco("");
        setEstoque("");
        setCategoria("Acessórios");
        setDescricao("");
        setIsDialogOpen(false);
        fetchProducts();
      } else {
        setFormError(data.error || "Ocorreu um erro ao cadastrar o produto.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Erro de conexão ao tentar registrar produto.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Filter products by search input
  const filteredProducts = products.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-400" /> Cadastro de Produtos
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie o catálogo de produtos e controle o estoque físico integrado à tabela `produto`.
          </p>
        </div>

        {/* Dialog Add Product Trigger */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
              <Plus className="h-4 w-4" /> Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader className="border-b border-border/40 pb-4 text-left">
              <DialogTitle className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-400" /> Registrar Novo Produto
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Insira as especificações físicas e comerciais na tabela `produto`.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 py-4">
              {formError && (
                <div className="bg-rose-950/45 border border-rose-500/35 text-rose-400 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Código Único (SKU)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/75">
                      <Tag className="h-4 w-4" />
                    </span>
                    <Input
                      placeholder="Ex: CAB-HDMI-3M"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Nome do Produto</label>
                  <Input
                    placeholder="Nome comercial do item"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="h-9.5 bg-[#0F1420] text-xs font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Preço de Venda</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/75 text-xs font-bold font-mono">
                      R$
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Estoque Inicial</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Categoria</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/75">
                      <Layers className="h-4 w-4" />
                    </span>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="pl-9 w-full h-9.5 rounded-md border border-input bg-[#0F1420] text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer font-semibold"
                    >
                      <option value="Acessórios">Acessórios</option>
                      <option value="Equipamentos">Equipamentos</option>
                      <option value="Conectores">Conectores</option>
                      <option value="Sobressalentes">Sobressalentes</option>
                      <option value="Serviços">Serviços</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Descrição Detalhada</label>
                  <textarea
                    placeholder="Escreva detalhes técnicos do produto..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input px-3 py-2 text-xs shadow-sm bg-[#0F1420] focus:outline-none focus:ring-1 focus:ring-ring text-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <DialogFooter className="border-t border-border/40 pt-4 gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" size="sm" className="text-xs">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="text-xs font-semibold gap-1.5"
                >
                  {isSubmitLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" /> Registrar Produto
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Table Grid Container */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Inventário de Produtos</CardTitle>
            <p className="text-[10px] text-muted-foreground">Listagem de produtos, saldos de estoque e precificação comercial.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por nome ou código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 text-emerald-400 animate-spin" />
              <span className="text-xs text-muted-foreground font-semibold">Consultando estoque no banco...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhum produto correspondente cadastrado.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0E131F]/50">
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Código (SKU)</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Produto / Descrição</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Preço de Venda</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estoque Atual</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoria</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status Estoque</th>
                  <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    {/* Code SKU */}
                    <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">{p.codigo}</td>
                    {/* Name */}
                    <td className="p-3.5 text-slate-200">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-200">{p.nome}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{p.descricao || "Sem descrição"}</span>
                      </div>
                    </td>
                    {/* Price */}
                    <td className="p-3.5 font-bold text-slate-100">{formatCurrency(p.preco)}</td>
                    {/* Stock Balance */}
                    <td className="p-3.5 font-bold text-slate-100">{p.estoque} un</td>
                    {/* Category */}
                    <td className="p-3.5">
                      <Badge variant="info">
                        {p.categoria}
                      </Badge>
                    </td>
                    {/* Stock Alert Pill */}
                    <td className="p-3.5">
                      {p.estoque <= 0 ? (
                        <Badge variant="destructive">Sem Estoque</Badge>
                      ) : p.estoque <= 5 ? (
                        <Badge variant="warning">Estoque Baixo</Badge>
                      ) : (
                        <Badge variant="success">Estoque Normal</Badge>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="p-3.5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:text-emerald-400">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:text-rose-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
