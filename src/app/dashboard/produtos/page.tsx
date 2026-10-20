"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Importações dos novos componentes específicos
import { ProductMetrics } from "./components/ProductMetrics";
import { ProductFilterBar } from "./components/ProductFilterBar";
import { ProductListTable } from "./components/ProductListTable";
import { ProductGrid } from "./components/ProductGrid";
import { ProductFormDialog } from "./components/ProductFormDialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODAS");
  const [stockFilter, setStockFilter] = useState("TODOS");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Estados para controle de Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Carrega as categorias disponíveis apenas uma vez no mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/produtos?limit=1000");
        if (res.ok) {
          const data = await res.json();
          const cats = Array.from(new Set(data.items.map((p: any) => p.categoria || "Acessórios"))) as string[];
          setCategoriesList(cats);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  // Efeito reativo para recarregar produtos ao alterar filtros com Debounce de 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, categoryFilter, stockFilter, page, limit]);

  // Resetar para a primeira página caso filtre por categoria ou estoque
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, stockFilter, search]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/produtos", window.location.origin);
      if (search.trim()) url.searchParams.set("search", search.trim());
      if (categoryFilter !== "TODAS") url.searchParams.set("category", categoryFilter);
      if (stockFilter !== "TODOS") url.searchParams.set("stockStatus", stockFilter);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setSelectedProduct(p);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir fisicamente este produto do catálogo do banco de dados? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/produtos?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao excluir produto.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha de conexão com o banco.");
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-700" /> Catálogo de Produtos
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerenciamento completo integrado à tabela SQL Server `Produto`. Suporte de precificação, tributário e volumetria.
          </p>
        </div>

        {/* Add Product Button */}
        <Button
          onClick={handleOpenAdd}
          className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Novo Cadastro
        </Button>
      </div>

      {/* Row of Metrics */}
      <ProductMetrics products={products} />

      {/* Search and Table Grid Container */}
      <Card className="bg-[#FFFFFF]/75 border border-border/60 overflow-hidden">
        {/* Table Filter Bar Component */}
        <ProductFilterBar
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          categoriesList={categoriesList}
        />

        {/* Dynamic List or Grid Toggle View */}
        <div className="p-1.5 overflow-x-auto">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 text-emerald-700 animate-spin" />
              <span className="text-xs text-muted-foreground font-semibold">Consultando acervo no SQL Server...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-xs text-muted-foreground font-semibold">
              Nenhum produto correspondente aos filtros.
            </div>
          ) : viewMode === "list" ? (
            <ProductListTable
              products={products}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ) : (
            <ProductGrid
              products={products}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8FAFC]/30 text-xs font-semibold">
            <div className="text-muted-foreground text-center sm:text-left">
              Exibindo <span className="text-slate-800 font-bold">{products.length}</span> de <span className="text-slate-800 font-bold">{totalItems}</span> registros
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Linhas:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    setPage(1);
                  }}
                  className="h-7 px-2 rounded bg-[#FFFFFF] border border-border/60 text-slate-600 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="h-7 px-2 border border-border/60 hover:bg-[#F1F5F9] hover:text-emerald-700 text-muted-foreground disabled:opacity-40"
                >
                  Anterior
                </Button>
                <div className="h-7 px-3 flex items-center justify-center rounded bg-[#E2E8F0] border border-border/40 text-emerald-700 font-bold min-w-7">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="h-7 px-2 border border-border/60 hover:bg-[#F1F5F9] hover:text-emerald-700 text-muted-foreground disabled:opacity-40"
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Multi-Tab Create/Edit Form Modal */}
      <ProductFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
