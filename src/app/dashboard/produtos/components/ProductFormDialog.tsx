"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Tag,
  DollarSign,
  Scale,
  Percent,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type ActiveTab = "gerais" | "comercial" | "logistica" | "fiscal" | "extras";

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: any | null; // se for null, estamos em modo criação
  onSuccess: () => void;
}

const initialFormData = {
  nome: "",
  codigo: "",
  preco: "0",
  estoque: "0",
  categoria: "Acessórios",
  descricao: "",
  abreviado: "",
  marca: "",
  fabricante: "",
  codigoBarras: "",
  unidade: "UN",
  inativo: false,
  
  preco2: "0",
  preco3: "0",
  preco4: "0",
  custo: "0",
  custoInformado: "0",
  custoTabela: "0",
  medio: "0",
  ultimo: "0",
  markupTabela: "0",
  descontoMaximo: "0",
  comissao: "0",
  
  minimo: "0",
  estoqueMaximo: "0",
  localizacao: "",
  peso: "0",
  pesoLiquido: "0",
  largura: "0",
  altura: "0",
  comprimento: "0",
  area: "0",
  areaM3: "0",
  
  classificacaoFiscal: "",
  csosn: "",
  cfopVenda: "",
  cfopCompra: "",
  ipi: "0",
  icms: "0",
  frete: "0",
  
  obs: "",
  aplicacao: "",
  caracteristicas: "",
  balancoAuditoria: "0",
  diasGarantia: "0",
  eCommerce: false,
};

