"use client";

import React, { useState, useEffect } from "react";
import { 
  X, User, MapPin, CreditCard, Building2, Landmark, 
  Phone, Mail, Globe, Calendar, Briefcase, FileText, 
  HelpCircle, Shield, Check, Loader2, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: any; // If provided, we are in Edit Mode
}

export default function ClientFormModal({ isOpen, onClose, onSuccess, client }: ClientFormModalProps) {
  const [activeTab, setActiveTab] = useState("geral");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // General Fields
  const [cliente, setCliente] = useState("");
  const [razao, setRazao] = useState("");
  const [tipo, setTipo] = useState("F"); // F = Física, J = Jurídica
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [rg, setRg] = useState("");
  const [orgao, setOrgao] = useState("");
  const [emissaoRg, setEmissaoRg] = useState("");
  const [ie, setIe] = useState("");
  const [im, setIm] = useState("");
  const [sexo, setSexo] = useState("M");
  const [situacao, setSituacao] = useState("A"); // A, B, C, D
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [nasc, setNasc] = useState(""); // YYYY-MM-DD

  // Main Address
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [complemento, setComplemento] = useState("");
  const [tel, setTel] = useState("");
  const [tel2, setTel2] = useState("");

  // Billing Address
  const [cepCob, setCepCob] = useState("");
  const [endCob, setEndCob] = useState("");
  const [bairroCob, setBairroCob] = useState("");
  const [cidCob, setCidCob] = useState("");
  const [estCob, setEstCob] = useState("");
  const [telCob, setTelCob] = useState("");
  const [telCob2, setTelCob2] = useState("");

  // Delivery Address
  const [cepEnt, setCepEnt] = useState("");
  const [endEnt, setEndEnt] = useState("");
  const [bairroEnt, setBairroEnt] = useState("");
  const [cidEnt, setCidEnt] = useState("");
  const [estEnt, setEstEnt] = useState("");
  const [telEnt, setTelEnt] = useState("");
  const [telEnt2, setTelEnt2] = useState("");

  // Financial & Professional Info
  const [limite, setLimite] = useState("0");
  const [acordo, setAcordo] = useState("0");
  const [cargo, setCargo] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [renda1, setRenda1] = useState("0");
  const [renda2, setRenda2] = useState("0");
  const [filiacaoPai, setFiliacaoPai] = useState("");
  const [filiacaoMae, setFiliacaoMae] = useState("");
  const [observacao, setObservacao] = useState("");

  // Bank Info & References
  const [banco1, setBanco1] = useState("");
  const [agencia1, setAgencia1] = useState("");
  const [conta1, setConta1] = useState("");
  const [banco2, setBanco2] = useState("");
  const [agencia2, setAgencia2] = useState("");
  const [conta2, setConta2] = useState("");
  const [referencias1, setReferencias1] = useState("");
  const [referencias1Cpf, setReferencias1Cpf] = useState("");
  const [referencias2, setReferencias2] = useState("");
  const [referencias2Cpf, setReferencias2Cpf] = useState("");

  // Load client data when in Edit Mode
  useEffect(() => {
    if (client) {
      setCliente(client.Cliente || "");
      setRazao(client.Razao || "");
      setTipo(client.Tipo || "F");
      setCpf(client.CPF || "");
      setCnpj(client.CGC || ""); // CGC represents CNPJ
      setRg(client.RG || "");
      setOrgao(client.Orgao || "");
      setIe(client.IE || "");
      setIm(client.IM || "");
      setSexo(client.Sexo || "M");
      setSituacao(client.Situacao || "A");
      setEmail(client.EMail || "");
      setSite(client.Site || "");
      setComplemento(client.Complemento || "");

      // Date parsing
      if (client.Ano_Nasc && client.Mes_Nasc && client.Dia_Nasc) {
        const y = String(client.Ano_Nasc).padStart(4, "0");
        const m = String(client.Mes_Nasc).padStart(2, "0");
        const d = String(client.Dia_Nasc).padStart(2, "0");
        setNasc(`${y}-${m}-${d}`);
      } else {
        setNasc("");
      }

      if (client.EmissaoRG) {
        setEmissaoRg(new Date(client.EmissaoRG).toISOString().split("T")[0]);
      } else {
        setEmissaoRg("");
      }

      // Address Fields
      setCep(client.Cep || "");
      setEndereco(client.Endereco || "");
      setBairro(client.Bairro || "");
      setCidade(client.Cidade || "");
      setEstado(client.Estado || "");
      setTel(client.Tel || "");
      setTel2(client.Tel2 || "");

      // Billing Address
      setCepCob(client.CepCob || "");
      setEndCob(client.EndCob || "");
      setBairroCob(client.BairroCob || "");
      setCidCob(client.CidCob || "");
      setEstCob(client.EstCob || "");
      setTelCob(client.TelCob || "");
      setTelCob2(client.TelCob2 || "");

      // Delivery Address
      setCepEnt(client.CepEnt || "");
      setEndEnt(client.EndEnt || "");
      setBairroEnt(client.BairroEnt || "");
      setCidEnt(client.CidEnt || "");
      setEstEnt(client.EstEnt || "");
      setTelEnt(client.TelEnt || "");
      setTelEnt2(client.TelEnt2 || "");

      // Financial & References
      setLimite(String(client.Limite || "0"));
      setAcordo(String(client.Acordo || "0"));
      setCargo(client.Cargo || "");
      setDepartamento(client.Departamento || "");
      setRenda1(String(client.Renda1 || "0"));
      setRenda2(String(client.Renda2 || "0"));
      setFiliacaoPai(client.FiliacaoPai || "");
      setFiliacaoMae(client.FiliacaoMae || "");
      setObservacao(client.Observacao || "");

      // Bank
      setBanco1(client.Banco1 || "");
      setAgencia1(client.Agencia1 || "");
      setConta1(client.Conta1 || "");
      setBanco2(client.Banco2 || "");
      setAgencia2(client.Agencia2 || "");
      setConta2(client.Conta2 || "");
      
      // Ref
      setReferencias1(client.Referencias1 || "");
      setReferencias1Cpf(client.Referencias1_CPF || "");
      setReferencias2(client.Referencias2 || "");
      setReferencias2Cpf(client.Referencias2_CPF || "");
    } else {
      // Clear Form Fields for Creation mode
      setCliente("");
      setRazao("");
      setTipo("F");
      setCpf("");
      setCnpj("");
      setRg("");
      setOrgao("");
      setEmissaoRg("");
      setIe("");
      setIm("");
      setSexo("M");
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

      setCepCob("");
      setEndCob("");
      setBairroCob("");
      setCidCob("");
      setEstCob("");
      setTelCob("");
      setTelCob2("");

      setCepEnt("");
      setEndEnt("");
      setBairroEnt("");
      setCidEnt("");
      setEstEnt("");
      setTelEnt("");
      setTelEnt2("");

      setLimite("0");
      setAcordo("0");
      setCargo("");
      setDepartamento("");
      setRenda1("0");
      setRenda2("0");
      setFiliacaoPai("");
      setFiliacaoMae("");
      setObservacao("");

      setBanco1("");
      setAgencia1("");
      setConta1("");
      setBanco2("");
      setAgencia2("");
      setConta2("");
      setReferencias1("");
      setReferencias1Cpf("");
      setReferencias2("");
      setReferencias2Cpf("");
    }
    setActiveTab("geral");
    setFormError(null);
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!cliente.trim()) {
      setFormError("O Nome Fantasia / Cliente é obrigatório.");
      setActiveTab("geral");
      return;
    }

    setIsSubmitLoading(true);

    try {
      const payload = {
        cliente,
        razao,
        tipo,
        cpf: tipo === "F" ? cpf : null,
        cnpj: tipo === "J" ? cnpj : null,
        rg,
        orgao,
        emissaoRg: emissaoRg || null,
        ie,
        im,
        sexo,
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

        cepCob,
        endCob,
        bairroCob,
        cidCob,
        estCob,
        telCob,
        telCob2,

        cepEnt,
        endEnt,
        bairroEnt,
        cidEnt,
        estEnt,
        telEnt,
        telEnt2,

        limite: parseFloat(limite) || 0,
        acordo: parseFloat(acordo) || 0,
        cargo,
        departamento,
        renda1: parseFloat(renda1) || 0,
        renda2: parseFloat(renda2) || 0,
        filiacaoPai,
        filiacaoMae,
        observacao,

        banco1,
        agencia1,
        conta1,
        banco2,
        agencia2,
        conta2,
        referencias1,
        referencias1_CPF: referencias1Cpf,
        referencias2,
        referencias2_CPF: referencias2Cpf,
      };

      const url = client ? `/api/clientes/${client.CodCli}` : "/api/clientes";
      const method = client ? "PUT" : "POST";

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
        setFormError(data.error || "Ocorreu um erro ao salvar o cliente.");
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
    { id: "adicionais", label: "Endereços Adicionais", icon: Building2 },
    { id: "financeiro", label: "Info. Financeiras", icon: CreditCard },
    { id: "bancario", label: "Bancos e Ref.", icon: Landmark },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0F1422] border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60 bg-[#0E131F]/90">
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-400" />
              {client ? `Editar Cliente: #${client.CodCli} - ${client.Cliente}` : "Cadastrar Novo Cliente"}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Preencha todos os campos do banco de dados local da tabela `CLIENTEs`.
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
                    ? "border-emerald-500 text-emerald-400 bg-emerald-950/10" 
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
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nome Fantasia / Cliente <span className="text-emerald-400">*</span></label>
                  <Input 
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nome Fantasia do Cliente"
                    className="h-9.5 bg-[#070B14] border-border/80 text-xs font-semibold focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Tipo de Cliente (F/J) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Tipo de Pessoa</label>
                  <div className="grid grid-cols-2 gap-2 h-9.5 bg-[#070B14] p-1 rounded-md border border-border/80">
                    <button
                      type="button"
                      onClick={() => setTipo("F")}
                      className={`text-[10px] font-bold rounded transition-all cursor-pointer ${tipo === "F" ? "bg-emerald-500 text-black font-extrabold" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      Física
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipo("J")}
                      className={`text-[10px] font-bold rounded transition-all cursor-pointer ${tipo === "J" ? "bg-emerald-500 text-black font-extrabold" : "text-slate-400 hover:text-slate-200"}`}
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
                    placeholder="Razão Social ou Nome Completo"
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
                      placeholder="Ex: 000.000.000-00"
                      className="h-9.5 bg-[#070B14] text-xs font-semibold"
                    />
                  ) : (
                    <Input 
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      placeholder="Ex: 00.000.000/0000-00"
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
                    placeholder={tipo === "F" ? "Número do RG" : "Inscrição Estadual"}
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Órgão Emissor / RG (Física) / Inscrição Municipal (Jurídica) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">
                    {tipo === "F" ? "Órgão" : "Insc. Municipal (I.M.)"}
                  </label>
                  <Input 
                    value={tipo === "F" ? orgao : im}
                    onChange={(e) => tipo === "F" ? setOrgao(e.target.value) : setIm(e.target.value)}
                    placeholder={tipo === "F" ? "SSP/SP" : "Inscrição Municipal"}
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Sexo (Física) / Situação (Ambos) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Sexo</label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    className="w-full h-9.5 rounded-md border border-border/80 bg-[#070B14] text-xs text-slate-200 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>

                {/* Situação Cadastral (A, B, C, D) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Situação</label>
                  <select
                    value={situacao}
                    onChange={(e) => setSituacao(e.target.value)}
                    className="w-full h-9.5 rounded-md border border-border/80 bg-[#070B14] text-xs text-slate-200 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-bold"
                  >
                    <option value="A">A - Ativo / Excelente</option>
                    <option value="B">B - Regular</option>
                    <option value="C">C - Restrito</option>
                    <option value="D">D - Inativo</option>
                  </select>
                </div>

                {/* Data de Nascimento */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nascimento</label>
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
                      placeholder="Ex: financeiro@cliente.com"
                      className="h-9.5 pl-9 bg-[#070B14] text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Site */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Site / Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      placeholder="www.cliente.com.br"
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
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cep <span className="text-emerald-400">*</span></label>
                  <Input 
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    className="h-9.5 bg-[#070B14] text-xs font-bold"
                  />
                </div>

                {/* Logradouro */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Endereço / Logradouro</label>
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
                    placeholder="Sala, Andar, Bloco, Referência..."
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Telefone Fixo */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Telefone Comercial</label>
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

                {/* Telefone 2 / Celular */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">WhatsApp / Celular</label>
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

          {/* TAB 3: ENDEREÇOS ADICIONAIS */}
          {activeTab === "adicionais" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Cobrança Section */}
              <div className="p-4 rounded-xl border border-border/50 bg-[#090C15]/40 space-y-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" /> Endereço de Cobrança (Faturamento)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cep Cobrança</label>
                    <Input 
                      value={cepCob}
                      onChange={(e) => setCepCob(e.target.value)}
                      placeholder="00000-000"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Endereço Cobrança</label>
                    <Input 
                      value={endCob}
                      onChange={(e) => setEndCob(e.target.value)}
                      placeholder="Endereço de faturamento"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Bairro Cobrança</label>
                    <Input 
                      value={bairroCob}
                      onChange={(e) => setBairroCob(e.target.value)}
                      placeholder="Bairro"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cidade Cobrança</label>
                    <Input 
                      value={cidCob}
                      onChange={(e) => setCidCob(e.target.value)}
                      placeholder="Cidade"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">UF Cob.</label>
                    <Input 
                      value={estCob}
                      onChange={(e) => setEstCob(e.target.value.substring(0, 2).toUpperCase())}
                      placeholder="SP"
                      className="h-9.5 bg-[#070B14] text-xs text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Entrega Section */}
              <div className="p-4 rounded-xl border border-border/50 bg-[#090C15]/40 space-y-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Endereço de Entrega (Logística)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cep Entrega</label>
                    <Input 
                      value={cepEnt}
                      onChange={(e) => setCepEnt(e.target.value)}
                      placeholder="00000-000"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Endereço Entrega</label>
                    <Input 
                      value={endEnt}
                      onChange={(e) => setEndEnt(e.target.value)}
                      placeholder="Endereço de logística"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Bairro Entrega</label>
                    <Input 
                      value={bairroEnt}
                      onChange={(e) => setBairroEnt(e.target.value)}
                      placeholder="Bairro"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cidade Entrega</label>
                    <Input 
                      value={cidEnt}
                      onChange={(e) => setCidEnt(e.target.value)}
                      placeholder="Cidade"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">UF Ent.</label>
                    <Input 
                      value={estEnt}
                      onChange={(e) => setEstEnt(e.target.value.substring(0, 2).toUpperCase())}
                      placeholder="SP"
                      className="h-9.5 bg-[#070B14] text-xs text-center font-bold"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INFORMAÇÕES FINANCEIRAS */}
          {activeTab === "financeiro" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Limite de Crédito */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Limite de Crédito (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-emerald-400" />
                    <Input 
                      type="number"
                      step="any"
                      value={limite}
                      onChange={(e) => setLimite(e.target.value)}
                      className="h-9.5 pl-9 bg-[#070B14] text-xs font-bold text-emerald-400"
                    />
                  </div>
                </div>

                {/* Acordo Comercial */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Acordo de Desconto (%)</label>
                  <Input 
                    type="number"
                    step="any"
                    value={acordo}
                    onChange={(e) => setAcordo(e.target.value)}
                    className="h-9.5 bg-[#070B14] text-xs font-semibold"
                  />
                </div>

                {/* Cargo */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Cargo</label>
                  <Input 
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Ex: Diretor, Comprador"
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Departamento */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Departamento</label>
                  <Input 
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    placeholder="Ex: Suprimentos"
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Renda/Faturamento 1 */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Renda Declarada / Faturamento</label>
                  <Input 
                    type="number"
                    step="any"
                    value={renda1}
                    onChange={(e) => setRenda1(e.target.value)}
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Filiação Pai */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nome do Pai</label>
                  <Input 
                    value={filiacaoPai}
                    onChange={(e) => setFiliacaoPai(e.target.value)}
                    placeholder="Filiação Paterna"
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Filiação Mãe */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nome da Mãe</label>
                  <Input 
                    value={filiacaoMae}
                    onChange={(e) => setFiliacaoMae(e.target.value)}
                    placeholder="Filiação Materna"
                    className="h-9.5 bg-[#070B14] text-xs"
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Observações de Contato / Vendas</label>
                  <textarea 
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    rows={4}
                    placeholder="Históricos, detalhes de venda, restrições internas, etc."
                    className="w-full bg-[#070B14] border border-border/80 rounded-md p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: DADOS BANCÁRIOS E REFERÊNCIAS */}
          {activeTab === "bancario" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Banco 1 */}
              <div className="p-4 rounded-xl border border-border/50 bg-[#090C15]/40 space-y-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="h-4 w-4" /> Referência Bancária Principal
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Nome do Banco</label>
                    <Input 
                      value={banco1}
                      onChange={(e) => setBanco1(e.target.value)}
                      placeholder="Ex: Itaú, Bradesco"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Agência</label>
                    <Input 
                      value={agencia1}
                      onChange={(e) => setAgencia1(e.target.value)}
                      placeholder="Agência"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Número da Conta</label>
                    <Input 
                      value={conta1}
                      onChange={(e) => setConta1(e.target.value)}
                      placeholder="Conta Corrente"
                      className="h-9.5 bg-[#070B14] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Referências Comerciais */}
              <div className="p-4 rounded-xl border border-border/50 bg-[#090C15]/40 space-y-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> Referências de Crédito e Fiança
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4 border-r border-border/10 pr-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Referência Comercial 1</label>
                      <Input 
                        value={referencias1}
                        onChange={(e) => setReferencias1(e.target.value)}
                        placeholder="Nome da Referência"
                        className="h-9.5 bg-[#070B14] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">CPF Referência 1</label>
                      <Input 
                        value={referencias1Cpf}
                        onChange={(e) => setReferencias1Cpf(e.target.value)}
                        placeholder="CPF da Referência 1"
                        className="h-9.5 bg-[#070B14] text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Referência Comercial 2</label>
                      <Input 
                        value={referencias2}
                        onChange={(e) => setReferencias2(e.target.value)}
                        placeholder="Nome da Referência"
                        className="h-9.5 bg-[#070B14] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">CPF Referência 2</label>
                      <Input 
                        value={referencias2Cpf}
                        onChange={(e) => setReferencias2Cpf(e.target.value)}
                        placeholder="CPF da Referência 2"
                        className="h-9.5 bg-[#070B14] text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </form>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2.5 p-4 border-t border-border/60 bg-[#0E131F]/90">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onClose} 
            className="text-xs h-9 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isSubmitLoading}
            onClick={handleSubmit}
            className="text-xs font-bold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            {isSubmitLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gravando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Gravar Cliente
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
