"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Database,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Loader2,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  FileText,
  AlertCircle
} from "lucide-react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import modelsMetadata from "@/lib/models-metadata.json";

// Type definitions
interface MetadataField {
  name: string;
  type: string;
  isNullable: boolean;
  isList: boolean;
  isId: boolean;
  isAutoincrement: boolean;
}

interface ModelMetadata {
  name: string;
  dbMap: string;
  primaryKey: {
    field: string;
    type: string;
    isCompound: boolean;
  };
  fields: MetadataField[];
}

export default function CadastrosCRUDPage() {
  // All available models in alphabetical order
  const allTables = useMemo(() => {
    return Object.keys(modelsMetadata).sort();
  }, []);

  // State variables
  const [tableSearch, setTableSearch] = useState("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [recordSearch, setRecordSearch] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Loading and feedback states
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected items for CRUD
  const [currentRecord, setCurrentRecord] = useState<any | null>(null);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered list of tables based on search
  const filteredTables = useMemo(() => {
    return allTables.filter(t => 
      t.toLowerCase().includes(tableSearch.toLowerCase()) ||
      ((modelsMetadata as any)[t]?.dbMap || "").toLowerCase().includes(tableSearch.toLowerCase())
    );
  }, [allTables, tableSearch]);

  // Selected table metadata helper
  const activeMetadata = useMemo<ModelMetadata | null>(() => {
    if (!selectedTable) return null;
    return (modelsMetadata as Record<string, ModelMetadata>)[selectedTable];
  }, [selectedTable]);

  // Load records when selected table, page, or record search changes
  useEffect(() => {
    if (!selectedTable) return;

    const delayDebounce = setTimeout(() => {
      fetchRecords();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [selectedTable, page, limit, recordSearch]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [recordSearch]);

  // Reset everything when changing table
  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    setRecords([]);
    setRecordSearch("");
    setPage(1);
    setFeedback(null);
  };

  const fetchRecords = async () => {
    setIsLoadingRecords(true);
    try {
      const url = new URL(`/api/crud/${selectedTable}`, window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());
      if (recordSearch.trim()) {
        url.searchParams.set("search", recordSearch.trim());
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setRecords(data.items || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.pages || 1);
      } else {
        const data = await res.json();
        showFeedback("error", data.error || "Falha ao obter registros.");
      }
    } catch (err) {
      console.error(err);
      showFeedback("error", "Erro ao conectar com o servidor.");
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => {
      setFeedback(prev => prev?.msg === msg ? null : prev);
    }, 6000);
  };

  // Open creation modal
  const handleCreateNew = () => {
    if (!activeMetadata) return;
    const initialData: Record<string, any> = {};
    activeMetadata.fields.forEach(f => {
      if (f.type === "Boolean") {
        initialData[f.name] = false;
      } else {
        initialData[f.name] = "";
      }
    });
    setFormData(initialData);
    setCurrentRecord(null);
    setIsFormOpen(true);
  };

  // Open edit modal
  const handleEditRecord = (record: any) => {
    if (!activeMetadata) return;
    const prefilledData: Record<string, any> = {};
    activeMetadata.fields.forEach(f => {
      const val = record[f.name];
      if (val === null || val === undefined) {
        prefilledData[f.name] = "";
      } else if (f.type === "DateTime") {
        try {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            prefilledData[f.name] = date.toISOString().slice(0, 16);
          } else {
            prefilledData[f.name] = "";
          }
        } catch {
          prefilledData[f.name] = "";
        }
      } else {
        prefilledData[f.name] = val;
      }
    });
    setFormData(prefilledData);
    setCurrentRecord(record);
    setIsFormOpen(true);
  };

  // Open view modal
  const handleViewRecord = (record: any) => {
    setCurrentRecord(record);
    setIsViewOpen(true);
  };

  // Open delete confirm
  const handleDeleteTrigger = (record: any) => {
    if (!activeMetadata) return;
    const pkVal = record[activeMetadata.primaryKey.field];
    setIdToDelete(String(pkVal));
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!selectedTable || !idToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/crud/${selectedTable}/${idToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showFeedback("success", "Registro excluído com sucesso.");
        fetchRecords();
        setIsDeleteOpen(false);
        setIdToDelete(null);
      } else {
        const data = await res.json();
        showFeedback("error", data.error || "Falha ao excluir o registro.");
      }
    } catch (err) {
      console.error(err);
      showFeedback("error", "Erro ao conectar para exclusão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable || !activeMetadata) return;
    setIsSubmitting(true);

    try {
      const isEdit = !!currentRecord;
      let url = `/api/crud/${selectedTable}`;
      if (isEdit) {
        const pkVal = currentRecord[activeMetadata.primaryKey.field];
        url += `/${pkVal}`;
      }

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showFeedback("success", isEdit ? "Registro atualizado com sucesso." : "Registro criado com sucesso.");
        fetchRecords();
        setIsFormOpen(false);
        setCurrentRecord(null);
      } else {
        const data = await res.json();
        showFeedback("error", data.error || "Falha ao salvar registro.");
      }
    } catch (err) {
      console.error(err);
      showFeedback("error", "Erro de conexão ao tentar salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 text-slate-100 animate-fade-in">
      
      {/* LEFT PANEL: Table/Cadastro List */}
      <div className="w-full lg:w-80 flex flex-col shrink-0 bg-[#121826]/75 border border-slate-800/80 rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="p-4.5 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/60 to-[#0e131f]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-emerald-400" />
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-200">Cadastros ({allTables.length})</h3>
          </div>
        </div>

        {/* Table list search bar */}
        <div className="p-3.5 border-b border-slate-800/50 bg-[#0a0d16]/30">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar cadastro/tabela..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full bg-[#161c2a] border border-slate-800 focus:border-emerald-500/80 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Scrollable list of models */}
        <div className="flex-1 overflow-y-auto max-h-[250px] lg:max-h-full divide-y divide-slate-800/40">
          {filteredTables.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">Nenhum cadastro encontrado.</div>
          ) : (
            filteredTables.map((tableName) => {
              const info = (modelsMetadata as any)[tableName];
              const isSelected = selectedTable === tableName;
              return (
                <button
                  key={tableName}
                  onClick={() => handleSelectTable(tableName)}
                  className={`w-full text-left p-3.5 flex flex-col transition-all cursor-pointer outline-none hover:bg-slate-800/30 ${
                    isSelected ? "bg-emerald-500/5 border-l-3 border-emerald-400" : ""
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? "text-emerald-400" : "text-slate-200"}`}>
                    {tableName}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-medium">
                    <span>Mapeado: {info.dbMap}</span>
                    <span className="bg-[#171d2b] px-2 py-0.5 rounded-full text-[9px] border border-slate-800">
                      {info.fields.length} campos
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Records List and CRUD Panel */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#121826]/75 border border-slate-800/80 rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        
        {/* Feedback alert banner */}
        {feedback && (
          <div
            className={`p-3.5 text-xs flex items-center justify-between border-b ${
              feedback.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              <span>{feedback.msg}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="hover:opacity-85 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {!selectedTable ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center select-none min-h-[400px]">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <Database className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-200">Painel de Cadastros Gerais</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
              Selecione um dos cadastros na barra lateral esquerda para visualizar, filtrar, criar, atualizar e remover registros diretamente no banco de dados.
            </p>
          </div>
        ) : (
          /* Active CRUD Panel */
          <div className="flex-1 flex flex-col h-full min-h-0">
            {/* Header Toolbar */}
            <div className="p-4.5 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/60 to-[#0e131f]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-100 flex items-center gap-2 tracking-wide">
                  <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-400" /> Cadastro: {selectedTable}
                </h2>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-mono">
                  <span>Tabela: {activeMetadata?.dbMap}</span>
                  <span>•</span>
                  <span>Chave Primária: {activeMetadata?.primaryKey.field} ({activeMetadata?.primaryKey.type})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRecords}
                  disabled={isLoadingRecords}
                  className="h-8.5 px-3 text-xs flex items-center gap-1.5 border-slate-800 bg-[#161c2a] hover:bg-slate-800 text-slate-300 transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoadingRecords ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>

                <Button
                  onClick={handleCreateNew}
                  className="h-8.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] rounded-lg cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Plus className="h-4 w-4 text-black" /> Novo Registro
                </Button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="p-3.5 border-b border-slate-800/50 bg-[#0a0d16]/30 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pesquisar nos registros..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full bg-[#161c2a] border border-slate-800 focus:border-emerald-500/80 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="text-[10px] text-slate-500 font-mono font-bold ml-auto">
                EXIBINDO {records.length} DE {totalItems} REGISTROS
              </div>
            </div>

            {/* Scrollable Data Table */}
            <div className="flex-1 overflow-x-auto min-h-0 relative">
              {isLoadingRecords ? (
                <div className="absolute inset-0 bg-[#0B0F19]/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2 bg-[#121826] p-4.5 rounded-xl border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
                    <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                    <span className="text-[10px] text-slate-400 font-mono">Buscando dados no banco...</span>
                  </div>
                </div>
              ) : null}

              {records.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500/40 mb-3 animate-bounce" />
                  Nenhum registro encontrado neste cadastro.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0e131f]/40 border-b border-slate-800/65 text-slate-400">
                      {activeMetadata?.fields.map((field) => (
                        <th key={field.name} className="p-3.5 font-bold tracking-wider whitespace-nowrap text-[10px] uppercase">
                          <span className="flex items-center gap-1">
                            {field.name}
                            {field.isId && (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded border border-emerald-500/20 font-bold uppercase">PK</span>
                            )}
                          </span>
                        </th>
                      ))}
                      <th className="p-3.5 font-bold text-right text-[10px] uppercase">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {records.map((record, index) => {
                      const pkVal = activeMetadata ? record[activeMetadata.primaryKey.field] : index;
                      return (
                        <tr key={String(pkVal)} className="hover:bg-slate-800/10 transition-colors duration-150">
                          {activeMetadata?.fields.map((field) => {
                            const val = record[field.name];
                            let displayVal = "";
                            if (val === null || val === undefined) {
                              displayVal = "-";
                            } else if (typeof val === "boolean") {
                              displayVal = val ? "Sim" : "Não";
                            } else if (typeof val === "object") {
                              displayVal = JSON.stringify(val);
                            } else if (field.type === "DateTime") {
                              displayVal = new Date(val).toLocaleString("pt-BR");
                            } else {
                              displayVal = String(val);
                            }

                            if (displayVal.length > 35) {
                              displayVal = displayVal.substring(0, 32) + "...";
                            }

                            return (
                              <td key={field.name} className="p-3.5 font-mono text-[11px] text-slate-300 max-w-[200px] truncate">
                                {displayVal}
                              </td>
                            );
                          })}

                          {/* Actions */}
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewRecord(record)}
                                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-emerald-400 text-slate-400 transition-colors cursor-pointer outline-none"
                                title="Visualizar Detalhes"
                              >
                                <Eye className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleEditRecord(record)}
                                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-slate-400 transition-colors cursor-pointer outline-none"
                                title="Editar"
                              >
                                <Edit2 className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTrigger(record)}
                                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-red-400 text-slate-400 transition-colors cursor-pointer outline-none"
                                title="Excluir"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="p-3.5 border-t border-slate-800/50 bg-[#0e131f]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <span>Itens por página:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value, 10));
                      setPage(1);
                    }}
                    className="bg-[#161c2a] border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 outline-none focus:border-emerald-500/80 transition-colors cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px]">Página {page} de {totalPages}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-8 w-8 p-0 flex items-center justify-center border-slate-800 bg-[#161c2a] hover:bg-slate-800 text-slate-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="h-8 w-8 p-0 flex items-center justify-center border-slate-800 bg-[#161c2a] hover:bg-slate-800 text-slate-300"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PREMIUM MODAL 1: Form para Criar / Editar */}
      {isFormOpen && activeMetadata && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900/95 border border-slate-800/90 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] shadow-emerald-500/5 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-800/60 bg-gradient-to-r from-slate-950/40 to-[#0e131f]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100 tracking-wide uppercase">
                    {currentRecord ? "Editar Registro" : "Novo Registro"}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                    Cadastro: {selectedTable}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="h-8 w-8 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800/40 hover:border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-all cursor-pointer outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form content */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {activeMetadata.fields.map((field) => {
                  const isPrimaryKey = field.isId;
                  const isAutoincrement = field.isAutoincrement;
                  const isDisabled = isPrimaryKey && (isAutoincrement || !!currentRecord);

                  return (
                    <div 
                      key={field.name} 
                      className={`flex flex-col gap-1.5 ${
                        field.name === "Observacao" || field.name === "Observacao2" || field.name === "Historico" ? "sm:col-span-2" : ""
                      }`}
                    >
                      <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 select-none">
                        {field.name}
                        {isPrimaryKey && (
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-bold uppercase shadow-[0_0_10px_rgba(16,185,129,0.05)]">PK</span>
                        )}
                        {!field.isNullable && !isAutoincrement && (
                          <span className="text-emerald-400 font-black text-xs">*</span>
                        )}
                      </label>

                      {isAutoincrement && !currentRecord ? (
                        <input
                          type="text"
                          disabled
                          value="Auto-incrementado"
                          className="w-full bg-slate-950/40 border border-slate-800/50 text-slate-500 rounded-lg px-3 py-2 text-xs cursor-not-allowed font-mono italic"
                        />
                      ) : field.type === "Boolean" ? (
                        <div className="flex items-center gap-3 h-9.5">
                          {/* Premium Switch Switcher */}
                          <button
                            type="button"
                            onClick={() => handleFieldChange(field.name, !formData[field.name])}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                              formData[field.name] ? "bg-emerald-500" : "bg-slate-800"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                formData[field.name] ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className="text-xs text-slate-400 font-mono">
                            {formData[field.name] ? "Ativado (Sim)" : "Desativado (Não)"}
                          </span>
                        </div>
                      ) : field.name === "Observacao" || field.name === "Observacao2" || field.name === "Historico" ? (
                        <textarea
                          value={formData[field.name] || ""}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder="Digite aqui as informações adicionais..."
                          required={!field.isNullable}
                          className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700/60 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 text-slate-100 rounded-lg px-3 py-2 text-xs placeholder:text-slate-500 transition-all font-mono min-h-[90px] outline-none"
                        />
                      ) : (
                        <input
                          type={field.type === "Int" || field.type === "Float" || field.type === "Decimal" ? "number" : field.type === "DateTime" ? "datetime-local" : "text"}
                          step={field.type === "Float" || field.type === "Decimal" ? "any" : "1"}
                          disabled={isDisabled}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          required={!field.isNullable && !isAutoincrement}
                          className={`w-full border text-slate-100 rounded-lg px-3 py-2.5 text-xs placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono outline-none ${
                            isDisabled 
                              ? "bg-slate-950/40 border-slate-800/40 text-slate-500 cursor-not-allowed" 
                              : "bg-slate-950/50 border-slate-850 hover:border-slate-700/60 focus:border-emerald-500/80"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800/50 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                  className="h-9.5 px-4 text-xs font-semibold border-slate-800 bg-[#161c2a] hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9.5 px-4 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] rounded-lg cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvando...
                    </>
                  ) : (
                    "Salvar Registro"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREMIUM MODAL 2: Visualização de Detalhes Completa */}
      {isViewOpen && currentRecord && activeMetadata && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900/95 border border-slate-800/90 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] shadow-emerald-500/5 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-800/60 bg-gradient-to-r from-slate-950/40 to-[#0e131f]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Eye className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100 tracking-wide uppercase">
                    Detalhes do Registro
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                    Cadastro: {selectedTable}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="h-8 w-8 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800/40 hover:border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-all cursor-pointer outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Details Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeMetadata.fields.map((field) => {
                  const val = currentRecord[field.name];
                  let displayVal = "";
                  if (val === null || val === undefined) {
                    displayVal = "Nulo / Vazio";
                  } else if (typeof val === "boolean") {
                    displayVal = val ? "Verdadeiro (Sim)" : "Falso (Não)";
                  } else if (field.type === "DateTime") {
                    displayVal = new Date(val).toLocaleString("pt-BR");
                  } else {
                    displayVal = String(val);
                  }

                  return (
                    <div 
                      key={field.name} 
                      className={`p-3.5 bg-slate-950/30 rounded-xl border border-slate-850/50 flex flex-col gap-1.5 ${
                        field.name === "Observacao" || field.name === "Observacao2" || field.name === "Historico" ? "sm:col-span-2" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-extrabold tracking-wider uppercase text-slate-500 select-none">
                        <span>{field.name}</span>
                        <div className="flex items-center gap-1 font-mono">
                          {field.isId && (
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded border border-emerald-500/25 uppercase font-bold">PK</span>
                          )}
                          <span className="bg-slate-800/80 px-1.5 py-0.2 rounded lowercase text-slate-500 font-bold">
                            {field.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-200 mt-0.5 font-mono break-all whitespace-pre-wrap leading-relaxed select-text">
                        {displayVal}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-5 border-t border-slate-800/50 mt-6">
                <Button
                  onClick={() => setIsViewOpen(false)}
                  className="h-9 px-4 text-xs font-semibold border-slate-850 bg-[#161c2a] hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                  variant="outline"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM MODAL 3: Confirmação de Exclusão */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900/95 border border-slate-800/90 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] shadow-red-500/5 w-full max-w-md animate-slide-up overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-500 mb-5 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wide">Excluir registro permanentemente?</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Esta ação removerá o registro com ID <span className="font-mono text-amber-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{idToDelete}</span> no cadastro <span className="font-bold text-slate-300">{selectedTable}</span>.
              </p>
              
              <div className="bg-red-950/15 border border-red-900/20 rounded-xl p-3 mt-4 text-[10px] text-red-400 leading-normal flex items-start gap-2 text-left">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-500" />
                <span>Registros vinculados por chave estrangeira (FK) em outras tabelas podem impedir a exclusão ou gerar erros de integridade.</span>
              </div>
              
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteOpen(false);
                    setIdToDelete(null);
                  }}
                  disabled={isSubmitting}
                  className="h-9 px-4 text-xs font-semibold border-slate-850 bg-[#161c2a] hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="h-9 px-4 text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1 rounded-lg cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Excluindo...
                    </>
                  ) : (
                    "Excluir Registro"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
