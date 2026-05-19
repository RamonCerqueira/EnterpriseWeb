"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
  ArrowLeft,
  Trash2,
  Save,
  Check,
  Building,
  User,
  CreditCard,
  Hash,
  Briefcase,
  Layers,
  ArrowUpRight,
  Info,
  Truck,
  Settings2,
  Image as ImageIcon,
  Mail,
  X,
  ShoppingCart,
  RotateCcw,
  Key,
  Globe
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Local modular components
import ClientSearchInput from "./components/ClientSearchInput";
import ProductSearchPanel from "./components/ProductSearchPanel";

interface PropostaItem {
  lanc?: number;
  codpro: number;
  nome: string;
  referencia: string;
  cfop: string;
  unidade: string;
  qtd: number;
  precoUnitario: number;
  total: number;
  isServico: boolean;
  ambiente: string;
  estoqueFisico: number;
  imagemUrl: string;
}

interface PropostaHeader {
  id?: number;
  pedido?: number;
  clienteId: number | "";
  clienteNome: string;
  data: string;
  validade: string;
  valorProdutos: number;
  valorServicos: number;
  subtotal: number;
  valorTotal: number;
  descontoPercentual: number;
  status: string;
  tipo: string; // Proposta, Pedido, Garantia, Insumos, Carta Crédito
  naturezaOperacao: string;
  observacao: string;
  condicaoPagamento: string;
  tipoPreco: string; // A Vista, Cartao, R$ 3
  codEmp: number;
  modalidadeFrete: string;
  moeda: string;
  dadosAdicionais: string;
  observacaoCliente: string;
  prazoEntrega: string;
  dataAprovacao: string;
  itens: PropostaItem[];
}

