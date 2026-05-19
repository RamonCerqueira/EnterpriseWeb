"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Edit, X, Save, Loader2, MapPin, Phone, Mail, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClientSearchInputProps {
  initialName?: string;
  onSelectClient: (client: any) => void;
  onClear: () => void;
}

export default function ClientSearchInput({
  initialName = "",
  onSelectClient,
  onClear
}: ClientSearchInputProps) {
  const [search, setSearch] = useState(initialName);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    setSearch(initialName);
    // Se o initialName for limpo, limpa o selectedClient local
    if (!initialName) {
      setSelectedClient(null);
    }
  }, [initialName]);

  useEffect(() => {
    if (search.trim().length < 2) {
      setClients([]);
      return;
    }

    // Não buscar se o texto for exatamente o nome do cliente selecionado (evitar piscar dropdown após seleção)
    if (selectedClient && (search === selectedClient.Cliente || search === selectedClient.Razao)) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/clientes?search=${encodeURIComponent(search)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setClients(data.items || []);
        }
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedClient]);

  const handleSelect = (cli: any) => {
    setSelectedClient(cli);
    setSearch(cli.Cliente || cli.Razao);
    setShowDropdown(false);
    onSelectClient(cli);
  };

  const handleClear = () => {
    setSearch("");
    setSelectedClient(null);
    onClear();
  };

  const openEditModal = () => {
    if (!selectedClient) return;
    setEditForm({
      cliente: selectedClient.Cliente || "",
      razao: selectedClient.Razao || "",
      cnpj: selectedClient.CGC || "",
      cpf: selectedClient.CPF || "",
      tel: selectedClient.Tel || "",
      email: selectedClient.EMail || "",
      endereco: selectedClient.Endereco || "",
      bairro: selectedClient.Bairro || "",
      cidade: selectedClient.Cidade || "",
      estado: selectedClient.Estado || "",
      cep: selectedClient.Cep || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedClient) return;
    try {
      setSavingEdit(true);
      const res = await fetch(`/api/clientes/${selectedClient.CodCli}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar cliente");
      }

      const { cliente } = await res.json();
      
      // Atualiza o cliente selecionado local
      setSelectedClient(cliente);
      setSearch(cliente.Cliente || cliente.Razao);
      onSelectClient(cliente);
      
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar as alterações do cliente.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <User className="h-3 w-3 text-emerald-400" /> Cliente / Comprador
        </label>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Digite o nome, razão social ou CNPJ do cliente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) {
                handleClear();
              }
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full h-9 pl-3 pr-9 text-xs font-semibold bg-[#0F1420] border-border/80 focus-visible:ring-emerald-500/25"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {loading ? (
              <div className="h-3.5 w-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {showDropdown && clients.length > 0 && (
          <div className="absolute top-[60px] left-0 right-0 z-50 max-h-56 overflow-y-auto bg-slate-950 border border-border/60 rounded-xl shadow-2xl divide-y divide-border/20">
            {clients.map((cli) => (
              <button
                key={cli.CodCli}
                type="button"
                onClick={() => handleSelect(cli)}
                className="w-full p-3 text-xs hover:bg-[#064e3b]/15 cursor-pointer text-left flex flex-col gap-1 transition-colors text-slate-200"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-slate-100">{cli.Cliente || cli.Razao}</span>
                  <Badge className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 font-bold">ID #{cli.CodCli}</Badge>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono">CNPJ/CPF: {cli.CGC || cli.CPF || "Não Informado"}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detalhes do Cliente Selecionado */}
      {selectedClient && (
        <div className="bg-[#0A0D18]/60 border border-emerald-500/20 p-3 rounded-lg flex flex-col gap-2 relative">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-400">{selectedClient.Cliente || selectedClient.Razao}</span>
              <span className="text-[10px] text-muted-foreground">{selectedClient.Razao || selectedClient.Cliente}</span>
            </div>
            <Button
              type="button"
              onClick={openEditModal}
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] bg-secondary/30 hover:bg-secondary/60 text-slate-300 gap-1 px-2 border-none"
            >
              <Edit className="h-3 w-3" /> Corrigir Cadastro
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mt-1">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono">{selectedClient.CGC || selectedClient.CPF || "Documento não informado"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{selectedClient.Tel || "Telefone não informado"}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span>{selectedClient.EMail || "E-mail não informado"}</span>
            </div>
            <div className="flex items-start gap-1.5 col-span-2 mt-0.5">
              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
              <span className="leading-snug">
                {selectedClient.Endereco ? (
                  `${selectedClient.Endereco}${selectedClient.Bairro ? `, ${selectedClient.Bairro}` : ""}${selectedClient.Cidade ? ` - ${selectedClient.Cidade}` : ""}${selectedClient.Estado ? `/${selectedClient.Estado}` : ""}${selectedClient.Cep ? ` (CEP: ${selectedClient.Cep})` : ""}`
                ) : (
                  "Endereço não informado"
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Cliente */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/40 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Edit className="h-4 w-4 text-emerald-400" /> Correção de Cadastro
                </h3>
                <p className="text-[10px] text-muted-foreground">Altere os dados fiscais e de contato do cliente selecionado.</p>
              </div>
              <Button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 border-none rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4 text-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Nome Fantasia / Cliente</label>
                  <Input 
                    value={editForm.cliente} 
                    onChange={e => setEditForm({...editForm, cliente: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Razão Social</label>
                  <Input 
                    value={editForm.razao} 
                    onChange={e => setEditForm({...editForm, razao: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">CNPJ</label>
                  <Input 
                    value={editForm.cnpj} 
                    onChange={e => setEditForm({...editForm, cnpj: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs font-mono" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">CPF</label>
                  <Input 
                    value={editForm.cpf} 
                    onChange={e => setEditForm({...editForm, cpf: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs font-mono" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Telefone</label>
                  <Input 
                    value={editForm.tel} 
                    onChange={e => setEditForm({...editForm, tel: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">E-mail</label>
                  <Input 
                    value={editForm.email} 
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Endereço (Rua, Número)</label>
                  <Input 
                    value={editForm.endereco} 
                    onChange={e => setEditForm({...editForm, endereco: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Bairro</label>
                  <Input 
                    value={editForm.bairro} 
                    onChange={e => setEditForm({...editForm, bairro: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Cidade</label>
                  <Input 
                    value={editForm.cidade} 
                    onChange={e => setEditForm({...editForm, cidade: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Estado (UF)</label>
                  <Input 
                    value={editForm.estado} 
                    maxLength={2}
                    onChange={e => setEditForm({...editForm, estado: e.target.value.toUpperCase()})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs uppercase" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">CEP</label>
                  <Input 
                    value={editForm.cep} 
                    onChange={e => setEditForm({...editForm, cep: e.target.value})}
                    className="h-9 bg-[#0F1420] border-border/80 text-xs font-mono" 
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border/40 bg-slate-950 flex items-center justify-end gap-3">
              <Button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
                className="text-xs h-8 border-border hover:bg-secondary/40 text-slate-300"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="text-xs font-bold h-8 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 border-none"
              >
                {savingEdit ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
