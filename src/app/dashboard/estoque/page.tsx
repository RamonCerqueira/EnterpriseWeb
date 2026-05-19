"use client";

import React, { useState, useEffect } from "react";
import { 
  Boxes, Plus, Search, Tag, DollarSign, Layers, 
  AlertTriangle, CheckCircle, Package, ArrowUpRight, 
  ArrowDownRight, RefreshCw, ChevronLeft, ChevronRight,
  TrendingUp, FileText, Check, X, ShieldAlert
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ProductStock {
  id: number;
  nome: string;
  codigo: string;
  unidade: string;
  custo: number;
  preco: number;
  estoqueFisico: number;
  resVendas: number;
  resRequisicoes: number;
  totalReservado: number;
  disponivel: number;
  minimo: number;
  maximo: number;
  isCritico: boolean;
}

interface StockStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  totalSKUs: number;
}

interface StockMovement {
  id: string;
  type: "Entrada" | "Saída";
  item: string;
  qty: number;
  ref: string;
  user: string;
  date: string;
}

export default function EstoquePage() {
  // Navigation tabs: "inventario" | "movimentacoes"
  const [activeTab, setActiveTab] = useState<"inventario" | "movimentacoes">("inventario");

  // State for inventory list
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [stats, setStats] = useState<StockStats>({ totalItems: 0, totalValue: 0, lowStockCount: 0, totalSKUs: 0 });
  const [search, setSearch] = useState("");
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // State for movements list
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isMovementsLoading, setIsMovementsLoading] = useState(false);

  // State for manual adjustments modal
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);

  // Debounced search trigger
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Inventory Products List
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/estoque?search=${encodeURIComponent(debouncedSearch)}&onlyCritical=${onlyCritical}&page=${page}&limit=12`
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items || []);
        setTotalPages(data.pages || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Stock Movements Timeline
  const fetchMovements = async () => {
    setIsMovementsLoading(true);
    try {
      const res = await fetch("/api/estoque/movimentacoes?limit=25");
      if (res.ok) {
        const data = await res.json();
        setMovements(data || []);
      }
    } catch (error) {
      console.error("Error fetching movements data:", error);
    } finally {
      setIsMovementsLoading(false);
    }
  };

  // Refresh lists based on active tab
  useEffect(() => {
    if (activeTab === "inventario") {
      fetchInventory();
    } else {
      fetchMovements();
    }
  }, [debouncedSearch, onlyCritical, page, activeTab]);

  // Handle manual adjustment submission
  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const parsedStock = parseFloat(newStockValue);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setAdjustmentError("Por favor, informe uma quantidade válida de estoque (igual ou superior a zero).");
      return;
    }

    setIsSubmittingAdjustment(true);
    setAdjustmentError(null);

    try {
      const response = await fetch("/api/estoque/ajuste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codPro: selectedProduct.id,
          novoEstoque: parsedStock,
        }),
      });

      if (response.ok) {
        // Success: reload inventory data and close modal
        await fetchInventory();
        setIsAdjustmentModalOpen(false);
        setSelectedProduct(null);
        setNewStockValue("");
      } else {
        const errData = await response.json();
        setAdjustmentError(errData.error || "Falha ao gravar correção de estoque.");
      }
    } catch (error) {
      console.error("Error adjusting stock:", error);
      setAdjustmentError("Erro ao enviar comando de ajuste físico.");
    } finally {
      setIsSubmittingAdjustment(false);
    }
  };

  const openAdjustmentModal = (prod: ProductStock) => {
    setSelectedProduct(prod);
    setNewStockValue(prod.estoqueFisico.toString());
    setAdjustmentError(null);
    setIsAdjustmentModalOpen(true);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-slate-100 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Boxes className="h-6 w-6 text-emerald-400" /> Controle de Estoque
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acompanhe saldos físicos, controle reservas dinâmicas de vendas e requisições, e analise movimentações históricas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              setActiveTab("inventario");
              fetchInventory();
            }} 
            variant="secondary" 
            size="sm" 
            className="text-xs font-semibold h-9 border border-border/60 bg-[#0E1322]/80 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-1 text-cyan-400" /> Atualizar Saldos
          </Button>
        </div>
      </div>

      {/* Row 1: Real-time Metric Cards from database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-cyan-950/45 text-cyan-400 flex items-center justify-center border border-cyan-500/10">
              <Package className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Total de Peças</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {stats.totalItems.toLocaleString("pt-BR")} <span className="text-xs font-medium text-muted-foreground">unidades</span>
          </h3>
          <span className="text-[9px] text-cyan-400 font-semibold mt-1 block">Estoque físico consolidado</span>
        </Card>

        {/* Metric 2 */}
        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Valor do Inventário</span>
          </div>
          <h3 className="text-xl font-black text-emerald-400">
            {stats.totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h3>
          <span className="text-[9px] text-emerald-400/80 font-semibold mt-1 block">Preço de custo real acumulado</span>
        </Card>

        {/* Metric 3 */}
        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-rose-950/45 text-rose-400 flex items-center justify-center border border-rose-500/10">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">SKUs Críticos</span>
          </div>
          <h3 className="text-xl font-black text-rose-400">
            {stats.lowStockCount} <span className="text-xs font-medium text-muted-foreground">itens</span>
          </h3>
          <span className="text-[9px] text-rose-400 font-semibold mt-1 block">Saldos abaixo do estoque mínimo</span>
        </Card>

        {/* Metric 4 */}
        <Card className="p-4 bg-[#0E1322]/80 border border-border/60 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Total de SKUs</span>
          </div>
          <h3 className="text-xl font-black text-amber-400">
            {stats.totalSKUs} <span className="text-xs font-medium text-muted-foreground">cadastrados</span>
          </h3>
          <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Filtro de serviços ativos desconsiderado</span>
        </Card>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-border/40 gap-2">
        <button
          onClick={() => setActiveTab("inventario")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "inventario"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-slate-200"
          }`}
        >
          Inventário de Saldos
        </button>
        <button
          onClick={() => {
            setActiveTab("movimentacoes");
            fetchMovements();
          }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "movimentacoes"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-slate-200"
          }`}
        >
          Histórico de Auditoria
        </button>
      </div>

      {/* MAIN CONTAINER CONTENT */}
      {activeTab === "inventario" ? (
        <Card className="bg-[#0E1322]/80 border border-border/60 shadow-xl overflow-hidden backdrop-blur-lg">
          {/* Filters and Search Bar */}
          <div className="p-5 border-b border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0A0D18]/45">
            <div>
              <CardTitle className="text-sm font-bold text-slate-200">Inventário Geral de Produtos</CardTitle>
              <CardDescription className="text-[10px] text-muted-foreground">
                Exibe estoque físico, demandas bloqueadas por reservas e o saldo disponível real para vendas.
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search Bar Input */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Pesquisar SKU ou nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8.5 pl-8.5 pr-4 rounded-lg bg-[#05080E]/90 border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                />
              </div>

              {/* Only Critical Toggle */}
              <button
                onClick={() => {
                  setOnlyCritical(!onlyCritical);
                  setPage(1);
                }}
                className={`h-8.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  onlyCritical
                    ? "bg-rose-950/40 border-rose-500/55 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                    : "bg-[#05080E]/90 border-border/80 text-slate-300 hover:border-slate-500"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Apenas Estoque Crítico
              </button>
            </div>
          </div>

          {/* Table of Inventory */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-20 text-center flex flex-col items-center justify-center gap-2">
                <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin" />
                <span className="text-xs text-muted-foreground font-semibold">Buscando saldos físicos no SQL Server...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="p-16 text-center text-xs text-muted-foreground font-semibold">
                Nenhum produto em estoque corresponde aos filtros aplicados.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-[#0E1322]/55">
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider pl-5">SKU / Ref</th>
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Descrição do Item</th>
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Físico</th>
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Reservado</th>
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Disponível</th>
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Segurança</th>
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center">Status</th>
                    <th className="p-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider pr-5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors text-xs">
                      <td className="p-3 pl-5">
                        <span className="font-mono font-bold text-cyan-400 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-500/10">
                          {p.codigo}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200">{p.nome}</span>
                          <span className="text-[10px] text-muted-foreground">ID Interno: #{p.id}</span>
                        </div>
                      </td>
                      {/* Physical */}
                      <td className="p-3 text-center font-bold text-slate-100">
                        {p.estoqueFisico} <span className="text-[10px] text-muted-foreground font-normal">{p.unidade}</span>
                      </td>
                      {/* Reserved */}
                      <td className="p-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-bold ${p.totalReservado > 0 ? "text-amber-400" : "text-slate-400"}`}>
                            {p.totalReservado}
                          </span>
                          {p.totalReservado > 0 && (
                            <span className="text-[8px] text-muted-foreground block font-medium">
                              (Vendas: {p.resVendas} | Req: {p.resRequisicoes})
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Available */}
                      <td className="p-3 text-center">
                        <span className={`font-black ${p.disponivel <= 0 ? "text-rose-400" : "text-emerald-400"}`}>
                          {p.disponivel}
                        </span>
                      </td>
                      {/* Safety Limit (Minimo) */}
                      <td className="p-3 text-center text-muted-foreground font-semibold">
                        {p.minimo}
                      </td>
                      {/* Status */}
                      <td className="p-3 text-center">
                        {p.disponivel <= 0 ? (
                          <span className="bg-rose-950/30 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                            Sem Saldo
                          </span>
                        ) : p.isCritico ? (
                          <span className="bg-amber-950/30 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                            Estoque Crítico
                          </span>
                        ) : (
                          <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                            Normal
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="p-3 pr-5 text-right">
                        <Button
                          onClick={() => openAdjustmentModal(p)}
                          size="sm"
                          variant="secondary"
                          className="h-7 text-[10px] font-bold px-2.5 bg-card hover:bg-slate-900 border border-border/80 cursor-pointer text-slate-300"
                        >
                          <RefreshCw className="h-3 w-3 mr-1 text-amber-500" />
                          Ajuste
                        </Button>
                      </td>
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
      ) : (
        /* TAB 2: AUDIT MOVEMENTS TIMELINE */
        <Card className="bg-[#0E1322]/80 border border-border/60 shadow-xl overflow-hidden backdrop-blur-lg">
          <div className="p-5 border-b border-border/40 bg-[#0A0D18]/45">
            <CardTitle className="text-sm font-bold text-slate-200">Extrato Geral de Auditoria</CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground">
              Histórico unificado em tempo real das últimas entradas registradas por Compras (`Compra1`) e saídas físicas computadas por Vendas (`Venda1`).
            </CardDescription>
          </div>

          <div className="p-5">
            {isMovementsLoading ? (
              <div className="p-20 text-center flex flex-col items-center justify-center gap-2">
                <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin" />
                <span className="text-xs text-muted-foreground font-semibold">Consolidando ledger de compras e vendas do SQL Server...</span>
              </div>
            ) : movements.length === 0 ? (
              <div className="p-16 text-center text-xs text-muted-foreground font-semibold">
                Nenhuma movimentação de entradas ou saídas encontrada no banco de dados.
              </div>
            ) : (
              <div className="relative border-l-2 border-border/40 ml-4 pl-6 space-y-6 py-2">
                {movements.map((mov) => (
                  <div key={mov.id} className="relative group">
                    {/* Circle icon on the timeline line */}
                    <span className={`absolute -left-[35px] top-1 h-5 w-5 rounded-full flex items-center justify-center border-2 ${
                      mov.type === "Entrada" 
                        ? "bg-emerald-950 text-emerald-400 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                        : "bg-rose-950 text-rose-400 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    }`}>
                      {mov.type === "Entrada" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                    </span>

                    {/* Content Body of the Movement */}
                    <div className="bg-[#121826]/60 border border-border/40 rounded-xl p-4 hover:border-emerald-500/25 transition-all shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            mov.type === "Entrada" 
                              ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/10" 
                              : "bg-rose-950/50 text-rose-400 border border-rose-500/10"
                          }`}>
                            {mov.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono font-bold">Ref: {mov.ref}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold">{mov.date}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 mb-1">{mov.item}</h4>
                      
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Quantidade: <strong className={mov.type === "Entrada" ? "text-emerald-400" : "text-rose-400"}>
                          {mov.type === "Entrada" ? `+${mov.qty}` : `-${mov.qty}`} un
                        </strong></span>
                        <span>Registrado em: <strong className="text-slate-300 font-semibold">{mov.user}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ADJUSTMENT MODAL FOR STOCK */}
      {isAdjustmentModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md border border-border/80 bg-[#0E1322] shadow-2xl relative">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-sm font-black text-slate-100">Ajuste Físico de Estoque</CardTitle>
                </div>
                <button 
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="text-muted-foreground hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground mt-1">
                 SKU: <strong className="text-cyan-400 font-mono">{selectedProduct.codigo}</strong> -- {selectedProduct.nome}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleAdjustmentSubmit}>
              <CardContent className="space-y-4 pt-5">
                {/* Warning Alert */}
                <div className="bg-amber-950/20 border border-amber-500/25 p-3 rounded-lg flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-[10px] text-amber-400 font-medium leading-relaxed">
                    <strong>Atenção:</strong> Esta alteração corrige diretamente o estoque de prateleira na base do SQL Server. Apenas execute se tiver certeza da contagem do inventário físico.
                  </div>
                </div>

                {/* Display Current Math Stats */}
                <div className="grid grid-cols-2 gap-4 bg-[#05080E]/90 p-3 rounded-lg border border-border/40 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider mb-0.5">Estoque Atual</span>
                    <span className="text-slate-200 font-bold">{selectedProduct.estoqueFisico} {selectedProduct.unidade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider mb-0.5">Reservado</span>
                    <span className="text-amber-400 font-bold">{selectedProduct.totalReservado} {selectedProduct.unidade}</span>
                  </div>
                </div>

                {/* Error Banner */}
                {adjustmentError && (
                  <div className="bg-rose-950/35 border border-rose-500/30 text-rose-400 p-2.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{adjustmentError}</span>
                  </div>
                )}

                {/* New Stock Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                    Nova Quantidade Física
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="Ex: 50"
                    value={newStockValue}
                    onChange={(e) => setNewStockValue(e.target.value)}
                    disabled={isSubmittingAdjustment}
                    className="h-10 border-border bg-[#05080E]/90 text-sm font-bold focus:border-cyan-500"
                  />
                </div>
              </CardContent>

              {/* Modal Footer Controls */}
              <div className="p-4 border-t border-border/40 flex justify-end gap-2 bg-[#0A0D18]/45">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmittingAdjustment}
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="h-9 text-xs font-semibold cursor-pointer border border-border/60"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingAdjustment}
                  className="h-9 text-xs font-extrabold gap-1.5 transition-all cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-black shadow-md"
                >
                  {isSubmittingAdjustment ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                      Gravando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4.5 w-4.5" />
                      Gravar Ajuste
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