export function ProductFormDialog({
  isOpen,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gerais");
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!product;

  // Sincroniza dados com o formulário quando o modal abre ou altera
  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      setActiveTab("gerais");
      
      if (product) {
        setFormData({
          nome: product.nome || "",
          codigo: product.codigo || "",
          preco: product.preco?.toString() || "0",
          estoque: product.estoque?.toString() || "0",
          categoria: product.categoria || "Acessórios",
          descricao: product.descricao || "",
          abreviado: product.abreviado || "",
          marca: product.marca || "",
          fabricante: product.fabricante || "",
          codigoBarras: product.codigoBarras || "",
          unidade: product.unidade || "UN",
          inativo: product.inativo || false,
          
          preco2: product.preco2?.toString() || "0",
          preco3: product.preco3?.toString() || "0",
          preco4: product.preco4?.toString() || "0",
          custo: product.custo?.toString() || "0",
          custoInformado: product.custoInformado?.toString() || "0",
          custoTabela: product.custoTabela?.toString() || "0",
          medio: product.medio?.toString() || "0",
          ultimo: product.ultimo?.toString() || "0",
          markupTabela: product.markupTabela?.toString() || "0",
          descontoMaximo: product.descontoMaximo?.toString() || "0",
          comissao: product.comissao?.toString() || "0",
          
          minimo: product.minimo?.toString() || "0",
          estoqueMaximo: product.estoqueMaximo?.toString() || "0",
          localizacao: product.localizacao || "",
          peso: product.peso?.toString() || "0",
          pesoLiquido: product.pesoLiquido?.toString() || "0",
          largura: product.largura?.toString() || "0",
          altura: product.altura?.toString() || "0",
          comprimento: product.comprimento?.toString() || "0",
          area: product.area?.toString() || "0",
          areaM3: product.areaM3?.toString() || "0",
          
          classificacaoFiscal: product.classificacaoFiscal || "",
          csosn: product.csosn || "",
          cfopVenda: product.cfopVenda || "",
          cfopCompra: product.cfopCompra || "",
          ipi: product.ipi?.toString() || "0",
          icms: product.icms?.toString() || "0",
          frete: product.frete?.toString() || "0",
          
          obs: product.obs || "",
          aplicacao: product.aplicacao || "",
          caracteristicas: product.caracteristicas || "",
          balancoAuditoria: product.balancoAuditoria?.toString() || "0",
          diasGarantia: product.diasGarantia?.toString() || "0",
          eCommerce: product.eCommerce || false,
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validações básicas obrigatórias no frontend
    if (!formData.nome.trim() || !formData.codigo.trim()) {
      setFormError("Por favor, preencha o Nome e o Código (SKU) do produto na aba 'Dados Gerais'.");
      setActiveTab("gerais");
      return;
    }

    setIsLoading(true);

    try {
      const url = "/api/produtos";
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        id: product?.id ? product.id.toString() : undefined,
        preco: parseFloat(formData.preco || "0"),
        estoque: parseFloat(formData.estoque || "0"),
        preco2: parseFloat(formData.preco2 || "0"),
        preco3: parseFloat(formData.preco3 || "0"),
        preco4: parseFloat(formData.preco4 || "0"),
        custo: parseFloat(formData.custo || "0"),
        custoInformado: parseFloat(formData.custoInformado || "0"),
        custoTabela: parseFloat(formData.custoTabela || "0"),
        medio: parseFloat(formData.medio || "0"),
        ultimo: parseFloat(formData.ultimo || "0"),
        markupTabela: parseFloat(formData.markupTabela || "0"),
        descontoMaximo: parseFloat(formData.descontoMaximo || "0"),
        comissao: parseFloat(formData.comissao || "0"),
        minimo: parseFloat(formData.minimo || "0"),
        estoqueMaximo: parseFloat(formData.estoqueMaximo || "0"),
        peso: parseFloat(formData.peso || "0"),
        pesoLiquido: parseFloat(formData.pesoLiquido || "0"),
        largura: parseFloat(formData.largura || "0"),
        altura: parseFloat(formData.altura || "0"),
        comprimento: parseFloat(formData.comprimento || "0"),
        area: parseFloat(formData.area || "0"),
        areaM3: parseFloat(formData.areaM3 || "0"),
        ipi: parseFloat(formData.ipi || "0"),
        icms: parseFloat(formData.icms || "0"),
        frete: parseFloat(formData.frete || "0"),
        balancoAuditoria: parseFloat(formData.balancoAuditoria || "0"),
        diasGarantia: parseInt(formData.diasGarantia || "0"),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onOpenChange(false);
        onSuccess();
      } else {
        setFormError(data.error || "Ocorreu um erro ao salvar o produto.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Erro de conexão com o banco de dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border/40 pb-4 text-left">
          <DialogTitle className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-400" />
            {isEditing ? "Modificar Cadastro de Produto" : "Novo Cadastro de Produto"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Insira as informações técnicas, comerciais, tributárias e logísticas na tabela `Produto`.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Error block */}
        {formError && (
          <div className="bg-rose-950/45 border border-rose-500/35 text-rose-400 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Tab Header Selectors */}
        <div className="flex border-b border-slate-800/80 gap-1 mt-2">
          {[
            { id: "gerais", label: "Dados Gerais", icon: Tag },
            { id: "comercial", label: "Preços & Custos", icon: DollarSign },
            { id: "logistica", label: "Estoque & Dimensões", icon: Scale },
            { id: "fiscal", label: "Fiscal / Tributação", icon: Percent },
            { id: "extras", label: "Observações & Extras", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                  : "border-transparent text-muted-foreground hover:text-slate-200"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          {/* TAB 1: DADOS GERAIS */}
          {activeTab === "gerais" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Código Comercial (SKU/Ref)*</label>
                  <Input
                    placeholder="Ex: PROD-1020"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Nome do Produto (Produto)*</label>
                  <Input
                    placeholder="Ex: Cabo HDMI Blindado 3m"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-bold text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Descrição Abreviada</label>
                  <Input
                    placeholder="Ex: CABO HDMI 3M"
                    value={formData.abreviado}
                    onChange={(e) => setFormData({ ...formData, abreviado: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Código de Barras (GTIN/EAN)</label>
                  <Input
                    placeholder="7890000000000"
                    value={formData.codigoBarras}
                    onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Unidade de Medida</label>
                  <Input
                    placeholder="UN, PC, KG, M"
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value.toUpperCase() })}
                    className="h-9.5 bg-[#0F1420] text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Marca</label>
                  <Input
                    placeholder="Ex: Sony, Intel..."
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Fabricante</label>
                  <Input
                    placeholder="Ex: Foxconn, Samsung..."
                    value={formData.fabricante}
                    onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Categoria do ERP</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full h-9.5 rounded-md border border-input bg-[#0F1420] text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer font-semibold px-3"
                  >
                    <option value="Acessórios">Acessórios</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Conectores">Conectores</option>
                    <option value="Sobressalentes">Sobressalentes</option>
                    <option value="Serviços">Serviços</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#0F1420] p-3 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  id="chk-inativo"
                  checked={formData.inativo}
                  onChange={(e) => setFormData({ ...formData, inativo: e.target.checked })}
                  className="h-4 w-4 text-emerald-500 focus:ring-0 focus:ring-offset-0 rounded bg-slate-900 border-slate-800 cursor-pointer"
                />
                <label htmlFor="chk-inativo" className="text-xs text-slate-300 font-bold select-none cursor-pointer">
                  Produto Inativo (Inviabiliza vendas e movimentações no estoque)
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PREÇOS & CUSTOS */}
          {activeTab === "comercial" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Preço de Custo (Custo)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.custo}
                      onChange={(e) => setFormData({ ...formData, custo: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Custo Informado</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.custoInformado}
                      onChange={(e) => setFormData({ ...formData, custoInformado: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Custo Tabela</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.custoTabela}
                      onChange={(e) => setFormData({ ...formData, custoTabela: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Custo Médio</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.medio}
                      onChange={(e) => setFormData({ ...formData, medio: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Preço de Venda 1 (Principal)*</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/70 text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold border-emerald-500/25 focus-visible:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Preço de Venda 2 (Atacado)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.preco2}
                      onChange={(e) => setFormData({ ...formData, preco2: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Preço de Venda 3 (Promo)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.preco3}
                      onChange={(e) => setFormData({ ...formData, preco3: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Preço de Venda 4 (Revenda)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.preco4}
                      onChange={(e) => setFormData({ ...formData, preco4: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Última Compra (Preço)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.ultimo}
                      onChange={(e) => setFormData({ ...formData, ultimo: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Markup de Tabela (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.markupTabela}
                    onChange={(e) => setFormData({ ...formData, markupTabela: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Desconto Máximo Perm. (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.descontoMaximo}
                    onChange={(e) => setFormData({ ...formData, descontoMaximo: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Alíquota de Comissão (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.comissao}
                    onChange={(e) => setFormData({ ...formData, comissao: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ESTOQUE & LOGÍSTICA */}
          {activeTab === "logistica" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Estoque Inicial / Atual*</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.estoque}
                    onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Estoque Mínimo</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.minimo}
                    onChange={(e) => setFormData({ ...formData, minimo: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Estoque Máximo</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.estoqueMaximo}
                    onChange={(e) => setFormData({ ...formData, estoqueMaximo: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Localização Almoxarifado</label>
                  <Input
                    placeholder="Ex: Corredor A, Prateleira 3"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Peso Bruto (KG)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Peso Líquido (KG)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.pesoLiquido}
                    onChange={(e) => setFormData({ ...formData, pesoLiquido: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Comprimento (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.comprimento}
                    onChange={(e) => setFormData({ ...formData, comprimento: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Largura (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.largura}
                    onChange={(e) => setFormData({ ...formData, largura: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Altura (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.altura}
                    onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Área M2</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Volume M3</label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={formData.areaM3}
                    onChange={(e) => setFormData({ ...formData, areaM3: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FISCAL / TRIBUTAÇÃO */}
          {activeTab === "fiscal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">NCM (Classificação Fiscal)</label>
                  <Input
                    placeholder="Ex: 8544.42.00"
                    value={formData.classificacaoFiscal}
                    onChange={(e) => setFormData({ ...formData, classificacaoFiscal: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">CSOSN / CST ICMS</label>
                  <Input
                    placeholder="Ex: 101, 102, 500"
                    value={formData.csosn}
                    onChange={(e) => setFormData({ ...formData, csosn: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">CFOP de Venda</label>
                  <Input
                    placeholder="Ex: 5102"
                    value={formData.cfopVenda}
                    onChange={(e) => setFormData({ ...formData, cfopVenda: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">CFOP de Compra</label>
                  <Input
                    placeholder="Ex: 1102"
                    value={formData.cfopCompra}
                    onChange={(e) => setFormData({ ...formData, cfopCompra: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Alíquota IPI (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.ipi}
                    onChange={(e) => setFormData({ ...formData, ipi: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Alíquota ICMS (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.icms}
                    onChange={(e) => setFormData({ ...formData, icms: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Alíquota Frete (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.frete}
                    onChange={(e) => setFormData({ ...formData, frete: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OBSERVAÇÕES & EXTRAS */}
          {activeTab === "extras" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Dias de Garantia</label>
                  <Input
                    type="number"
                    value={formData.diasGarantia}
                    onChange={(e) => setFormData({ ...formData, diasGarantia: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Balanço Auditoria</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.balancoAuditoria}
                    onChange={(e) => setFormData({ ...formData, balancoAuditoria: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 bg-[#0F1420] px-3 h-9.5 rounded-lg border border-slate-800 mt-5">
                  <input
                    type="checkbox"
                    id="chk-ecommerce"
                    checked={formData.eCommerce}
                    onChange={(e) => setFormData({ ...formData, eCommerce: e.target.checked })}
                    className="h-4 w-4 text-emerald-500 focus:ring-0 focus:ring-offset-0 rounded bg-slate-900 border-slate-800 cursor-pointer"
                  />
                  <label htmlFor="chk-ecommerce" className="text-xs text-slate-300 font-bold select-none cursor-pointer">
                    Exibir no E-Commerce
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Observações de Cadastro</label>
                  <textarea
                    placeholder="Observações administrativas internas..."
                    value={formData.obs}
                    onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                    rows={2}
                    className="w-full rounded-md border border-input px-3 py-2 text-xs shadow-sm bg-[#0F1420] focus:outline-none focus:ring-1 focus:ring-ring text-slate-200 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Características Técnicas</label>
                  <textarea
                    placeholder="Detalhes de componentes, materiais ou certificações..."
                    value={formData.caracteristicas}
                    onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-input px-3 py-2 text-xs shadow-sm bg-[#0F1420] focus:outline-none focus:ring-1 focus:ring-ring text-slate-200 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Aplicação do Produto</label>
                  <textarea
                    placeholder="Como e onde aplicar o produto, cenários de uso recomendados..."
                    value={formData.aplicacao}
                    onChange={(e) => setFormData({ ...formData, aplicacao: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-input px-3 py-2 text-xs shadow-sm bg-[#0F1420] focus:outline-none focus:ring-1 focus:ring-ring text-slate-200 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Actions */}
          <DialogFooter className="border-t border-slate-800/80 pt-4 gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="text-xs font-semibold cursor-pointer">
                Cancelar
              </Button>
            </DialogClose>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="text-xs font-semibold gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando no Banco...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {isEditing ? "Atualizar Produto" : "Registrar Produto"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
