"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Tag,
  DollarSign,
  Percent,
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

type ActiveTab = "gerais" | "financeiro" | "fiscal_extras";

interface ServiceFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: any | null; // se for null, estamos em modo criação
  onSuccess: () => void;
}

const initialFormData = {
  nome: "",
  codigo: "",
  preco: "0",
  estoque: "0", // Servico estoque sempre 0
  categoria: "Suporte Técnico",
  descricao: "",
  abreviado: "",
  marca: "",
  fabricante: "",
  codigoBarras: "",
  unidade: "HORA",
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
  
  classificacaoFiscal: "", // Usado como Código de Serviço Municipal
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

export function ServiceFormDialog({
  isOpen,
  onOpenChange,
  service,
  onSuccess,
}: ServiceFormDialogProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gerais");
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!service;

  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      setActiveTab("gerais");
      
      if (service) {
        setFormData({
          nome: service.nome || "",
          codigo: service.codigo || "",
          preco: service.preco?.toString() || "0",
          estoque: service.estoque?.toString() || "0",
          categoria: service.categoria || "Suporte Técnico",
          descricao: service.descricao || "",
          abreviado: service.abreviado || "",
          marca: service.marca || "",
          fabricante: service.fabricante || "",
          codigoBarras: service.codigoBarras || "",
          unidade: service.unidade || "HORA",
          inativo: service.inativo || false,
          
          preco2: service.preco2?.toString() || "0",
          preco3: service.preco3?.toString() || "0",
          preco4: service.preco4?.toString() || "0",
          custo: service.custo?.toString() || "0",
          custoInformado: service.custoInformado?.toString() || "0",
          custoTabela: service.custoTabela?.toString() || "0",
          medio: service.medio?.toString() || "0",
          ultimo: service.ultimo?.toString() || "0",
          markupTabela: service.markupTabela?.toString() || "0",
          descontoMaximo: service.descontoMaximo?.toString() || "0",
          comissao: service.comissao?.toString() || "0",
          
          minimo: service.minimo?.toString() || "0",
          estoqueMaximo: service.estoqueMaximo?.toString() || "0",
          localizacao: service.localizacao || "",
          peso: service.peso?.toString() || "0",
          pesoLiquido: service.pesoLiquido?.toString() || "0",
          largura: service.largura?.toString() || "0",
          altura: service.altura?.toString() || "0",
          comprimento: service.comprimento?.toString() || "0",
          area: service.area?.toString() || "0",
          areaM3: service.areaM3?.toString() || "0",
          
          classificacaoFiscal: service.classificacaoFiscal || "",
          csosn: service.csosn || "",
          cfopVenda: service.cfopVenda || "",
          cfopCompra: service.cfopCompra || "",
          ipi: service.ipi?.toString() || "0",
          icms: service.icms?.toString() || "0",
          frete: service.frete?.toString() || "0",
          
          obs: service.obs || "",
          aplicacao: service.aplicacao || "",
          caracteristicas: service.caracteristicas || "",
          balancoAuditoria: service.balancoAuditoria?.toString() || "0",
          diasGarantia: service.diasGarantia?.toString() || "0",
          eCommerce: service.eCommerce || false,
        });
      } else {
        setFormData({
          ...initialFormData,
          categoria: "Suporte Técnico",
          unidade: "HORA",
        });
      }
    }
  }, [isOpen, service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.nome.trim() || !formData.codigo.trim()) {
      setFormError("Por favor, preencha o Nome e o Código (SKU) do serviço na aba 'Dados Gerais'.");
      setActiveTab("gerais");
      return;
    }

    setIsLoading(true);

    try {
      const url = "/api/servicos";
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        id: service?.id ? service.id.toString() : undefined,
        preco: parseFloat(formData.preco || "0"),
        estoque: parseFloat(formData.estoque || "0"), // Fixo
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
        setFormError(data.error || "Ocorreu um erro ao salvar o serviço.");
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border/40 pb-4 text-left">
          <DialogTitle className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-400" />
            {isEditing ? "Modificar Cadastro de Serviço" : "Novo Cadastro de Serviço"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Insira as informações comerciais, fiscais e administrativas na tabela unificada `Produto` (Servico = 'S').
          </DialogDescription>
        </DialogHeader>

        {/* Warning Error */}
        {formError && (
          <div className="bg-rose-950/45 border border-rose-500/35 text-rose-400 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex border-b border-slate-800/80 gap-1 mt-2">
          {[
            { id: "gerais", label: "Dados Gerais", icon: Tag },
            { id: "financeiro", label: "Financeiro & Custos", icon: DollarSign },
            { id: "fiscal_extras", label: "Fiscal & Observações", icon: Percent },
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
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Código SKU (SKU/Ref)*</label>
                  <Input
                    placeholder="Ex: SERV-0020"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Nome do Serviço*</label>
                  <Input
                    placeholder="Ex: Consultoria em TI Presencial"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-bold text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Descrição Abreviada</label>
                  <Input
                    placeholder="Ex: CONSULTORIA TI PRES"
                    value={formData.abreviado}
                    onChange={(e) => setFormData({ ...formData, abreviado: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Cobrança (Unidade)</label>
                  <select
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    className="w-full h-9.5 rounded-md border border-input bg-[#0F1420] text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer font-semibold px-3"
                  >
                    <option value="HORA">Por Hora (HORA)</option>
                    <option value="DIARIA">Por Diária (DIARIA)</option>
                    <option value="MES">Mensal (MES)</option>
                    <option value="UN">Por Execução (UN)</option>
                    <option value="KM">Por KM Rodado (KM)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Categoria do Serviço</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full h-9.5 rounded-md border border-input bg-[#0F1420] text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer font-semibold px-3"
                  >
                    <option value="Suporte Técnico">Suporte Técnico</option>
                    <option value="Consultoria">Consultoria</option>
                    <option value="Instalações">Instalações</option>
                    <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Treinamento">Treinamento</option>
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
                  Serviço Inativo (Desabilita seleção deste serviço em novas Propostas e OS)
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCEIRO */}
          {activeTab === "financeiro" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Valor de Venda Principal*</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/70 text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold border-emerald-500/25 focus-visible:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Custo de Provisão/Execução (Custo)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.custo}
                      onChange={(e) => setFormData({ ...formData, custo: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Comissão sobre Venda (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.comissao}
                    onChange={(e) => setFormData({ ...formData, comissao: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Desconto Máximo Autorizado (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.descontoMaximo}
                    onChange={(e) => setFormData({ ...formData, descontoMaximo: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Valor Venda 2 (Contratual)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.preco2}
                      onChange={(e) => setFormData({ ...formData, preco2: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Valor Venda 3 (Parceiros)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs font-bold font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.preco3}
                      onChange={(e) => setFormData({ ...formData, preco3: e.target.value })}
                      className="pl-9 h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FISCAL & EXTRAS */}
          {activeTab === "fiscal_extras" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Código Municipal do Serviço</label>
                  <Input
                    placeholder="Ex: 01.07 / LC 116"
                    value={formData.classificacaoFiscal}
                    onChange={(e) => setFormData({ ...formData, classificacaoFiscal: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Alíquota ISS (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.icms} // Mapeando ISS no campo ICMS temporariamente ou usando o esquema
                    onChange={(e) => setFormData({ ...formData, icms: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Dias de Garantia do Serviço</label>
                  <Input
                    type="number"
                    value={formData.diasGarantia}
                    onChange={(e) => setFormData({ ...formData, diasGarantia: e.target.value })}
                    className="h-9.5 bg-[#0F1420] text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Escopo / Descrição Técnica do Serviço</label>
                  <textarea
                    placeholder="Defina o escopo padrão do serviço, responsabilidades, materiais e termos..."
                    value={formData.caracteristicas}
                    onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                    rows={4}
                    className="w-full rounded-md border border-input px-3 py-2 text-xs shadow-sm bg-[#0F1420] focus:outline-none focus:ring-1 focus:ring-ring text-slate-200 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Observações do Cadastro</label>
                  <textarea
                    placeholder="Observações administrativas..."
                    value={formData.obs}
                    onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                    rows={2}
                    className="w-full rounded-md border border-input px-3 py-2 text-xs shadow-sm bg-[#0F1420] focus:outline-none focus:ring-1 focus:ring-ring text-slate-200 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
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
                  Gravando no Banco...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {isEditing ? "Atualizar Serviço" : "Registrar Serviço"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
