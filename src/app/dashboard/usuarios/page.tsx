"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Key, Briefcase, ChevronRight, Loader2, ShieldAlert, CheckCircle, 
  Trash2, ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PERMISSIONS_LIST, Permission } from "@/lib/permissions";

// Import modular subcomponents
import CollaboratorsSidebar from "./components/CollaboratorsSidebar";
import UserAcessoTab from "./components/UserAcessoTab";
import CollaboratorFichaTab from "./components/CollaboratorFichaTab";

export default function UsersDashboard() {
  // Central Data lists
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Active loaded record for editing (null means we are in "Create mode" or "Blank slate")
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<"acesso" | "colaborador">("acesso");

  // Delete modal
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [deletarColaboradorVinculado, setDeletarColaboradorVinculado] = useState(true);

  // Success / Error alerts
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ==================== FORM STATES (Unified) ====================
  // STEP 1 FIELDS (Senha table)
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("Operador");
  const [inativo, setInativo] = useState(false);
  const [compromisso, setCompromisso] = useState(true);
  const [descMaximo, setDescMaximo] = useState("10.00");
  const [descMaximoAtacado, setDescMaximoAtacado] = useState("10.00");
  const [descMaximoST, setDescMaximoST] = useState("10.00");
  const [totalMaximoCompra, setTotalMaximoCompra] = useState("5000.00");
  const [trabalhoInicio, setTrabalhoInicio] = useState("08:00");
  const [trabalhoFim, setTrabalhoFim] = useState("18:00");
  const [trabalhoDom, setTrabalhoDom] = useState(false);
  const [trabalhoSeg, setTrabalhoSeg] = useState(true);
  const [trabalhoTer, setTrabalhoTer] = useState(true);
  const [trabalhoQua, setTrabalhoQua] = useState(true);
  const [trabalhoQui, setTrabalhoQui] = useState(true);
  const [trabalhoSex, setTrabalhoSex] = useState(true);
  const [trabalhoSab, setTrabalhoSab] = useState(false);
  const [emailAlternativo, setEmailAlternativo] = useState("");
  const [email, setEmail] = useState("");
  const [spool, setSpool] = useState("SPO");
  const [tipoPreco, setTipoPreco] = useState("2 - Cartão");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string>>({});

  // STEP 2 FIELDS (Indicado table)
  const [tipoColaborador, setTipoColaborador] = useState<"F" | "J">("F");
  const [razao, setRazao] = useState("");
  const [cpfColaborador, setCpfColaborador] = useState("");
  const [rgColaborador, setRgColaborador] = useState("");
  const [orgaoColaborador, setOrgaoColaborador] = useState("SSP");
  const [cnpjColaborador, setCnpjColaborador] = useState("");
  const [ieColaborador, setIeColaborador] = useState("");
  const [imColaborador, setImColaborador] = useState("");
  const [cargoColaborador, setCargoColaborador] = useState("Analista Financeiro");
  const [departamentoColaborador, setDepartamentoColaborador] = useState("Financeiro");
  const [enderecoColaborador, setEnderecoColaborador] = useState("");
  const [bairroColaborador, setBairroColaborador] = useState("");
  const [cidadeColaborador, setCidadeColaborador] = useState("");
  const [estadoColaborador, setEstadoColaborador] = useState("SP");
  const [cepColaborador, setCepColaborador] = useState("");
  const [emailColaborador, setEmailColaborador] = useState("");
  const [siteColaborador, setSiteColaborador] = useState("");
  const [telefoneColaborador, setTelefoneColaborador] = useState("");
  const [celularColaborador, setCelularColaborador] = useState("");
  const [pisColaborador, setPisColaborador] = useState("");
  const [ctpsColaborador, setCtpsColaborador] = useState("");
  const [localNascColaborador, setLocalNascColaborador] = useState("São Paulo - SP");
  const [estadoCivilColaborador, setEstadoCivilColaborador] = useState("Solteiro(a)");
  const [filiacaoPaiColaborador, setFiliacaoPaiColaborador] = useState("");
  const [filiacaoMaeColaborador, setFiliacaoMaeColaborador] = useState("");
  const [emissaoRgColaborador, setEmissaoRgColaborador] = useState("");
  const [nascColaborador, setNascColaborador] = useState("");
  const [grauInstrucaoColaborador, setGrauInstrucaoColaborador] = useState("Ensino Superior");
  const [sexoColaborador, setSexoColaborador] = useState<"M" | "F">("M");
  const [observacaoColaborador, setObservacaoColaborador] = useState("");
  const [salarioBaseColaborador, setSalarioBaseColaborador] = useState("5000.00");
  const [alimentacaoColaborador, setAlimentacaoColaborador] = useState("2.50");
  const [transporteColaborador, setTransporteColaborador] = useState("5.00");
  const [chaveColaborador, setChaveColaborador] = useState("");
  const [registroColaborador, setRegistroColaborador] = useState("");
  const [conselhoColaborador, setConselhoColaborador] = useState("CRC");
  const [situacaoColaborador, setSituacaoColaborador] = useState("A");
  const [vencimentoColaborador, setVencimentoColaborador] = useState("30");

  // Local active permission category inside tab
  const [activePermCategory, setActivePermCategory] = useState<Permission["category"]>("vendas");
  const [permSearch, setPermSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/usuarios");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        if (data.length > 0 && !selectedUser && !isCreatingNew) {
          loadUserRecord(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load users list", err);
    } finally {
      setIsLoading(false);
    }
  };

  // CORRECT DEFINITION OF resetForm
  const resetForm = () => {
    setSelectedUser(null);
    setIsCreatingNew(false);
    setNome("");
    setUsuario("");
    setSenha("");
    setRole("Operador");
    setInativo(false);
    setCompromisso(true);
    setDescMaximo("10.00");
    setDescMaximoAtacado("10.00");
    setDescMaximoST("10.00");
    setTotalMaximoCompra("5000.00");
    setTrabalhoInicio("08:00");
    setTrabalhoFim("18:00");
    setTrabalhoDom(false);
    setTrabalhoSeg(true);
    setTrabalhoTer(true);
    setTrabalhoQua(true);
    setTrabalhoQui(true);
    setTrabalhoSex(true);
    setTrabalhoSab(false);
    setEmailAlternativo("");
    setEmail("");
    setSpool("SPO");
    setTipoPreco("2 - Cartão");
    setSelectedPermissions({});
    setFormError(null);
    setSuccessMsg(null);

    // Step 2 resets
    setTipoColaborador("F");
    setRazao("");
    setCpfColaborador("");
    setRgColaborador("");
    setOrgaoColaborador("SSP");
    setCnpjColaborador("");
    setIeColaborador("");
    setImColaborador("");
    setCargoColaborador("Analista Financeiro");
    setDepartamentoColaborador("Financeiro");
    setEnderecoColaborador("");
    setBairroColaborador("");
    setCidadeColaborador("");
    setEstadoColaborador("SP");
    setCepColaborador("");
    setEmailColaborador("");
    setSiteColaborador("");
    setTelefoneColaborador("");
    setCelularColaborador("");
    setPisColaborador("");
    setCtpsColaborador("");
    setLocalNascColaborador("São Paulo - SP");
    setEstadoCivilColaborador("Solteiro(a)");
    setFiliacaoPaiColaborador("");
    setFiliacaoMaeColaborador("");
    setEmissaoRgColaborador("");
    setNascColaborador("");
    setGrauInstrucaoColaborador("Ensino Superior");
    setSexoColaborador("M");
    setObservacaoColaborador("");
    setSalarioBaseColaborador("5000.00");
    setAlimentacaoColaborador("2.50");
    setTransporteColaborador("5.00");
    setChaveColaborador("");
    setRegistroColaborador("");
    setConselhoColaborador("CRC");
    setSituacaoColaborador("A");
    setVencimentoColaborador("30");
  };

  const loadUserRecord = (u: any) => {
    setFormError(null);
    setSuccessMsg(null);
    setSelectedUser(u);
    setIsCreatingNew(false);

    // Bind User directives
    setNome(u.nome || "");
    setUsuario(u.usuario || "");
    setSenha("");
    setRole(u.role || "Operador");
    setInativo(u.inativo || false);
    setCompromisso(u.compromisso === undefined ? true : u.compromisso);
    setDescMaximo(u.descMaximo?.toString() || "10.00");
    setDescMaximoAtacado(u.descMaximoAtacado?.toString() || "10.00");
    setDescMaximoST(u.descMaximoST?.toString() || "10.00");
    setTotalMaximoCompra(u.totalMaximoCompra?.toString() || "5000.00");
    setTrabalhoInicio(u.trabalhoInicio || "08:00");
    setTrabalhoFim(u.trabalhoFim || "18:00");
    setTrabalhoDom(u.trabalhoDom || false);
    setTrabalhoSeg(u.trabalhoSeg === undefined ? true : u.trabalhoSeg);
    setTrabalhoTer(u.trabalhoTer === undefined ? true : u.trabalhoTer);
    setTrabalhoQua(u.trabalhoQua === undefined ? true : u.trabalhoQua);
    setTrabalhoQui(u.trabalhoQui === undefined ? true : u.trabalhoQui);
    setTrabalhoSex(u.trabalhoSex === undefined ? true : u.trabalhoSex);
    setTrabalhoSab(u.trabalhoSab || false);
    setEmailAlternativo(u.emailAlternativo || "");
    setEmail(u.email || "");
    setSpool(u.spool || "SPO");
    setTipoPreco(u.tipoPreco || "2 - Cartão");
    setSelectedPermissions(u.permissions || {});

    // Bind Collaborator details
    if (u.colaborador) {
      const c = u.colaborador;
      setTipoColaborador(c.tipo === "J" ? "J" : "F");
      setRazao(c.razao || c.nome || "");
      setCpfColaborador(c.cpf || "");
      setRgColaborador(c.rg || "");
      setOrgaoColaborador(c.orgao || "SSP");
      setCnpjColaborador(c.cnpj || "");
      setIeColaborador(c.ie || "");
      setImColaborador(c.im || "");
      setCargoColaborador(c.cargo || "Analista Financeiro");
      setDepartamentoColaborador(c.departamento || "Financeiro");
      setEnderecoColaborador(c.endereco || "");
      setBairroColaborador(c.bairro || "");
      setCidadeColaborador(c.cidade || "");
      setEstadoColaborador(c.estado || "SP");
      setCepColaborador(c.cep || "");
      setEmailColaborador(c.email || "");
      setSiteColaborador(c.site || "");
      setTelefoneColaborador(c.telefone || "");
      setCelularColaborador(c.celular || "");
      setPisColaborador(c.pis || "");
      setCtpsColaborador(c.ctps || "");
      setLocalNascColaborador(c.localNasc || "São Paulo - SP");
      setEstadoCivilColaborador(c.estadoCivil || "Solteiro(a)");
      setFiliacaoPaiColaborador(c.filiacaoPai || "");
      setFiliacaoMaeColaborador(c.filiacaoMae || "");
      setEmissaoRgColaborador(c.emissaoRg || "");
      setNascColaborador(c.nasc || "");
      setGrauInstrucaoColaborador(c.grauInstrucao || "Ensino Superior");
      setSexoColaborador(c.sexo === "F" ? "F" : "M");
      setObservacaoColaborador(c.observacao || "");
      setSalarioBaseColaborador(c.salarioBase?.toString() || "5000.00");
      setAlimentacaoColaborador(c.alimentacao?.toString() || "2.50");
      setTransporteColaborador(c.transporte?.toString() || "5.00");
      setChaveColaborador(c.chave || "");
      setRegistroColaborador(c.registro || "");
      setConselhoColaborador(c.conselho || "CRC");
      setSituacaoColaborador(c.situacao || "A");
      setVencimentoColaborador(c.vencimento?.toString() || "30");
    } else {
      // Presets
      setTipoColaborador("F");
      setRazao(u.nome || "");
      setCpfColaborador("");
      setRgColaborador("");
      setOrgaoColaborador("SSP");
      setCnpjColaborador("");
      setIeColaborador("");
      setImColaborador("");
      setCargoColaborador("Analista Financeiro");
      setDepartamentoColaborador("Financeiro");
      setEnderecoColaborador("");
      setBairroColaborador("");
      setCidadeColaborador("");
      setEstadoColaborador("SP");
      setCepColaborador("");
      setEmailColaborador(u.email || "");
      setSiteColaborador("");
      setTelefoneColaborador("");
      setCelularColaborador("");
      setPisColaborador("");
      setCtpsColaborador("");
      setLocalNascColaborador("São Paulo - SP");
      setEstadoCivilColaborador("Solteiro(a)");
      setFiliacaoPaiColaborador("");
      setFiliacaoMaeColaborador("");
      setEmissaoRgColaborador("");
      setNascColaborador("");
      setGrauInstrucaoColaborador("Ensino Superior");
      setSexoColaborador("M");
      setObservacaoColaborador("");
      setSalarioBaseColaborador("5000.00");
      setAlimentacaoColaborador("2.50");
      setTransporteColaborador("5.00");
      setChaveColaborador("");
      setRegistroColaborador("");
      setConselhoColaborador("CRC");
      setSituacaoColaborador("A");
      setVencimentoColaborador("30");
    }
  };

  const handleStartCreateNew = () => {
    resetForm();
    setIsCreatingNew(true);
    setActiveTab("acesso");
  };

  const handleMakeAdmin = () => {
    const allFour: Record<string, string> = {};
    PERMISSIONS_LIST.forEach((p) => {
      allFour[p.key] = "4";
    });
    setSelectedPermissions(allFour);
    setRole("Administrador");
  };

  const handleClearPermissions = () => {
    setSelectedPermissions({});
  };

  const handleSelectAllCategory = () => {
    const updated = { ...selectedPermissions };
    PERMISSIONS_LIST.filter((p) => p.category === activePermCategory).forEach((p) => {
      updated[p.key] = "4";
    });
    setSelectedPermissions(updated);
  };

  const handleSetPermissionLevel = (key: string, level: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [key]: level,
    }));
  };

  const handleSaveUnifiedChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!nome.trim() || !usuario.trim()) {
      setFormError("Por favor, insira o nome completo e o nome de usuário.");
      return;
    }

    setIsSubmitLoading(true);

    try {
      // 1. Save or Update User Credentials (Senha table)
      const userUrl = selectedUser ? `/api/usuarios/${selectedUser.id}` : "/api/usuarios";
      const userMethod = selectedUser ? "PUT" : "POST";

      const userPayload: any = {
        nome,
        usuario,
        role,
        inativo,
        compromisso,
        descMaximo: parseFloat(descMaximo) || 0,
        descMaximoAtacado: parseFloat(descMaximoAtacado) || 0,
        descMaximoST: parseFloat(descMaximoST) || 0,
        totalMaximoCompra: parseFloat(totalMaximoCompra) || 0,
        trabalhoInicio,
        trabalhoFim,
        trabalhoDom,
        trabalhoSeg,
        trabalhoTer,
        trabalhoQua,
        trabalhoQui,
        trabalhoSex,
        trabalhoSab,
        emailAlternativo,
        email,
        spool,
        tipoPreco,
        permissions: selectedPermissions,
        colaboradorId: selectedUser?.colaborador?.id || undefined,
      };

      if (senha) {
        userPayload.senha = senha;
      }

      const userRes = await fetch(userUrl, {
        method: userMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const userData = await userRes.json();
      if (!userRes.ok) {
        setFormError(userData.error || "Erro ao salvar credenciais do usuário.");
        setIsSubmitLoading(false);
        return;
      }

      const savedUserRecord = selectedUser || userData.user;

      // 2. Automatically save linked Collaborator details (Indicado table)
      const colHasRecord = !!savedUserRecord?.colaborador;
      const colUrl = colHasRecord ? `/api/usuarios/${savedUserRecord.id}` : "/api/colaboradores";
      const colMethod = colHasRecord ? "PUT" : "POST";

      const colPayload: any = {
        nome,
        usuario,
        role,
        inativo,
        permissions: selectedPermissions,

        criarColaborador: true,
        colaboradorId: savedUserRecord?.colaborador?.id || undefined,
        tipo: tipoColaborador,
        razao: razao || nome,
        cpf: cpfColaborador,
        rg: rgColaborador,
        orgao: orgaoColaborador,
        cnpj: cnpjColaborador,
        ie: ieColaborador,
        im: imColaborador,
        cargo: cargoColaborador,
        departamento: departamentoColaborador,
        endereco: enderecoColaborador,
        bairro: bairroColaborador,
        cidade: cidadeColaborador,
        estado: estadoColaborador,
        cep: cepColaborador,
        email: emailColaborador || email,
        site: siteColaborador,
        telefone: telefoneColaborador,
        celular: celularColaborador,
        pis: pisColaborador,
        ctps: ctpsColaborador,
        localNasc: localNascColaborador,
        estadoCivil: estadoCivilColaborador,
        filiacaoPai: filiacaoPaiColaborador,
        filiacaoMae: filiacaoMaeColaborador,
        emissaoRg: emissaoRgColaborador || null,
        nasc: nascColaborador || null,
        grauInstrucao: grauInstrucaoColaborador,
        sexo: sexoColaborador,
        observacao: observacaoColaborador,
        salarioBase: parseFloat(salarioBaseColaborador) || 0,
        alimentacao: parseFloat(alimentacaoColaborador) || 0,
        transporte: parseFloat(transporteColaborador) || 0,
        chave: chaveColaborador,
        registro: registroColaborador,
        conselho: conselhoColaborador,
        situacao: situacaoColaborador,
        vencimento: parseInt(vencimentoColaborador) || 30,
        codUsu: savedUserRecord.id
      };

      const colRes = await fetch(colUrl, {
        method: colMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colPayload),
      });

      const colData = await colRes.json();
      if (!colRes.ok) {
        setFormError(colData.error || "Credenciais salvas, mas erro ao registrar ficha de colaborador.");
        setIsSubmitLoading(false);
        return;
      }

      setSuccessMsg("Ficha cadastral completa e diretivas salvas com sucesso!");
      await fetchUsers();

      if (userData.user) {
        loadUserRecord(userData.user);
      } else {
        const refreshed = users.find(u => u.id === savedUserRecord.id);
        if (refreshed) loadUserRecord(refreshed);
      }

      setTimeout(() => setSuccessMsg(null), 2500);

    } catch (err) {
      console.error(err);
      setFormError("Erro interno no salvamento unificado.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsSubmitLoading(true);

    try {
      let url = `/api/usuarios/${deletingUser.id}`;
      if (deletingUser.colaborador && deletarColaboradorVinculado) {
        url += `?colaboradorId=${deletingUser.colaborador.id}`;
      }

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeletingUser(null);
        setSelectedUser(null);
        setIsCreatingNew(false);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Falha ao excluir.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 select-none animate-fade-in text-slate-100 overflow-hidden pr-2">
      
      {/* Sidebar List (Master Component) */}
      <CollaboratorsSidebar
        users={users}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        selectedUser={selectedUser}
        loadUserRecord={loadUserRecord}
        handleStartCreateNew={handleStartCreateNew}
      />

      {/* Details Workspace (Detail) */}
      <div className="flex-1 flex flex-col bg-[#121826]/75 border border-border/80 rounded-2xl backdrop-blur-xl overflow-hidden">
        
        {!selectedUser && !isCreatingNew ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#0E1320] border border-border/70 flex items-center justify-center">
              <Users className="h-7 w-7 text-slate-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Painel Administrativo Unificado</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Selecione um colaborador da lista à esquerda para carregar sua ficha cadastral completa ou clique em Novo.
              </p>
            </div>
            <Button
              onClick={handleStartCreateNew}
              className="h-8.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer"
            >
              Criar Ficha Cadastro
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSaveUnifiedChanges} className="flex-1 flex flex-col overflow-hidden">
            
            {/* Workspace Header */}
            <div className="p-4 border-b border-border/40 bg-[#0E131F]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-emerald-950/40 border border-emerald-500/25 flex items-center justify-center font-extrabold text-xs text-emerald-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.06)]">
                  {nome ? nome.substring(0, 2).toUpperCase() : "?"}
                </div>

                <div className="flex flex-col text-left min-w-0">
                  <span className="text-sm font-black text-slate-100 tracking-tight truncate">
                    {isCreatingNew ? "Novo Colaborador / Ficha Cadastral" : nome}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                    <span>Login: <strong className="text-emerald-400">@{usuario || "indefinido"}</strong></span>
                    <span>•</span>
                    <span>ERP ID: <strong>{selectedUser?.id || "NOVO"}</strong></span>
                  </span>
                </div>
              </div>

              {/* Status & Tab toggle */}
              <div className="flex items-center gap-3.5">
                
                <button
                  type="button"
                  onClick={() => setInativo(!inativo)}
                  className="flex items-center gap-1.5 bg-[#0F1420] border border-border/80 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all hover:border-slate-700 cursor-pointer text-slate-300"
                >
                  {inativo ? (
                    <>
                      <ToggleLeft className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <span className="text-rose-400">ERP Inativo</span>
                    </>
                  ) : (
                    <>
                      <ToggleRight className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400">ERP Ativo</span>
                    </>
                  )}
                </button>

                <div className="flex bg-[#0E1320] border border-border/80 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab("acesso")}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "acesso"
                        ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                        : "text-muted-foreground hover:text-slate-200"
                    }`}
                  >
                    <Key className="h-3.5 w-3.5" /> Acesso & Diretivas
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("colaborador")}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "colaborador"
                        ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                        : "text-muted-foreground hover:text-slate-200"
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5" /> Ficha Cadastral
                  </button>
                </div>

              </div>

            </div>

            {/* Notifications */}
            {formError && (
              <div className="bg-rose-950/45 border-b border-rose-500/35 text-rose-400 p-2.5 text-[10px] font-bold flex items-center gap-2 animate-shake shrink-0">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-950/45 border-b border-emerald-500/35 text-emerald-400 p-2.5 text-[10px] font-bold flex items-center gap-2 animate-fade-in shrink-0">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Tab Body Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
              
              {activeTab === "acesso" && (
                <UserAcessoTab
                  nome={nome} setNome={setNome}
                  usuario={usuario} setUsuario={setUsuario}
                  senha={senha} setSenha={setSenha}
                  role={role} setRole={setRole}
                  activePermCategory={activePermCategory} setActivePermCategory={setActivePermCategory}
                  permSearch={permSearch} setPermSearch={setPermSearch}
                  selectedPermissions={selectedPermissions}
                  trabalhoInicio={trabalhoInicio} setTrabalhoInicio={setTrabalhoInicio}
                  trabalhoFim={trabalhoFim} setTrabalhoFim={setTrabalhoFim}
                  trabalhoDom={trabalhoDom} setTrabalhoDom={setTrabalhoDom}
                  trabalhoSeg={trabalhoSeg} setTrabalhoSeg={setTrabalhoSeg}
                  trabalhoTer={trabalhoTer} setTrabalhoTer={setTrabalhoTer}
                  trabalhoQua={trabalhoQua} setTrabalhoQua={setTrabalhoQua}
                  trabalhoQui={trabalhoQui} setTrabalhoQui={setTrabalhoQui}
                  trabalhoSex={trabalhoSex} setTrabalhoSex={setTrabalhoSex}
                  trabalhoSab={trabalhoSab} setTrabalhoSab={setTrabalhoSab}
                  descMaximo={descMaximo} setDescMaximo={setDescMaximo}
                  descMaximoAtacado={descMaximoAtacado} setDescMaximoAtacado={setDescMaximoAtacado}
                  descMaximoST={descMaximoST} setDescMaximoST={setDescMaximoST}
                  totalMaximoCompra={totalMaximoCompra} setTotalMaximoCompra={setTotalMaximoCompra}
                  tipoPreco={tipoPreco} setTipoPreco={setTipoPreco}
                  spool={spool} setSpool={setSpool}
                  compromisso={compromisso} setCompromisso={setCompromisso}
                  email={email} setEmail={setEmail}
                  emailAlternativo={emailAlternativo} setEmailAlternativo={setEmailAlternativo}
                  selectedUser={selectedUser}
                  handleMakeAdmin={handleMakeAdmin}
                  handleClearPermissions={handleClearPermissions}
                  handleSelectAllCategory={handleSelectAllCategory}
                  handleSetPermissionLevel={handleSetPermissionLevel}
                />
              )}

              {activeTab === "colaborador" && (
                <CollaboratorFichaTab
                  tipoColaborador={tipoColaborador} setTipoColaborador={setTipoColaborador}
                  cpfColaborador={cpfColaborador} setCpfColaborador={setCpfColaborador}
                  cnpjColaborador={cnpjColaborador} setCnpjColaborador={setCnpjColaborador}
                  ieColaborador={ieColaborador} setIeColaborador={setIeColaborador}
                  razao={razao} setRazao={setRazao}
                  rgColaborador={rgColaborador} setRgColaborador={setRgColaborador}
                  orgaoColaborador={orgaoColaborador} setOrgaoColaborador={setOrgaoColaborador}
                  sexoColaborador={sexoColaborador} setSexoColaborador={setSexoColaborador}
                  nascColaborador={nascColaborador} setNascColaborador={setNascColaborador}
                  pisColaborador={pisColaborador} setPisColaborador={setPisColaborador}
                  ctpsColaborador={ctpsColaborador} setCtpsColaborador={setCtpsColaborador}
                  localNascColaborador={localNascColaborador} setLocalNascColaborador={setLocalNascColaborador}
                  estadoCivilColaborador={estadoCivilColaborador} setEstadoCivilColaborador={setEstadoCivilColaborador}
                  cepColaborador={cepColaborador} setCepColaborador={setCepColaborador}
                  enderecoColaborador={enderecoColaborador} setEnderecoColaborador={setEnderecoColaborador}
                  bairroColaborador={bairroColaborador} setBairroColaborador={setBairroColaborador}
                  cidadeColaborador={cidadeColaborador} setCidadeColaborador={setCidadeColaborador}
                  estadoColaborador={estadoColaborador} setEstadoColaborador={setEstadoColaborador}
                  cargoColaborador={cargoColaborador} setCargoColaborador={setCargoColaborador}
                  departamentoColaborador={departamentoColaborador} setDepartamentoColaborador={setDepartamentoColaborador}
                  salarioBaseColaborador={salarioBaseColaborador} setSalarioBaseColaborador={setSalarioBaseColaborador}
                  transporteColaborador={transporteColaborador} setTransporteColaborador={setTransporteColaborador}
                  alimentacaoColaborador={alimentacaoColaborador} setAlimentacaoColaborador={setAlimentacaoColaborador}
                  telefoneColaborador={telefoneColaborador} setTelefoneColaborador={setTelefoneColaborador}
                  celularColaborador={celularColaborador} setCelularColaborador={setCelularColaborador}
                  emailColaborador={emailColaborador} setEmailColaborador={setEmailColaborador}
                  conselhoColaborador={conselhoColaborador} setConselhoColaborador={setConselhoColaborador}
                  registroColaborador={registroColaborador} setRegistroColaborador={setRegistroColaborador}
                  observacaoColaborador={observacaoColaborador} setObservacaoColaborador={setObservacaoColaborador}
                />
              )}

            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-border/40 bg-[#0E131F]/30 flex items-center justify-between shrink-0">
              
              <div>
                {!isCreatingNew && selectedUser && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDeletingUser(selectedUser)}
                    className="h-8.5 px-3 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" /> Excluir Registro
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="h-8.5 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="h-8.5 px-4 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" /> Salvar Ficha & Credenciais
                    </>
                  )}
                </Button>
              </div>

            </div>

          </form>
        )}

      </div>

      {/* Exclusion Confirmation Modal */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => {
        if (!open) setDeletingUser(null);
      }}>
        <DialogContent className="max-w-md border-border/80 bg-[#121826]/95 backdrop-blur-xl">
          <DialogHeader className="pb-3 text-left">
            <DialogTitle className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-500" /> Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              Você está prestes a excluir permanentemente o cadastro de <strong className="text-slate-100 font-bold">{deletingUser?.nome}</strong> do sistema.
            </DialogDescription>
          </DialogHeader>

          {deletingUser?.colaborador && (
            <div className="bg-[#0E1320] p-3 rounded-lg border border-border/40 space-y-2 select-none text-left">
              <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">Atenção</span>
              <p className="text-[10px] text-muted-foreground">
                Este colaborador possui uma ficha cadastral ativa no banco de dados. Deseja excluir a credencial e a ficha cadastral dele simultaneamente?
              </p>
              
              <label className="text-[10px] font-bold text-slate-200 cursor-pointer flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={deletarColaboradorVinculado}
                  onChange={(e) => setDeletarColaboradorVinculado(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span>Excluir também a ficha de colaborador vinculada</span>
              </label>
            </div>
          )}

          <DialogFooter className="pt-2 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setDeletingUser(null)} 
              className="text-xs cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isSubmitLoading}
              onClick={handleDeleteUser}
              className="text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
            >
              {isSubmitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Excluindo...
                </>
              ) : (
                <>
                  Confirmar Exclusão
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