export default function PropostasPage() {
  // Views: 'list' | 'editor'
  const [view, setView] = useState<"list" | "editor">("list");
  const [propostas, setPropostas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Tab State for Editor Bottom Panel
  const [activeTab, setActiveTab] = useState<string>("Textos");

  // Lists loaded for selectors
  const [companies, setCompanies] = useState<any[]>([]);

  // Editor states
  const [currentProp, setCurrentProp] = useState<PropostaHeader>({
    clienteId: "",
    clienteNome: "",
    data: new Date().toISOString().split("T")[0],
    validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 15 dias validade
    valorProdutos: 0,
    valorServicos: 0,
    subtotal: 0,
    valorTotal: 0,
    descontoPercentual: 0,
    status: "Pendente",
    tipo: "Proposta",
    naturezaOperacao: "VENDA",
    observacao: "",
    condicaoPagamento: "BOLETO",
    tipoPreco: "1", // 1 = A Vista, 2 = Cartao, 3 = R$ 3
    codEmp: 1,
    modalidadeFrete: "0",
    moeda: "R$",
    dadosAdicionais: "",
    observacaoCliente: "",
    prazoEntrega: "",
    dataAprovacao: "",
    itens: [],
  });

  // Load initial data
  useEffect(() => {
    fetchPropostas();
    fetchCompanies();
  }, []);

  // Listen to active company changes from Sidebar
  useEffect(() => {
    const handleActiveCompanyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const company = customEvent.detail;
      if (company && company.id) {
        setCurrentProp(prev => ({ ...prev, codEmp: company.id }));
      }
    };

    window.addEventListener("activeCompanyChanged", handleActiveCompanyChange);
    return () => {
      window.removeEventListener("activeCompanyChanged", handleActiveCompanyChange);
    };
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchPropostas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/propostas");
      if (!res.ok) throw new Error("Falha ao obter propostas.");
      const data = await res.json();
      setPropostas(data);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Erro ao conectar com o banco de dados.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/empresas");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
        if (data.length > 0) {
          let defaultId = data[0].CodEmp;
          const saved = localStorage.getItem("active-company");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.id) {
                const exists = data.some((c: any) => c.CodEmp === parsed.id);
                if (exists) defaultId = parsed.id;
              }
            } catch (e) {
              console.error(e);
            }
          }
          setCurrentProp(prev => ({ ...prev, codEmp: defaultId }));
        }
      }
    } catch (err) {
      console.error("Erro ao carregar filiais:", err);
    }
  };

  const recalculateSums = (itens: PropostaItem[], descPercent: number, priceTable: string) => {
    let sumProd = 0;
    let sumServ = 0;

    const updatedItens = itens.map(item => {
      const itemTotal = Number(item.qtd) * Number(item.precoUnitario);
      if (item.isServico) {
        sumServ += itemTotal;
      } else {
        sumProd += itemTotal;
      }
      return { ...item, total: itemTotal };
    });

    const sub = sumProd + sumServ;
    const descValue = sub * (descPercent / 100);
    const tot = sub - descValue;

    return {
      itens: updatedItens,
      valorProdutos: sumProd,
      valorServicos: sumServ,
      subtotal: sub,
      valorTotal: tot,
    };
  };

  const handleDescontoChange = (val: number) => {
    const d = Math.max(0, Math.min(100, val));
    const sums = recalculateSums(currentProp.itens, d, currentProp.tipoPreco);
    setCurrentProp(prev => ({
      ...prev,
      descontoPercentual: d,
      ...sums,
    }));
  };

  const handlePriceTableChange = (table: string) => {
    setCurrentProp(prev => {
      // Recalculate all item prices based on the new table if we wanted to dynamically reload prices,
      // but usually the price table is applied to new items or recalcs existing if mapped.
      // For now, we'll just set it.
      return { ...prev, tipoPreco: table };
    });
  };

  const handleAddItemFromPanel = (prod: any, quantity: number) => {
    let price = prod.Preco1 ? Number(prod.Preco1) : 0;
    if (currentProp.tipoPreco === "2" && prod.Preco2) price = Number(prod.Preco2);
    if (currentProp.tipoPreco === "3" && prod.Preco3) price = Number(prod.Preco3);
    if (currentProp.tipoPreco === "4" && prod.Preco4) price = Number(prod.Preco4);

    const isServ = prod.Servico === "S";

    // Placeholder image
    const imgUrl = prod.Caminho ? prod.Caminho : `https://ui-avatars.com/api/?name=${encodeURIComponent(prod.Produto || "P")}&background=0F1420&color=10B981&size=64&font-size=0.4&rounded=true`;

    const newItem: PropostaItem = {
      codpro: prod.CodPro,
      nome: prod.Produto || "Produto Físico",
      referencia: prod.Referencia || "",
      cfop: isServ ? "9.301" : "5.102",
      unidade: prod.Unidade || "UN",
      qtd: quantity,
      precoUnitario: price,
      total: quantity * price,
      isServico: isServ,
      ambiente: "",
      estoqueFisico: Number(prod.Estoque || 0),
      imagemUrl: imgUrl,
    };

    const existsIndex = currentProp.itens.findIndex(i => i.codpro === prod.CodPro);
    let updatedItens = [...currentProp.itens];

    if (existsIndex >= 0) {
      updatedItens[existsIndex].qtd += quantity;
    } else {
      updatedItens.push(newItem);
    }

    const sums = recalculateSums(updatedItens, currentProp.descontoPercentual, currentProp.tipoPreco);
    setCurrentProp(prev => ({ ...prev, ...sums }));

    showToast(`Adicionado ${quantity}x de "${newItem.nome}" com sucesso.`);
  };

  const handleRemoveItem = (index: number) => {
    const updated = currentProp.itens.filter((_, idx) => idx !== index);
    const sums = recalculateSums(updated, currentProp.descontoPercentual, currentProp.tipoPreco);
    setCurrentProp(prev => ({ ...prev, ...sums }));
  };

  const handleUpdateItemField = (index: number, field: keyof PropostaItem, value: any) => {
    const updated = [...currentProp.itens];
    (updated[index] as any)[field] = value;
    if (field === "qtd" || field === "precoUnitario") {
      const sums = recalculateSums(updated, currentProp.descontoPercentual, currentProp.tipoPreco);
      setCurrentProp(prev => ({ ...prev, ...sums }));
    } else {
      setCurrentProp(prev => ({ ...prev, itens: updated }));
    }
  };

  const handleOpenEditor = async (id?: number) => {
    if (id) {
      try {
        setLoading(true);
        const res = await fetch(`/api/propostas/${id}`);
        if (!res.ok) throw new Error("Erro ao consultar proposta.");
        const data = await res.json();

        setCurrentProp({
          id: data.id,
          pedido: data.pedido,
          clienteId: data.clienteId || "",
          clienteNome: data.clienteNome || "",
          data: data.data || "",
          validade: data.validade || "",
          valorProdutos: data.valorProdutos || 0,
          valorServicos: data.valorServicos || 0,
          subtotal: data.subtotal || 0,
          valorTotal: data.valorTotal || 0,
          descontoPercentual: data.subtotal > 0 ? Math.round(((data.subtotal - data.valorTotal) / data.subtotal) * 100) : 0,
          status: data.status || "Pendente",
          tipo: data.tipo || "Proposta",
          naturezaOperacao: data.naturezaOperacao || "VENDA",
          observacao: data.observacao || "",
          condicaoPagamento: data.condicaoPagamento || "BOLETO",
          tipoPreco: data.tipoPreco || "1",
          codEmp: data.codEmp || 1,
          modalidadeFrete: data.modalidadeFrete || "0",
          moeda: data.moeda || "R$",
          dadosAdicionais: data.dadosAdicionais || "",
          observacaoCliente: data.observacaoCliente || "",
          prazoEntrega: data.prazoEntrega || "",
          dataAprovacao: data.dataAprovacao || "",
          itens: data.itens ? data.itens.map((i: any) => ({
            ...i,
            ambiente: i.ambiente || "",
            estoqueFisico: i.estoqueFisico || 0,
            imagemUrl: i.imagemUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(i.nome || "P")}&background=0F1420&color=10B981&size=64&font-size=0.4&rounded=true`
          })) : [],
        });
        setView("editor");
      } catch (err: any) {
        showToast(err.message || "Erro ao abrir orçamento.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      let defaultCodEmp = companies[0]?.CodEmp || 1;
      const saved = localStorage.getItem("active-company");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            defaultCodEmp = parsed.id;
          }
        } catch (e) {
          console.error(e);
        }
      }

      setCurrentProp({
        clienteId: "",
        clienteNome: "",
        data: new Date().toISOString().split("T")[0],
        validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        valorProdutos: 0,
        valorServicos: 0,
        subtotal: 0,
        valorTotal: 0,
        descontoPercentual: 0,
        status: "Pendente",
        tipo: "Proposta",
        naturezaOperacao: "VENDA",
        observacao: "",
        condicaoPagamento: "BOLETO",
        tipoPreco: "1",
        codEmp: defaultCodEmp,
        modalidadeFrete: "0",
        moeda: "R$",
        dadosAdicionais: "",
        observacaoCliente: "",
        prazoEntrega: "",
        dataAprovacao: "",
        itens: [],
      });
      setView("editor");
    }
  };

  const handleSaveProposal = async () => {
    if (!currentProp.clienteId) {
      showToast("Por favor, selecione um Cliente válido para a proposta.", "error");
      return;
    }

    if (currentProp.itens.length === 0) {
      showToast("Não é possível salvar um orçamento sem nenhum produto ou serviço.", "error");
      return;
    }

    try {
      setSaving(true);
      const isEdit = !!currentProp.id;
      const url = isEdit ? `/api/propostas/${currentProp.id}` : "/api/propostas";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProp),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Falha na comunicação.");
      }

      showToast(isEdit ? "Proposta alterada com sucesso!" : "Proposta gravada com sucesso no SQL Server!");
      setView("list");
      fetchPropostas();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Erro ao salvar proposta comercial.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleApproveProposal = async () => {
    if (!currentProp.id) {
      showToast("Salve a proposta antes de aprová-la.", "error");
      return;
    }

    if (window.confirm("Confirmar fechamento? Isso gerará o faturamento comercial da Proposta, convertendo-a em Pedido de Venda e executando a baixa física do estoque das filiais. Prosseguir?")) {
      try {
        setApproving(true);
        const res = await fetch(`/api/propostas/${currentProp.id}/aprovar`, {
          method: "POST",
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Falha na transação.");
        }

        showToast("Proposta Aprovada e Faturada! Estoque atualizado no SQL Server.", "success");
        setView("list");
        fetchPropostas();
      } catch (err: any) {
        console.error(err);
        showToast(err.message || "Erro ao aprovar proposta.", "error");
      } finally {
        setApproving(false);
      }
    }
  };

  const totalProspectado = propostas.reduce((sum, p) => sum + Number(p.valorTotal), 0);
  const aprovadasVal = propostas.filter(p => p.status === "Aprovada").reduce((sum, p) => sum + Number(p.valorTotal), 0);
  const aprovadasCount = propostas.filter(p => p.status === "Aprovada").length;
  const analiseVal = propostas.filter(p => p.status === "Em análise" || p.status === "Pendente").reduce((sum, p) => sum + Number(p.valorTotal), 0);
  const analiseCount = propostas.filter(p => p.status === "Em análise" || p.status === "Pendente").length;

  const filteredProps = propostas.filter(
    (p) =>
      p.clienteNome.toLowerCase().includes(search.toLowerCase()) ||
      String(p.pedido).includes(search)
  );

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 pr-2 text-slate-100">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-2xl transition-all duration-300 animate-slide-in ${notification.type === "success"
              ? "bg-[#064e3b]/95 border-emerald-500 text-emerald-200"
              : notification.type === "error"
                ? "bg-[#7f1d1d]/95 border-red-500 text-red-200"
                : "bg-[#1e3a8a]/95 border-blue-500 text-blue-200"
            }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}

      {view === "list" ? (
        <>
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
                <FileText className="h-6 w-6 text-emerald-400" /> Prospecção & Propostas
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Elabore, gerencie e acompanhe a listagem de propostas comerciais e orçamentos ativos no banco de dados.
              </p>
            </div>

            <Button
              onClick={() => handleOpenEditor()}
              className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer border-none"
            >
              <Plus className="h-4 w-4" /> Nova Proposta
            </Button>
          </div>

          {/* Metrics section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-[#121826]/75 border border-border/60 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Ganhos / Aprovados</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{formatCurrency(aprovadasVal)}</h3>
              <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">
                {aprovadasCount} proposta(s) fechada(s)
              </span>
            </Card>

            <Card className="p-4 bg-[#121826]/75 border border-border/60 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Em Negociação</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{formatCurrency(analiseVal)}</h3>
              <span className="text-[9px] text-blue-400 font-semibold mt-1 block">
                {analiseCount} proposta(s) aguardando retorno
              </span>
            </Card>

            <Card className="p-4 bg-[#121826]/75 border border-border/60 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-rose-950/45 text-rose-400 flex items-center justify-center border border-rose-500/10">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Perdidos / Recusados</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{formatCurrency(0)}</h3>
              <span className="text-[9px] text-rose-400 font-semibold mt-1 block">
                Nenhuma recusa recente
              </span>
            </Card>

            <Card className="p-4 bg-[#121826]/75 border border-border/60 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-slate-900 border border-border text-slate-400 flex items-center justify-center">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Prospectado</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{formatCurrency(totalProspectado)}</h3>
              <span className="text-[9px] text-slate-300 font-semibold mt-1 block">
                {propostas.length} propostas totais
              </span>
            </Card>
          </div>

          {/* Proposals List Card */}
          <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E131F]/30">
              <div>
                <CardTitle className="text-sm font-bold text-slate-200">Painel de Orçamentos Comerciais</CardTitle>
                <p className="text-[10px] text-muted-foreground">Todos os orçamentos do tipo Proposta gravados no SQL Server.</p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Filtrar por nº proposta ou cliente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                <span className="text-xs font-semibold text-muted-foreground">Carregando propostas do SQL Server...</span>
              </div>
            ) : filteredProps.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
                Nenhum orçamento correspondente encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-[#0E131F]/50">
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-6">Nº Orçamento</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente / Razão</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Produtos</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Serviços</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Geral</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Emissão</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vencimento</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="p-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-6 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-xs">
                    {filteredProps.map((p) => (
                      <tr key={p.id} className="hover:bg-secondary/15 transition-colors text-xs">
                        <td className="p-3.5 pl-6 font-mono font-bold text-emerald-400">PROP-{p.pedido}</td>
                        <td className="p-3.5 text-slate-200 font-semibold">{p.clienteNome}</td>
                        <td className="p-3.5 font-bold text-slate-400">{formatCurrency(p.valorProdutos)}</td>
                        <td className="p-3.5 font-bold text-slate-400">{formatCurrency(p.valorServicos)}</td>
                        <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(p.valorTotal)}</td>
                        <td className="p-3.5 text-muted-foreground font-medium">{p.data}</td>
                        <td className="p-3.5 text-muted-foreground font-medium">{p.validade}</td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              p.status === "Aprovada" ? "success" :
                                p.status === "Em análise" ? "info" : "warning"
                            }
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 pr-6 text-right">
                          <Button
                            onClick={() => handleOpenEditor(p.pedido)}
                            variant="ghost"
                            size="sm"
                            className="h-7 text-emerald-400 flex items-center justify-end gap-1 font-semibold ml-auto hover:bg-[#064e3b]/25 cursor-pointer border-none"
                          >
                            Editar <ArrowUpRight className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      ) : (
        /* PROPOSAL EDITOR FORM VIEW */
        <div className="space-y-6 animate-slide-in pb-12">
          {/* Header Editor bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setView("list")}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-border hover:bg-secondary/40 text-slate-300 cursor-pointer shadow-sm transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
                  {currentProp.id ? `Orçamento: PROP-${currentProp.pedido}` : "Nova Proposta Comercial"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Preencha os dados abaixo para gerar um orçamento ou pedido de venda profissional.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentProp.id && currentProp.status !== "Aprovada" && (
                <Button
                  onClick={handleApproveProposal}
                  disabled={approving}
                  className="text-xs font-bold h-9 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center gap-1.5 border-none cursor-pointer shadow-lg shadow-cyan-900/20 rounded-xl transition-all"
                >
                  {approving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Aprovar & Faturar
                </Button>
              )}

              <Button
                onClick={handleSaveProposal}
                disabled={saving}
                className="text-xs font-bold h-9 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-1.5 border-none cursor-pointer shadow-lg shadow-emerald-900/20 rounded-xl transition-all"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Gravar Proposta
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* TOP SECTION - Core Info & Items (Full Width) */}
              <div className="xl:col-span-12 space-y-6">

                {/* Client & Core Info Card */}
                <Card className="bg-[#0A0D18]/40 border border-border/40 shadow-2xl overflow-hidden backdrop-blur-xl rounded-2xl">
                  <div className="p-4 border-b border-border/10 bg-gradient-to-r from-indigo-900/20 to-transparent flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
                      <User className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200">Cliente & Identificação</h3>
                  </div>

                  <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-4">
                      <ClientSearchInput
                        initialName={currentProp.clienteNome}
                        onSelectClient={(cli) => {
                          setCurrentProp(prev => ({
                            ...prev,
                            clienteId: cli.CodCli,
                            clienteNome: cli.Cliente || cli.Razao,
                          }));
                        }}
                        onClear={() => {
                          setCurrentProp(prev => ({ ...prev, clienteId: "", clienteNome: "" }));
                        }}
                      />
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo do Documento</label>
                      <select
                        value={currentProp.tipo}
                        onChange={(e) => setCurrentProp({ ...currentProp, tipo: e.target.value })}
                        className="h-9 px-3 rounded-xl bg-[#0F1420] border border-border/60 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500/50 hover:border-border transition-colors cursor-pointer"
                      >
                        <option value="Proposta">Proposta (Orçamento)</option>
                        <option value="Pedido">Pedido de Venda</option>
                        <option value="Garantia">Garantia</option>
                        <option value="Insumos">Insumos Internos</option>
                        <option value="CartaCredito">Carta Crédito</option>
                      </select>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nº Pedido</label>
                      <input
                        type="text"
                        value={currentProp.pedido || ""}
                        readOnly
                        className="h-9 px-3 rounded-xl bg-[#121826]/60 border border-border/20 text-xs font-bold text-slate-400 outline-none cursor-not-allowed"
                        placeholder="Automático"
                      />
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Emissão</label>
                      <input
                        type="date"
                        value={currentProp.data}
                        onChange={e => setCurrentProp({ ...currentProp, data: e.target.value })}
                        className="h-9 px-3 rounded-xl bg-[#0F1420] border border-border/60 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500/50 hover:border-border transition-colors cursor-text"
                      />
                    </div>
                  </div>
                </Card>

                {/* Products & Items Card */}
                <Card className="bg-[#0A0D18]/40 border border-border/40 shadow-2xl overflow-hidden backdrop-blur-xl rounded-2xl">
                  <div className="p-4 border-b border-border/10 bg-gradient-to-r from-blue-900/20 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                        <Layers className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-200">Itens da Proposta</h3>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 font-bold px-3">
                      {currentProp.itens.length} {currentProp.itens.length === 1 ? 'Item' : 'Itens'}
                    </Badge>
                  </div>

                  <div className="p-4 bg-[#121826]/40 border-b border-border/10">
                    <ProductSearchPanel
                      tipoPreco={currentProp.tipoPreco}
                      onAddItem={handleAddItemFromPanel}
                    />
                  </div>

                  <div className="overflow-x-auto">
                    {currentProp.itens.length === 0 ? (
                      <div className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center mb-3 text-muted-foreground">
                          <Search className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-semibold text-slate-300">Nenhum item adicionado</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">Utilize a busca acima para encontrar produtos ou serviços e adicioná-los à sua proposta.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border/20 bg-[#070A12]/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <th className="p-3 pl-4">Ação</th>
                            <th className="p-3 w-12 text-center">Foto</th>
                            <th className="p-3">Item / Descrição</th>
                            <th className="p-3">Ambiente</th>
                            <th className="p-3 text-center">Quant.</th>
                            <th className="p-3 text-right">Preço Un.</th>
                            <th className="p-3 text-right pr-4">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10 text-xs">
                          {currentProp.itens.map((item, idx) => (
                            <tr key={idx} className="hover:bg-blue-500/5 group transition-colors">
                              <td className="p-3 pl-4 align-middle">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 rounded-lg border border-transparent hover:border-red-500/20 flex items-center justify-center cursor-pointer transition-all"
                                  title="Remover item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                              <td className="p-3 align-middle text-center">
                                <div className="h-9 w-9 rounded-lg overflow-hidden border border-border/20 bg-[#0F1420] flex items-center justify-center shadow-sm inline-flex">
                                  {item.imagemUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={item.imagemUrl} alt="Foto" className="h-full w-full object-cover" />
                                  ) : (
                                    <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                                  )}
                                </div>
                              </td>
                              <td className="p-3 align-middle">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-slate-200 line-clamp-1">{item.nome}</span>
                                  <div className="flex items-center gap-2 text-[9px]">
                                    <span className="font-mono text-slate-500">Cód: {item.codpro}</span>
                                    {item.referencia && <span className="font-mono text-slate-500">Ref: {item.referencia}</span>}
                                    <span className={item.estoqueFisico > 0 ? "text-emerald-500/80 font-bold" : "text-amber-500/80 font-bold"}>
                                      Est: {item.estoqueFisico} {item.unidade}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 align-middle">
                                <input
                                  type="text"
                                  value={item.ambiente}
                                  onChange={(e) => handleUpdateItemField(idx, "ambiente", e.target.value)}
                                  placeholder="Ex: Sala..."
                                  className="w-full min-w-[80px] h-8 px-2 rounded-lg bg-[#0F1420]/50 border border-transparent hover:border-border/60 focus:border-blue-500/50 focus:bg-[#0F1420] text-xs text-slate-300 outline-none transition-all"
                                />
                              </td>
                              <td className="p-3 align-middle text-center">
                                <input
                                  type="number"
                                  value={item.qtd}
                                  onChange={(e) => handleUpdateItemField(idx, "qtd", Math.max(1, Number(e.target.value)))}
                                  className="w-16 h-8 px-1 rounded-lg bg-[#0F1420]/50 border border-transparent hover:border-border/60 focus:border-blue-500/50 focus:bg-[#0F1420] text-center text-xs font-bold text-slate-200 outline-none transition-all mx-auto"
                                />
                              </td>
                              <td className="p-3 align-middle text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <span className="text-[9px] text-muted-foreground">R$</span>
                                  <input
                                    type="number"
                                    value={item.precoUnitario}
                                    step="0.01"
                                    onChange={(e) => handleUpdateItemField(idx, "precoUnitario", Math.max(0, Number(e.target.value)))}
                                    className="w-20 h-8 px-1.5 rounded-lg bg-[#0F1420]/50 border border-transparent hover:border-border/60 focus:border-blue-500/50 focus:bg-[#0F1420] text-right text-xs font-bold text-slate-200 outline-none transition-all"
                                  />
                                </div>
                              </td>
                              <td className="p-3 pr-4 align-middle text-right font-bold text-emerald-400 bg-gradient-to-r from-transparent to-emerald-900/5">
                                {formatCurrency(item.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </Card>

              </div>
            </div>

            {/* ERP TABS PANEL - MODERNIZED */}
            <Card className="bg-[#0A0D18]/80 border border-border/40 shadow-2xl overflow-hidden backdrop-blur-xl rounded-2xl mb-32">
              <div className="flex overflow-x-auto border-b border-border/20 bg-[#070A12]/80 scrollbar-hide">
                {[
                  "Textos", "Totalizadores", "Tributos", "Transportadora",
                  "Histórico", "Produção", "Parâmetros", "Fechamento", "Estoquista", "ECommerce"
                ].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab
                        ? "text-emerald-400 border-emerald-500 bg-[#121826]/60"
                        : "text-muted-foreground border-transparent hover:text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT AREAS */}
              <div className="p-5 min-h-[250px] bg-gradient-to-b from-[#121826]/30 to-transparent">

                {/* 1. TEXTOS */}
                {activeTab === "Textos" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observações Internas</label>
                      <textarea
                        value={currentProp.observacao}
                        onChange={(e) => setCurrentProp({ ...currentProp, observacao: e.target.value })}
                        className="w-full h-32 p-3 rounded-xl bg-[#0F1420] border border-border/60 text-xs text-slate-200 outline-none focus:border-emerald-500/50 resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observações para o Cliente</label>
                      <textarea
                        value={currentProp.observacaoCliente}
                        onChange={(e) => setCurrentProp({ ...currentProp, observacaoCliente: e.target.value })}
                        className="w-full h-32 p-3 rounded-xl bg-[#0F1420] border border-border/60 text-xs text-slate-200 outline-none focus:border-emerald-500/50 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. TOTALIZADORES */}
                {activeTab === "Totalizadores" && (
                  <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-2">
                    {/* Left Grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        "B.C. ICMS", "ICMS", "B.C. ICMS ST", "ICMS ST", "Frete NF",
                        "ICMS/Frete", "Frete IPI", "Frete CTRC", "CTRC ICMS %", "ICMS/CTRC",
                        "Seguro", "Desconto", "Despesas", "Isentas", "Outras",
                        "IPI", "Alq Inter %", "Nº Venda", "Finalização", "Lanc."
                      ].map(field => (
                        <div key={field} className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase truncate">{field}</label>
                          <input
                            readOnly
                            className="h-8 px-2 rounded-lg bg-[#0F1420]/60 border border-border/30 text-xs text-slate-400 outline-none cursor-not-allowed"
                            value={field === "Lanc." ? "78464" : ""}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Right Totals */}
                    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3 p-4 bg-[#0A0D18]/80 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Produtos</label>
                        <input readOnly value={formatCurrency(currentProp.valorProdutos)} className="h-8 px-2 rounded-lg bg-secondary/20 border border-border/40 text-xs font-bold text-right text-slate-300 outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Desconto (%)</label>
                        <input
                          type="number"
                          value={currentProp.descontoPercentual}
                          onChange={(e) => handleDescontoChange(Number(e.target.value))}
                          className="h-8 px-2 rounded-lg bg-[#0F1420] border border-rose-500/30 text-xs font-bold text-right text-rose-400 focus:border-rose-500 outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Subtotal</label>
                        <input readOnly value={formatCurrency(currentProp.subtotal)} className="h-8 px-2 rounded-lg bg-secondary/20 border border-border/40 text-xs font-bold text-right text-slate-300 outline-none" />
                      </div>
                      <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-border/30">
                        <label className="text-[11px] font-black text-emerald-400 uppercase">Total</label>
                        <input readOnly value={formatCurrency(currentProp.valorTotal)} className="h-10 px-2 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-lg font-black text-right text-emerald-400 outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TRIBUTOS */}
                {activeTab === "Tributos" && (
                  <div className="flex gap-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-3 gap-4">
                      {["ICMS Int.%", "FCP %", "ICMS Deson.", "FCP Dest", "ICMS UF Dest", "ICMS UF Rem."].map(field => (
                        <div key={field} className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase">{field}</label>
                          <input className="w-24 h-8 px-2 rounded-lg bg-[#0F1420]/60 border border-border/30 text-xs" readOnly />
                        </div>
                      ))}
                    </div>
                    <div className="border-l border-border/40 pl-8 grid grid-cols-2 gap-4">
                      {["B.C. PIS/Cofins", "PIS", "COFINS"].map((field, idx) => (
                        <div key={field} className={`flex flex-col gap-1.5 ${idx === 0 ? 'col-span-2' : ''}`}>
                          <label className="text-[9px] font-bold text-muted-foreground uppercase">{field}</label>
                          <input className="w-24 h-8 px-2 rounded-lg bg-[#0F1420]/60 border border-emerald-500/20 text-xs" readOnly />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TRANSPORTADORA */}
                {activeTab === "Transportadora" && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Transportadora</label>
                        <div className="flex gap-2">
                          <input className="w-16 h-8 px-2 rounded-lg bg-[#0F1420] border border-border/50 text-xs" placeholder="Cód" />
                          <input className="flex-1 h-8 px-2 rounded-lg bg-[#0F1420] border border-border/50 text-xs" placeholder="Nome da Transportadora..." />
                          <Button size="sm" variant="outline" className="h-8 px-3 border-border/50 bg-[#121826] hover:bg-secondary/40">
                            <Truck className="h-4 w-4 mr-2 text-blue-400" /> Buscar
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Qtd</label>
                          <input className="w-16 h-8 px-2 rounded-lg bg-[#0F1420]/60 border border-border/30 text-xs" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Espécie</label>
                          <select className="w-24 h-8 px-2 rounded-lg bg-[#0F1420]/60 border border-border/30 text-xs">
                            <option>Caixa</option>
                            <option>Volume</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Peso Lqd</label>
                          <input className="w-20 h-8 px-2 rounded-lg bg-[#0F1420]/60 border border-border/30 text-xs" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Peso Brt</label>
                          <input className="w-20 h-8 px-2 rounded-lg bg-[#0F1420]/60 border border-border/30 text-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="h-32 border border-border/30 rounded-xl bg-[#070A12]/50 flex items-center justify-center text-xs text-muted-foreground">
                      Grid de Cálculos de Frete (TRANSPORTADORA, UF, MUNICÍPIO, PREÇO, TOTAL)
                    </div>
                  </div>
                )}

                {/* 5. HISTORICO */}
                {activeTab === "Histórico" && (
                  <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <textarea className="w-1/3 h-40 p-3 rounded-xl bg-[#0F1420] border border-border/60 text-xs resize-none" placeholder="Histórico de negociação..." />
                    <div className="flex flex-col justify-center gap-2">
                      {["PREÇO ALTO", "QUALIDADE", "ENTREGA", "PRAZO", "OUTROS"].map(cb => (
                        <label key={cb} className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase cursor-pointer hover:text-emerald-400">
                          <input type="checkbox" className="accent-emerald-500 w-3 h-3" /> {cb}
                        </label>
                      ))}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="bg-blue-900/30 text-blue-400 text-[10px] font-bold uppercase text-center py-1 rounded">ESTORNO</div>
                      <div className="flex gap-2 text-[9px] font-bold text-muted-foreground uppercase">
                        <div className="w-24">Data</div>
                        <div className="w-16">Código</div>
                        <div className="flex-1">Usuário</div>
                        <div className="w-24">Situação</div>
                      </div>
                      <div className="flex gap-2">
                        <input className="w-24 h-7 px-2 rounded bg-[#0F1420]/60 border border-border/30 text-xs" readOnly />
                        <input className="w-16 h-7 px-2 rounded bg-[#0F1420]/60 border border-border/30 text-xs" readOnly />
                        <input className="flex-1 h-7 px-2 rounded bg-[#0F1420]/60 border border-border/30 text-xs" readOnly />
                        <input className="w-24 h-7 px-2 rounded bg-[#0F1420]/60 border border-border/30 text-xs bg-blue-900/20" readOnly />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. ESTOQUISTA */}
                {activeTab === "Estoquista" && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-end gap-4">
                      <div className="flex flex-col gap-1.5 flex-1 max-w-xs">
                        <label className="text-[10px] font-bold text-blue-400 uppercase">Separado por:</label>
                        <div className="flex gap-2">
                          <input className="w-16 h-8 px-2 rounded-lg bg-[#0F1420] border border-border/50 text-xs" />
                          <input className="flex-1 h-8 px-2 rounded-lg bg-[#0F1420] border border-border/50 text-xs bg-yellow-500/10 text-yellow-200" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 w-48">
                        <label className="text-[10px] font-bold text-blue-400 uppercase">Rota:</label>
                        <select className="w-full h-8 px-2 rounded-lg bg-[#0F1420] border border-border/50 text-xs">
                          <option>Selecione Rota...</option>
                        </select>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 border-border/50 bg-[#121826] hover:bg-secondary/40">
                        <Globe className="h-3.5 w-3.5 mr-2 text-blue-500" /> Carga On Line
                      </Button>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex flex-col gap-1.5 w-32">
                        <label className="text-[10px] font-bold text-blue-400 uppercase">Depósito</label>
                        <select className="w-full h-8 px-2 rounded-lg bg-[#0F1420] border border-border/50 text-xs">
                          <option>Geral</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5 w-48">
                        <label className="text-[10px] font-bold text-blue-400 uppercase">CNPJ Terceiro</label>
                        <input className="w-full h-8 px-2 rounded-lg bg-[#0F1420] border border-border/50 text-xs" />
                      </div>
                    </div>
                  </div>
                )}

                {/* OTHER PLACEHOLDERS */}
                {["Produção", "Parâmetros", "Fechamento", "ECommerce"].includes(activeTab) && (
                  <div className="flex items-center justify-center h-40 border border-dashed border-border/40 rounded-xl text-xs text-muted-foreground animate-in fade-in">
                    <Settings2 className="h-4 w-4 mr-2" /> Aba {activeTab} em desenvolvimento...
                  </div>
                )}

              </div>
            </Card>
          </div>

          {/* FIXED BOTTOM ACTION TOOLBAR */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#070A12]/95 backdrop-blur-xl border-t border-border/30 p-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-2">
              {/* TOP ROW */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:text-slate-200">
                  <FileText className="h-3 w-3 mr-1.5 text-blue-400" /> Condições
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:text-slate-200">
                  <FileText className="h-3 w-3 mr-1.5 text-blue-400" /> Pedido
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:text-slate-200">
                  <Mail className="h-3 w-3 mr-1.5 text-blue-400" /> E-Mail
                </Button>

                {/* APROVAR BUTTON */}
                <Button
                  onClick={handleApproveProposal}
                  disabled={approving || currentProp.status === "Aprovada"}
                  className="h-8 px-5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-lg shadow-cyan-900/20"
                >
                  {approving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Check className="h-3 w-3 mr-1.5" />} Aprovar
                </Button>

                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:text-slate-200">
                  <FileText className="h-3 w-3 mr-1.5 text-blue-400" /> Requisição
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:text-slate-200">
                  <Search className="h-3 w-3 mr-1.5 text-emerald-400" /> Filtrar
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:text-slate-200">
                  <FileText className="h-3 w-3 mr-1.5 text-amber-400" /> Lista de Preços
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:text-slate-200">
                  <FileText className="h-3 w-3 mr-1.5 text-amber-400" /> Docs
                </Button>

                {/* GRAVAR BUTTON */}
                <Button
                  onClick={handleSaveProposal}
                  disabled={saving}
                  className="h-8 px-5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 border-none shadow-lg shadow-emerald-900/20"
                >
                  {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Save className="h-3 w-3 mr-1.5" />} Gravar
                </Button>

                <Button variant="outline" size="sm" onClick={() => setView("list")} className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300">
                  <X className="h-3 w-3 mr-1.5" /> Sair
                </Button>
              </div>

              {/* BOTTOM ROW */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider bg-transparent border-border/30 hover:bg-secondary/30 text-muted-foreground hover:text-slate-300">
                  <Truck className="h-3 w-3 mr-1" /> Entrega Parcial
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider bg-transparent border-border/30 hover:bg-secondary/30 text-muted-foreground hover:text-slate-300">
                  <ShoppingCart className="h-3 w-3 mr-1" /> Pré-Venda
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider bg-transparent border-border/30 hover:bg-secondary/30 text-muted-foreground hover:text-slate-300">
                  <CheckCircle className="h-3 w-3 mr-1 text-emerald-500/70" /> Finalizar
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider bg-transparent border-border/30 hover:bg-secondary/30 text-muted-foreground hover:text-slate-300">
                  <RotateCcw className="h-3 w-3 mr-1 text-rose-400/70" /> Devolução
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider bg-transparent border-border/30 hover:bg-secondary/30 text-muted-foreground hover:text-slate-300">
                  <FileText className="h-3 w-3 mr-1" /> S.Remessa
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider bg-transparent border-border/30 hover:bg-secondary/30 text-muted-foreground hover:text-slate-300">
                  <User className="h-3 w-3 mr-1 text-indigo-400/70" /> Cadastro
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider bg-transparent border-border/30 hover:bg-secondary/30 text-muted-foreground hover:text-slate-300">
                  <Key className="h-3 w-3 mr-1 text-amber-400/70" /> Autorizar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
