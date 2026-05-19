"use client";

import React, { useState, useEffect } from "react";
import { 
  X, User, MapPin, CreditCard, Landmark, 
  Phone, Mail, Globe, Calendar, FileText, 
  Shield, Check, Loader2, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FornecFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  fornec?: any; // If provided, we are in Edit Mode
}

export default function FornecFormModal({ isOpen, onClose, onSuccess, fornec }: FornecFormModalProps) {
  const [activeTab, setActiveTab] = useState("geral");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // General Fields
  const [fornecName, setFornecName] = useState("");
  const [razao, setRazao] = useState("");
  const [tipo, setTipo] = useState("F"); // F = Física, J = Jurídica
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [rg, setRg] = useState("");
  const [orgao, setOrgao] = useState("");
  const [ie, setIe] = useState("");
  const [im, setIm] = useState("");
  const [situacao, setSituacao] = useState("A"); // A = Ativo, I = Inativo
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [nasc, setNasc] = useState(""); // YYYY-MM-DD
  const [complemento, setComplemento] = useState("");

  // Address Fields
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tel, setTel] = useState("");
  const [tel2, setTel2] = useState("");

  // Bank Info
  const [banco1, setBanco1] = useState("");
  const [agencia1, setAgencia1] = useState("");
  const [conta1, setConta1] = useState("");
  const [banco2, setBanco2] = useState("");
  const [agencia2, setAgencia2] = useState("");
  const [conta2, setConta2] = useState("");

  // Fiscal/Logistics Info
  const [desconto, setDesconto] = useState("0");
  const [icms, setIcms] = useState("0");
  const [ipi, setIpi] = useState("0");
  const [placa, setPlaca] = useState("");
  const [placaUf, setPlacaUf] = useState("");
  const [prazo, setPrazo] = useState("0");
  const [observacao, setObservacao] = useState("");

  // Load fornecedor data when in Edit Mode
  useEffect(() => {
    if (fornec) {
      setFornecName(fornec.Fornec || "");
      setRazao(fornec.Razao || "");
      setTipo(fornec.Tipo || "F");
      setCpf(fornec.CPF || "");
      setCnpj(fornec.CGC || ""); // CGC represents CNPJ
      setRg(fornec.RG || "");
      setOrgao(fornec.Orgao || "");
      setIe(fornec.IE || "");
      setIm(fornec.IM || "");
      setSituacao(fornec.Situacao || "A");
      setEmail(fornec.EMail || "");
      setSite(fornec.Site || "");
      setComplemento(fornec.Complemento || "");

      // Date parsing
      if (fornec.Ano_Nasc && fornec.Mes_Nasc && fornec.Dia_Nasc) {
        const y = String(fornec.Ano_Nasc).padStart(4, "0");
        const m = String(fornec.Mes_Nasc).padStart(2, "0");
        const d = String(fornec.Dia_Nasc).padStart(2, "0");
        setNasc(`${y}-${m}-${d}`);
      } else {
        setNasc("");
      }

      // Address Fields
      setCep(fornec.Cep || "");
      setEndereco(fornec.Endereco || "");
      setBairro(fornec.Bairro || "");
      setCidade(fornec.Cidade || "");
      setEstado(fornec.Estado || "");
      setTel(fornec.Tel || "");
      setTel2(fornec.Tel2 || "");

      // Bank
      setBanco1(fornec.Banco1 || "");
      setAgencia1(fornec.Agencia1 || "");
      setConta1(fornec.Conta1 || "");
      setBanco2(fornec.Banco2 || "");
      setAgencia2(fornec.Agencia2 || "");
      setConta2(fornec.Conta2 || "");

      // Fiscal & Logistics
      setDesconto(String(fornec.Desconto || "0"));
      setIcms(String(fornec.ICMS || "0"));
      setIpi(String(fornec.IPI || "0"));
      setPlaca(fornec.Placa || "");
      setPlacaUf(fornec.Placa_UF || "");
      setPrazo(String(fornec.Prazo || "0"));
      setObservacao(fornec.Observacao || "");
    } else {
      // Clear Form Fields for Creation mode
      setFornecName("");
      setRazao("");
      setTipo("F");
      setCpf("");
      setCnpj("");
      setRg("");
      setOrgao("");
      setIe("");
      setIm("");
      setSituacao("A");
      setEmail("");
      setSite("");
      setNasc("");
      setComplemento("");

      setCep("");
      setEndereco("");
      setBairro("");
      setCidade("");
      setEstado("");
      setTel("");
      setTel2("");

      setBanco1("");
      setAgencia1("");
      setConta1("");
      setBanco2("");
      setAgencia2("");
      setConta2("");

      setDesconto("0");
      setIcms("0");
      setIpi("0");
      setPlaca("");
      setPlacaUf("");
      setPrazo("0");
      setObservacao("");
    }
    setActiveTab("geral");
    setFormError(null);
  }, [fornec, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fornecName.trim()) {
      setFormError("O Nome Fantasia / Fornecedor é obrigatório.");
      setActiveTab("geral");
      return;
    }

    setIsSubmitLoading(true);

    try {
      const payload = {
        fornec: fornecName,
        razao,
        tipo,
        cpf: tipo === "F" ? cpf : null,
        cnpj: tipo === "J" ? cnpj : null,
        rg,
        orgao,
        ie,
        im,
        situacao,
        email,
        site,
        nasc: nasc || null,
        complemento,

        cep,
        endereco,
        bairro,
        cidade,
        estado,
        tel,
        tel2,

        banco1,
        agencia1,
        conta1,
        banco2,
        agencia2,
        conta2,

        desconto: parseFloat(desconto) || 0,
        icms: parseFloat(icms) || 0,
        ipi: parseFloat(ipi) || 0,
        placa,
        placa_UF: placaUf,
        prazo: parseInt(prazo) || 0,
        observacao,
      };

      const url = fornec ? `/api/fornecedores/${fornec.CodFor}` : "/api/fornecedores";
      const method = fornec ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setFormError(data.error || "Ocorreu um erro ao salvar o fornecedor.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Erro de comunicação com o servidor.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const tabs = [
    { id: "geral", label: "Dados Gerais", icon: User },
    { id: "endereco", label: "Endereço Principal", icon: MapPin },
    { id: "bancario", label: "Dados Bancários", icon: Landmark },
    { id: "adicional", label: "Faturamento & Obs", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0F1422] border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60 bg-[#0E131F]/90">
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-sky-400" />
              {fornec ? `Editar Fornecedor: #${fornec.CodFor} - ${fornec.Fornec}` : "Cadastrar Novo Fornecedor"}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Preencha os campos para atualizar os registros corporativos da tabela `Fornec`.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-border/40 bg-[#0C101B] overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-[11px] font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? "border-sky-500 text-sky-400 bg-sky-950/10" 
                    : "border-transparent text-muted-foreground hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body / Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {formError && (
            <div className="bg-rose-950/45 border border-rose-500/35 text-rose-400 p-3 rounded-lg text-xs font-semibold">
              {formError}
            </div>
          )}

          {/* TAB 1: DADOS GERAIS */}
          {activeTab === "geral" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Nome Fantasia */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nome Fantasia / Fornecedor <span className="text-sky-400">*</span></label>
                  <Input 
                    value={fornecName}
                    onChange={(e) => setFornecName(e.target.value)}
                    placeholder="Nome Fantasia ou Identificador"
                    className="h-9.5 bg-[#070B14] border-border/80 text-xs font-semibold focus:border-sky-500"
                    required
                  />
                </div>

                {/* Tipo de Fornecedor (F/J) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Tipo de Pessoa</label>
                  <div className="grid grid-cols-2 gap-2 h-9.5 bg-[#070B14] p-1 rounded-md border border-border/80">
                    <button
                      type="button"
                      onClick={() => setTipo("F")}
                      className={`text-[10px] font-bold rounded transition-all cursor-pointer ${tipo === "F" ? "bg-sky-500 text-black font-extrabold" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      Física
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipo("J")}
                      className={`text-[10px] font-bold rounded transition-all cursor-pointer ${tipo === "J" ? "bg-sky-500 text-black font-extrabold" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      Jurídica
                    </button>
                  </div>
                </div>

                {/* Razão Social */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Razão Social / Nome Completo</label>
                  <Input 
                    value={razao}
                    onChange={(e) => setRazao(e.target.value)}
                    placeholder="Razão Social Corporativa"
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* CNPJ ou CPF */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">
                    {tipo === "F" ? "C.P.F." : "C.N.P.J. / C.G.C."}
                  </label>
                  {tipo === "F" ? (
                    <Input 
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="h-9.5 bg-[#070B14] text-xs font-semibold"
                    />
                  ) : (
                    <Input 
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      placeholder="00.000.000/0000-00"
                      className="h-9.5 bg-[#070B14] text-xs font-semibold"
                    />
                  )}
                </div>

                {/* RG (Física) / Inscrição Estadual (Jurídica) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">
                    {tipo === "F" ? "R.G." : "Insc. Estadual (I.E.)"}
                  </label>
                  <Input 
                    value={tipo === "F" ? rg : ie}
                    onChange={(e) => tipo === "F" ? setRg(e.target.value) : setIe(e.target.value)}
                    placeholder={tipo === "F" ? "RG do responsável" : "Inscrição Estadual"}
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Órgão Emissor / Inscrição Municipal */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">
                    {tipo === "F" ? "Órgão Emissor" : "Insc. Municipal (I.M.)"}
                  </label>
                  <Input 
                    value={tipo === "F" ? orgao : im}
                    onChange={(e) => tipo === "F" ? setOrgao(e.target.value) : setIm(e.target.value)}
                    placeholder={tipo === "F" ? "SSP/SP" : "Inscrição Municipal"}
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Situação Cadastral (A/I) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Situação</label>
                  <select
                    value={situacao}
                    onChange={(e) => setSituacao(e.target.value)}
                    className="w-full h-9.5 rounded-md border border-border/80 bg-[#070B14] text-xs text-slate-200 px-3 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer font-bold"
                  >
                    <option value="A">Ativo / Liberado</option>
                    <option value="I">Inativo / Bloqueado</option>
                  </select>
                </div>

                {/* Data de Nascimento */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Data Nasc. / Fundação</label>
                  <Input 
                    type="date"
                    value={nasc}
                    onChange={(e) => setNasc(e.target.value)}
                    className="h-9.5 bg-[#070B14] text-xs cursor-pointer font-bold"
                  />
                </div>

                {/* E-mail */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">E-mail Principal</label>
                  <div className="relative">
                    <Mail className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="comercial@fornecedor.com"
                      className="h-9.5 pl-9 bg-[#070B14] text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Site */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      placeholder="www.fornecedor.com"
                      className="h-9.5 pl-9 bg-[#070B14] text-xs"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: ENDEREÇO PRINCIPAL */}
          {activeTab === "endereco" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* CEP */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cep <span className="text-sky-400">*</span></label>
                  <Input 
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    className="h-9.5 bg-[#070B14] text-xs font-bold"
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Endereço Principal</label>
                  <Input 
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, Avenida, Praça..."
                    className="h-9.5 bg-[#070B14] text-xs font-semibold"
                  />
                </div>

                {/* Bairro */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Bairro</label>
                  <Input 
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Bairro"
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Cidade */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cidade</label>
                  <Input 
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Cidade"
                    className="h-9.5 bg-[#070B14] text-xs font-bold"
                  />
                </div>

                {/* Estado */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">UF</label>
                  <Input 
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.substring(0, 2).toUpperCase())}
                    placeholder="SP"
                    className="h-9.5 bg-[#070B14] text-xs text-center font-bold"
                  />
                </div>

                {/* Complemento */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Complemento</label>
                  <Input 
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Bloco, Galpão, Referência..."
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Telefone 1 */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Telefone Principal</label>
                  <div className="relative">
                    <Phone className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                      placeholder="(00) 0000-0000"
                      className="h-9.5 pl-9 bg-[#070B14] text-xs"
                    />
                  </div>
                </div>

                {/* Telefone 2 */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Telefone 2</label>
                  <div className="relative">
                    <Phone className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={tel2}
                      onChange={(e) => setTel2(e.target.value)}
                      placeholder="(00) 90000-0000"
                      className="h-9.5 pl-9 bg-[#070B14] text-xs"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: DADOS BANCÁRIOS */}
          {activeTab === "bancario" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Banco 1 Section */}
              <div className="p-4 rounded-xl border border-border/50 bg-[#090C15]/40 space-y-4">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="h-4 w-4" /> Conta Bancária Principal
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nome do Banco</label>
                    <Input 
                      value={banco1}
                      onChange={(e) => setBanco1(e.target.value)}
                      placeholder="Ex: Banco do Brasil"
                      className="h-9.5 bg-[#070B14] text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Agência</label>
                    <Input 
                      value={agencia1}
                      onChange={(e) => setAgencia1(e.target.value)}
                      placeholder="Ex: 0123-4"
                      className="h-9.5 bg-[#070B14] text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Conta Corrente</label>
                    <Input 
                      value={conta1}
                      onChange={(e) => setConta1(e.target.value)}
                      placeholder="Ex: 12345-6"
                      className="h-9.5 bg-[#070B14] text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Banco 2 Section */}
              <div className="p-4 rounded-xl border border-border/50 bg-[#090C15]/40 space-y-4">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="h-4 w-4" /> Conta Bancária Secundária (Opcional)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nome do Banco</label>
                    <Input 
                      value={banco2}
                      onChange={(e) => setBanco2(e.target.value)}
                      placeholder="Ex: Itaú Unibanco"
                      className="h-9.5 bg-[#070B14] text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Agência</label>
                    <Input 
                      value={agencia2}
                      onChange={(e) => setAgencia2(e.target.value)}
                      placeholder="Ex: 4567"
                      className="h-9.5 bg-[#070B14] text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Conta Corrente</label>
                    <Input 
                      value={conta2}
                      onChange={(e) => setConta2(e.target.value)}
                      placeholder="Ex: 98765-4"
                      className="h-9.5 bg-[#070B14] text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: FATURAMENTO & ADICIONAL */}
          {activeTab === "adicional" && (
            <div className="space-y-4 animate-fade-in">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Desconto Padrão */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Desconto Acordado (%)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number"
                      step="0.01"
                      value={desconto}
                      onChange={(e) => setDesconto(e.target.value)}
                      className="h-9.5 pl-9 bg-[#070B14] text-xs font-bold"
                    />
                  </div>
                </div>

                {/* ICMS */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">ICMS Padrão (%)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={icms}
                    onChange={(e) => setIcms(e.target.value)}
                    className="h-9.5 bg-[#070B14] text-xs font-bold"
                  />
                </div>

                {/* IPI */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">IPI Padrão (%)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={ipi}
                    onChange={(e) => setIpi(e.target.value)}
                    className="h-9.5 bg-[#070B14] text-xs font-bold"
                  />
                </div>

                {/* Prazo de Pagamento */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Prazo Faturamento (Dias)</label>
                  <Input 
                    type="number"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className="h-9.5 bg-[#070B14] text-xs font-bold"
                  />
                </div>

                {/* Placa do Veículo */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Placa do Veículo (Transportadora)</label>
                  <Input 
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.substring(0, 8).toUpperCase())}
                    placeholder="Ex: ABC-1234"
                    className="h-9.5 bg-[#070B14] text-xs font-mono font-bold"
                  />
                </div>

                {/* Placa UF */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Placa UF</label>
                  <Input 
                    value={placaUf}
                    onChange={(e) => setPlacaUf(e.target.value.substring(0, 2).toUpperCase())}
                    placeholder="SP"
                    className="h-9.5 bg-[#070B14] text-xs font-bold text-center"
                  />
                </div>

                {/* Espaço Vazio para alinhamento */}
                <div></div>

                {/* Observações */}
                <div className="md:col-span-4 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Observações do Fornecedor</label>
                  <textarea
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Insira notas, termos ou detalhes contratuais adicionais..."
                    rows={4}
                    className="w-full rounded-md border border-border/80 bg-[#070B14] text-xs text-slate-200 p-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-semibold"
                  />
                </div>

              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex justify-end gap-2 border-t border-border/20 pt-4 bg-transparent mt-8">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-9 cursor-pointer"
              disabled={isSubmitLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-9 bg-sky-500 hover:bg-sky-400 text-black font-extrabold flex items-center gap-1.5 shadow-[0_0_12px_rgba(14,165,233,0.2)] cursor-pointer"
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Salvando dados...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Salvar Fornecedor
                </>
              )}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
