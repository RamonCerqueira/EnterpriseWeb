"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, Plus, Search, Truck, Clock, 
  CheckCircle, ClipboardList, ArrowUpRight, DollarSign, 
  Package, RefreshCw, X, User, Trash2, ChevronLeft, 
  ChevronRight, Check, ShieldAlert
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PurchaseRecord {
  id: number;
  invoice: string;
  supplier: string;
  itemsCount: number;
  value: number;
  method: string;
  date: string;
  status: string;
}

interface PurchaseStats {
  totalInvestment: number;
  totalOrders: number;
  averagePurchase: number;
}

interface CartItem {
  codPro: number;
  nome: string;
  codigo: string;
  qty: number;
  cost: number;
}

export default function ComprasPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [stats, setStats] = useState<PurchaseStats>({ totalInvestment: 0, totalOrders: 0, averagePurchase: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [selectedSupplier, setSelectedSupplier] = useState<{ id: number; nome: string } | null>(null);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierList, setSupplierList] = useState<any[]>([]);
  const [isSuppliersLoading, setIsSuppliersLoading] = useState(false);

  // Cart and product search
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [productList, setProductList] = useState<any[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  // Purchase Details
  const [nfNumber, setNfNumber] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("Recebido");

  // Debounced trigger
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Purchases from backend
  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/compras?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.items || []);
        setTotalPages(data.pages || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [debouncedSearch, page]);

  // Load suppliers based on search text
  useEffect(() => {
    if (!isModalOpen) return;
    const fetchSuppliers = async () => {
      setIsSuppliersLoading(true);
      try {
        const res = await fetch(`/api/fornecedores?search=${encodeURIComponent(supplierSearch)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setSupplierList(data.items || []);
        }
      } catch (err) {
        console.error("Error loading suppliers list:", err);
      } finally {
        setIsSuppliersLoading(false);
      }
    };

    const handler = setTimeout(fetchSuppliers, 250);
    return () => clearTimeout(handler);
  }, [supplierSearch, isModalOpen]);

  // Load products based on search text
  useEffect(() => {
    if (!isModalOpen) return;
    const fetchProducts = async () => {
      if (!productSearch.trim()) {
        setProductList([]);
        return;
      }
      setIsProductsLoading(true);
      try {
        const res = await fetch(`/api/estoque?search=${encodeURIComponent(productSearch)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setProductList(data.items || []);
        }
      } catch (err) {
        console.error("Error loading products list:", err);
      } finally {
        setIsProductsLoading(false);
      }
    };

    const handler = setTimeout(fetchProducts, 250);
    return () => clearTimeout(handler);
  }, [productSearch, isModalOpen]);

  // Add product to purchase cart
  const addToCart = (prod: any) => {
    const existing = cart.find(c => c.codPro === prod.id);
    if (existing) {
      setCart(cart.map(c => c.codPro === prod.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([
        ...cart,
        {
          codPro: prod.id,
          nome: prod.nome,
          codigo: prod.codigo,
          qty: 1,
          cost: prod.custo
        }
      ]);
    }
    setProductSearch("");
    setProductList([]);
  };

  const removeFromCart = (codPro: number) => {
    setCart(cart.filter(item => item.codPro !== codPro));
  };

  const updateCartQty = (codPro: number, qty: number) => {
    if (qty <= 0) return;
    setCart(cart.map(item => item.codPro === codPro ? { ...item, qty } : item));
  };

  const updateCartCost = (codPro: number, cost: number) => {
    if (cost < 0) return;
    setCart(cart.map(item => item.codPro === codPro ? { ...item, cost } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.cost * item.qty), 0);

  // Form submit to register purchase
  const handleCreatePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) {
      setFormError("Por favor, selecione um Fornecedor.");
      return;
    }
    if (cart.length === 0) {
      setFormError("Por favor, adicione ao menos um produto para o reabastecimento.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codFor: selectedSupplier.id,
          nf: nfNumber || undefined,
          status: purchaseStatus,
          items: cart.map(item => ({
            codPro: item.codPro,
            qty: item.qty,
            cost: item.cost
          }))
        })
      });

      if (response.ok) {
        await fetchPurchases();
        setIsModalOpen(false);
        setCart([]);
        setSelectedSupplier(null);
        setNfNumber("");
        setPurchaseStatus("Recebido");
      } else {
        const errData = await response.json();
        setFormError(errData.error || "Falha ao gravar ordem de compra.");
      }
    } catch (err) {
      console.error("Error creating purchase:", err);
      setFormError("Erro de comunicação ao salvar compra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-slate-100 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-emerald-400" /> Suprimentos & Compras
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie cotações de preços de fornecedores, ordens de compra e lance reabastecimentos de estoque no sistema.
          </p>
        </div>

        <Button 
          onClick={() => {
            setFormError(null);
            setIsModalOpen(true);
          }}
          className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Solicitar Compra
        </Button>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Investimento Total</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {stats.totalInvestment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h3>
          <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Capital em compras faturado</span>
        </Card>

        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <ClipboardList className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Volume de Compras</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {stats.totalOrders} <span className="text-xs font-semibold text-muted-foreground">pedidos</span>
          </h3>
          <span className="text-[9px] text-blue-400 font-semibold mt-1 block">Ordens de suprimento processadas</span>
        </Card>

        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Custo Médio Compra</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {stats.averagePurchase.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h3>
          <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Tíquete de aquisição de insumos</span>
        </Card>
      </div>

      {/* Main card grid table */}
      <Card className="bg-[#0E1322]/80 border border-border/60 overflow-hidden shadow-xl backdrop-blur-md">
        {/* Table Header Filter */}
        <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0D18]/45">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Ordens de Compra e Abastecimento</CardTitle>
            <p className="text-[10px] text-muted-foreground">Monitore o fluxo de aquisição e recepção física de insumos no estoque.</p>
          </div>

          {/* Search bar filter */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filtrar por fornecedor ou NF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#05080E]/90 border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-2">
              <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin" />
              <span className="text-xs text-muted-foreground font-semibold">Consultando faturamentos no SQL Server...</span>
            </div>
          ) : purchases.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma ordem de compra encontrada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-[#0E1322]/55">
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider pl-6">Doc. Compra</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Fornecedor Razão</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Itens Totais</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Valor Faturado</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Status</th>
                  <th className="p-3.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider pr-6 text-right">Data Emissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors text-xs">
                    <td className="p-3.5 pl-6">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
                        {p.invoice}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-200 font-semibold">{p.supplier}</td>
                    <td className="p-3.5 text-slate-300 text-center font-bold">
                      <div className="inline-flex items-center gap-1">
                        <Package className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{p.itemsCount} un</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-black text-slate-100">
                      {p.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge className="bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 font-black uppercase text-[9px] tracking-wider px-2 py-0.5">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-muted-foreground pr-6 text-right font-medium">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Pagination Footer */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-border/40 flex items-center justify-between bg-[#0A0D18]/30">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Página <strong className="text-slate-300">{page}</strong> de <strong className="text-slate-300">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* MODAL: REGISTRAR COMPRA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-2xl border border-border/80 bg-[#0E1322] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-400" />
                  <CardTitle className="text-sm font-black text-slate-100">Registrar Ordem de Compra / Entrada</CardTitle>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground mt-1">
                Lançamento de suprimentos com acréscimo automático de estoque físico e valorização de custos ponderados.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleCreatePurchase}>
              <CardContent className="space-y-4 pt-5">
                {formError && (
                  <div className="bg-rose-950/35 border border-rose-500/30 text-rose-400 p-2.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Grid Inputs Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* NF Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                      Nota Fiscal (NF)
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 885942"
                      value={nfNumber}
                      onChange={(e) => setNfNumber(e.target.value)}
                      className="h-9 border-border bg-[#05080E]/90 text-xs font-semibold focus:border-cyan-500"
                    />
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                      Status da Ordem
                    </label>
                    <select
                      value={purchaseStatus}
                      onChange={(e) => setPurchaseStatus(e.target.value)}
                      className="w-full h-9 rounded-lg border border-border/80 bg-[#05080E]/90 text-xs font-semibold text-slate-200 px-3 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Recebido">Recebido (Abastece Físico)</option>
                      <option value="A caminho">A caminho (Sem Abastecimento)</option>
                    </select>
                  </div>
                </div>

                {/* Fornecedor Selection */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                    Selecionar Fornecedor
                  </label>
                  {selectedSupplier ? (
                    <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">{selectedSupplier.nome}</span>
                        <span className="text-[9px] text-muted-foreground">ID: #{selectedSupplier.id}</span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedSupplier(null);
                          setSupplierSearch("");
                        }}
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-emerald-900/35 text-emerald-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Input
                        type="text"
                        placeholder="Pesquisar fornecedor por nome..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="h-9 border-border bg-[#05080E]/90 text-xs font-semibold focus:border-cyan-500"
                      />
                      {isSuppliersLoading && (
                        <div className="absolute right-3 top-9 text-xs text-muted-foreground flex items-center gap-1">
                          <RefreshCw className="h-3 w-3 animate-spin text-emerald-400" />
                        </div>
                      )}
                      
                      {supplierSearch.trim().length > 0 && supplierList.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-[#121826] border border-border/80 rounded-lg shadow-xl divide-y divide-border/30">
                          {supplierList.map((sup) => (
                            <button
                              key={sup.id}
                              type="button"
                              onClick={() => {
                                setSelectedSupplier({ id: sup.id, nome: sup.nome });
                                setSupplierSearch("");
                                setSupplierList([]);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center justify-between"
                            >
                              <span>{sup.nome}</span>
                              <span className="text-[9px] text-muted-foreground">CNPJ: {sup.cnpj || "Sem doc"}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Search to Cart */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                    Adicionar Produto / Item de Estoque
                  </label>
                  <Input
                    type="text"
                    placeholder="Digite código SKU ou nome do item..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="h-9 border-border bg-[#05080E]/90 text-xs font-semibold focus:border-cyan-500"
                  />
                  {isProductsLoading && (
                    <div className="absolute right-3 top-9 text-xs text-muted-foreground flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin text-emerald-400" />
                    </div>
                  )}

                  {productSearch.trim().length > 0 && productList.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-[#121826] border border-border/80 rounded-lg shadow-xl divide-y divide-border/30">
                      {productList.map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => addToCart(prod)}
                          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span>{prod.nome}</span>
                            <span className="text-[8px] text-muted-foreground font-mono">Ref: {prod.codigo} -- Estoque Atual: {prod.estoqueFisico} un</span>
                          </div>
                          <span className="text-emerald-400 font-extrabold">Custo Ref: {prod.custo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Table for Purchase */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                    Lista de Insumos da Ordem
                  </label>
                  {cart.length === 0 ? (
                    <div className="bg-[#05080E]/60 border border-border/40 p-6 rounded-lg text-center text-xs text-muted-foreground font-semibold">
                      Nenhum produto adicionado. Pesquise e adicione itens acima.
                    </div>
                  ) : (
                    <div className="border border-border/40 rounded-lg overflow-hidden bg-[#05080E]/60">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border/40 bg-slate-950/40 font-bold text-muted-foreground uppercase text-[8px] tracking-wider">
                            <th className="p-2 pl-3">Ref</th>
                            <th className="p-2">Insumo / SKU</th>
                            <th className="p-2 text-center w-20">Qtd</th>
                            <th className="p-2 text-center w-28">Custo Unitário</th>
                            <th className="p-2 text-right">Subtotal</th>
                            <th className="p-2 pr-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                          {cart.map((item) => (
                            <tr key={item.codPro}>
                              <td className="p-2 pl-3 font-mono text-cyan-400 font-bold">{item.codigo}</td>
                              <td className="p-2 font-bold text-slate-200">{item.nome}</td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => updateCartQty(item.codPro, parseInt(e.target.value) || 1)}
                                  className="w-14 h-7 text-center rounded bg-[#121826] border border-border/60 text-xs font-black text-slate-100"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.cost}
                                  onChange={(e) => updateCartCost(item.codPro, parseFloat(e.target.value) || 0)}
                                  className="w-24 h-7 px-1.5 text-center rounded bg-[#121826] border border-border/60 text-xs font-bold text-slate-100"
                                />
                              </td>
                              <td className="p-2 text-right font-black text-slate-100">
                                {(item.cost * item.qty).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </td>
                              <td className="p-2 pr-3 text-right">
                                <Button
                                  type="button"
                                  onClick={() => removeFromCart(item.codPro)}
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-rose-400 hover:bg-rose-950/25"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {/* Totals row */}
                          <tr className="border-t-2 border-border bg-slate-950/30 font-black">
                            <td colSpan={4} className="p-3 text-right text-slate-300">Valor Total Geral:</td>
                            <td className="p-3 text-right text-emerald-400 text-sm">
                              {cartTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="bg-[#05080E]/40 border border-border/30 rounded-lg p-3 text-[9px] text-muted-foreground flex items-center gap-2.5 leading-relaxed">
                  <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Impacto no Estoque:</strong> Salvar esta ordem como **Recebida** injetará o saldo físico de prateleira na base do SQL Server e revalorará o custo contábil base dos produtos no banco.
                  </span>
                </div>
              </CardContent>

              {/* Modal Footer Controls */}
              <div className="p-4 border-t border-border/40 flex justify-end gap-2 bg-[#0A0D18]/45">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 text-xs font-semibold cursor-pointer border border-border/60"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 text-xs font-extrabold gap-1.5 transition-all cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-black shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                      Gravando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4.5 w-4.5" />
                      Lançar Compra
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
