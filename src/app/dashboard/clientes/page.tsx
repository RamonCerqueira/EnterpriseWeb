"use client";

import React, { useState, useEffect } from "react";
import {
  Building2, Plus, Search, Grid, List, Loader2,
  AlertCircle, ShieldAlert, Award, RefreshCw
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientCard from "./components/ClientCard";
import ClientList from "./components/ClientList";
import ClientFormModal from "./components/ClientFormModal";

export default function ClientesPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  // Confirm Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Load clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clientes");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (codCli: number) => {
    setClientToDelete(codCli);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    setIsDeleteLoading(true);
    try {
      const res = await fetch(`/api/clientes/${clientToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchClients();
        setIsDeleteOpen(false);
        setClientToDelete(null);
      } else {
        alert("Falha ao excluir o cliente. Verifique suas permissões.");
      }
    } catch (err) {
      console.error("Delete client error", err);
      alert("Erro de conexão ao tentar excluir.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Filter clients dynamically by code, name, or document
  const filteredClients = clients.filter((c) => {
    const term = search.toLowerCase();
    const codStr = String(c.CodCli);
    const nameStr = (c.Cliente || "").toLowerCase();
    const docStr = (c.CGC || c.CPF || "").toLowerCase();
    const reasonStr = (c.Razao || "").toLowerCase();
    const cityStr = (c.Cidade || "").toLowerCase();

    return (
      codStr.includes(term) ||
      nameStr.includes(term) ||
      docStr.includes(term) ||
      reasonStr.includes(term) ||
      cityStr.includes(term)
    );
  });

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-slate-100">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-100 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-emerald-400" /> Cadastro de Clientes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cadastre e gerencie a lista completa de clientes corporativos e pessoais no banco de dados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClients}
            className="h-9 px-3 text-xs flex items-center gap-1 cursor-pointer border-border/80 hover:bg-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Dialog Add Client Trigger */}
          <Button
            onClick={handleCreateNew}
            className="text-xs font-bold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" /> Novo Cliente
          </Button>
        </div>
      </div>

      {/* Main Grid Card Container */}
      <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden shadow-2xl">

        {/* Toolbar: Search, View Mode Toggle */}
        <div className="p-4 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-extrabold text-slate-200">Filtro de Clientes</CardTitle>
            <p className="text-[10px] text-muted-foreground">Utilize o campo ao lado para filtrar por código, nome, CNPJ ou cidade.</p>
          </div>

          <div className="flex items-center w-full sm:w-auto gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar por Cód, Nome, CNPJ, Cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
              />
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-[#0F1420] border border-border/80 p-0.5 rounded-lg shrink-0">
              <button
                onClick={() => setViewMode("card")}
                className={`h-7.5 w-8.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === "card"
                    ? "bg-emerald-500 text-black font-extrabold"
                    : "text-muted-foreground hover:text-slate-200"
                  }`}
                title="Visão em Cartões"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`h-7.5 w-8.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === "list"
                    ? "bg-emerald-500 text-black font-extrabold"
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
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
            <span className="text-xs text-muted-foreground font-semibold">Consultando clientes no banco SQL Server...</span>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-16 text-center text-xs text-muted-foreground font-semibold flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-7 w-7 text-amber-500/80" />
            <span>Nenhum registro de cliente encontrado. Crie um novo acima!</span>
          </div>
        ) : viewMode === "card" ? (
          /* Cards view: Responsive Grid with exactly 4 cards per row on large displays (xl:grid-cols-4) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-5 bg-[#0A0D16]/20">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.CodCli}
                client={client}
                onEdit={handleEdit}
                onDelete={handleDeleteTrigger}
              />
            ))}
          </div>
        ) : (
          /* List view: Standard Table List component */
          <div className="p-1.5">
            <ClientList
              clients={filteredClients}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
            />
          </div>
        )}
      </Card>

      {/* Main Client Creation/Edit Modal */}
      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClients}
        client={selectedClient}
      />

      {/* Custom Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#0F1422] border border-border/80 p-5 rounded-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="h-6 w-6" />
              <h4 className="text-sm font-extrabold uppercase tracking-wide">Excluir Cliente</h4>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Você tem certeza absoluta que deseja excluir este cliente? Essa ação removerá o registro permanente da tabela `CLIENTEs` do banco de dados e não poderá ser desfeita.
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
