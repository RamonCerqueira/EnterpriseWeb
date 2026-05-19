"use client";

import React, { useState, useEffect } from "react";
import {
  Landmark, Plus, Search, Grid, List, Loader2,
  AlertCircle, ShieldAlert, RefreshCw, Truck
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FornecCard from "./components/FornecCard";
import FornecList from "./components/FornecList";
import FornecFormModal from "./components/FornecFormModal";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  
  // Estados para controle de Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFornec, setSelectedFornec] = useState<any | null>(null);

  // Confirm Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [fornecToDelete, setFornecToDelete] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Efeito reativo para recarregar fornecedores ao alterar busca ou página com Debounce de 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFornecedores();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, page, limit]);

  // Resetar para a primeira página caso filtre por termo de busca ou situação
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const fetchFornecedores = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/fornecedores", window.location.origin);
      if (search.trim()) url.searchParams.set("search", search.trim());
      if (statusFilter !== "TODOS") url.searchParams.set("statusFilter", statusFilter);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setFornecedores(data.items || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedFornec(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fornec: any) => {
    setSelectedFornec(fornec);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (codFor: number) => {
    setFornecToDelete(codFor);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fornecToDelete) return;
    setIsDeleteLoading(true);
    try {
      const res = await fetch(`/api/fornecedores/${fornecToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchFornecedores();
        setIsDeleteOpen(false);
        setFornecToDelete(null);
      } else {
        alert("Falha ao excluir o fornecedor. Verifique as restrições de chaves estrangeiras no SQL.");
      }
    } catch (err) {
      console.error("Delete supplier error", err);
      alert("Erro de conexão ao tentar excluir.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-slate-100">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-100 flex items-center gap-2">
            <Truck className="h-6 w-6 text-sky-400" /> Cadastro de Fornecedores
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cadastre e gerencie fornecedores, dados bancários de faturamento e notas contratuais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFornecedores}
            className="h-9 px-3 text-xs flex items-center gap-1 cursor-pointer border-border/80 hover:bg-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Dialog Add Supplier Trigger */}
          <Button
            onClick={handleCreateNew}
            className="text-xs font-bold h-9 bg-sky-500 hover:bg-sky-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(14,165,233,0.2)] cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" /> Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Main Grid Card Container */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden shadow-2xl">

        {/* Toolbar: Search, Status & View Mode Toggle */}
        <div className="p-4 border-b border-border/40 flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-extrabold text-slate-200">Filtro de Fornecedores</CardTitle>
            <p className="text-[10px] text-muted-foreground">Filtre por código, nome, CNPJ/CPF, cidade ou pela situação cadastral.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar por Cód, Nome, CNPJ, Cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-sky-500 transition-all font-semibold"
              />
            </div>

            {/* Status Select Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer font-bold w-full sm:w-40 shrink-0"
            >
              <option value="TODOS">Todas as Situações</option>
              <option value="A">Somente Ativos</option>
              <option value="I">Somente Inativos</option>
            </select>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-[#0F1420] border border-border/80 p-0.5 rounded-lg shrink-0 w-full sm:w-auto justify-center">
              <button
                onClick={() => setViewMode("card")}
                className={`h-7.5 w-8.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === "card"
                    ? "bg-sky-500 text-black font-extrabold"
                    : "text-muted-foreground hover:text-slate-200"
                  }`}
                title="Visão em Cartões"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`h-7.5 w-8.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === "list"
                    ? "bg-sky-500 text-black font-extrabold"
                    : "text-muted-foreground hover:text-slate-200"
                  }`}
                title="Visão em Lista"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic List Content rendering */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
            <span className="text-xs text-muted-foreground font-semibold">Consultando fornecedores no banco SQL Server...</span>
          </div>
        ) : fornecedores.length === 0 ? (
          <div className="p-16 text-center text-xs text-muted-foreground font-semibold flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-7 w-7 text-amber-500/80" />
            <span>Nenhum registro de fornecedor encontrado. Crie um novo acima!</span>
          </div>
        ) : viewMode === "card" ? (
          /* Cards view: Responsive Grid with exactly 4 cards per row on large displays (xl:grid-cols-4) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-5 bg-[#0A0D16]/20">
            {fornecedores.map((fornec) => (
              <FornecCard
                key={fornec.CodFor}
                fornec={fornec}
                onEdit={handleEdit}
                onDelete={handleDeleteTrigger}
              />
            ))}
          </div>
        ) : (
          /* List view: Standard Table List component */
          <div className="p-1.5">
            <FornecList
              fornecedores={fornecedores}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
            />
          </div>
        )}

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30 text-xs font-semibold">
            <div className="text-muted-foreground text-center sm:text-left">
              Exibindo <span className="text-slate-200 font-bold">{fornecedores.length}</span> de <span className="text-slate-200 font-bold">{totalItems}</span> registros
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
                  className="h-7 px-2 rounded bg-[#0F1420] border border-border/60 text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer font-bold"
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
                  className="h-7 px-2 border border-border/60 hover:bg-[#1C2436] hover:text-sky-400 text-muted-foreground disabled:opacity-40"
                >
                  Anterior
                </Button>
                <div className="h-7 px-3 flex items-center justify-center rounded bg-[#1F293D] border border-border/40 text-sky-400 font-bold min-w-7">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="h-7 px-2 border border-border/60 hover:bg-[#1C2436] hover:text-sky-400 text-muted-foreground disabled:opacity-40"
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Main Supplier Creation/Edit Modal */}
      <FornecFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchFornecedores}
        fornec={selectedFornec}
      />

      {/* Custom Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#0F1422] border border-border/80 p-5 rounded-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="h-6 w-6" />
              <h4 className="text-sm font-extrabold uppercase tracking-wide">Excluir Fornecedor</h4>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Você tem certeza absoluta que deseja excluir este fornecedor? Essa ação removerá o registro permanente da tabela `Fornec` do banco de dados e não poderá ser desfeita.
            </p>

            <div className="flex justify-end gap-2 border-t border-border/20 pt-3.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(false)}
                className="text-xs h-8 cursor-pointer"
                disabled={isDeleteLoading}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteConfirm}
                className="text-xs h-8 bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    Excluindo...
                  </>
                ) : (
                  "Confirmar Exclusão"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
