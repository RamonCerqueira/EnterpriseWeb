"use client";

import React, { useState } from "react";
import { 
  Users, Briefcase, Mail, Phone, Edit, CheckCircle, Loader2, Key, Download, FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Step2CollaboratorFormProps {
  nome: string;
  usuario: string;
  email: string;
  telefone: string;
  inativo: boolean;
  editingUser: any;
  users: any[];
  loadUserForEdit: (u: any) => void;
  resetForm: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitLoading: boolean;
  setCurrentStep: (step: "user" | "collaborator") => void;

  tipoColaborador: "F" | "J";
  setTipoColaborador: (v: "F" | "J") => void;
  razao: string;
  setRazao: (v: string) => void;
  cpfColaborador: string;
  setCpfColaborador: (v: string) => void;
  rgColaborador: string;
  setRgColaborador: (v: string) => void;
  orgaoColaborador: string;
  setOrgaoColaborador: (v: string) => void;
  cnpjColaborador: string;
  setCnpjColaborador: (v: string) => void;
  ieColaborador: string;
  setIeColaborador: (v: string) => void;
  imColaborador: string;
  setImColaborador: (v: string) => void;
  cargoColaborador: string;
  setCargoColaborador: (v: string) => void;
  departamentoColaborador: string;
  setDepartamentoColaborador: (v: string) => void;
  enderecoColaborador: string;
  setEnderecoColaborador: (v: string) => void;
  bairroColaborador: string;
  setBairroColaborador: (v: string) => void;
  cidadeColaborador: string;
  setCidadeColaborador: (v: string) => void;
  estadoColaborador: string;
  setEstadoColaborador: (v: string) => void;
  cepColaborador: string;
  setCepColaborador: (v: string) => void;
  emailColaborador: string;
  setEmailColaborador: (v: string) => void;
  siteColaborador: string;
  setSiteColaborador: (v: string) => void;
  telefoneColaborador: string;
  setTelefoneColaborador: (v: string) => void;
  celularColaborador: string;
  setCelularColaborador: (v: string) => void;
  pisColaborador: string;
  setPisColaborador: (v: string) => void;
  ctpsColaborador: string;
  setCtpsColaborador: (v: string) => void;
  localNascColaborador: string;
  setLocalNascColaborador: (v: string) => void;
  estadoCivilColaborador: string;
  setEstadoCivilColaborador: (v: string) => void;
  filiacaoPaiColaborador: string;
  setFiliacaoPaiColaborador: (v: string) => void;
  filiacaoMaeColaborador: string;
  setFiliacaoMaeColaborador: (v: string) => void;
  emissaoRgColaborador: string;
  setEmissaoRgColaborador: (v: string) => void;
  nascColaborador: string;
  setNascColaborador: (v: string) => void;
  grauInstrucaoColaborador: string;
  setGrauInstrucaoColaborador: (v: string) => void;
  sexoColaborador: "M" | "F";
  setSexoColaborador: (v: "M" | "F") => void;
  observacaoColaborador: string;
  setObservacaoColaborador: (v: string) => void;
  salarioBaseColaborador: string;
  setSalarioBaseColaborador: (v: string) => void;
  alimentacaoColaborador: string;
  setAlimentacaoColaborador: (v: string) => void;
  transporteColaborador: string;
  setTransporteColaborador: (v: string) => void;
  chaveColaborador: string;
  setChaveColaborador: (v: string) => void;
  registroColaborador: string;
  setRegistroColaborador: (v: string) => void;
  conselhoColaborador: string;
  setConselhoColaborador: (v: string) => void;
  situacaoColaborador: string;
  setSituacaoColaborador: (v: string) => void;
  vencimentoColaborador: string;
  setVencimentoColaborador: (v: string) => void;
}

export default function Step2CollaboratorForm({
  nome, usuario, email, telefone, inativo,
  editingUser,
  users,
  loadUserForEdit,
  resetForm,
  onSubmit,
  isSubmitLoading,
  setCurrentStep,

  tipoColaborador, setTipoColaborador,
  razao, setRazao,
  cpfColaborador, setCpfColaborador,
  rgColaborador, setRgColaborador,
  orgaoColaborador, setOrgaoColaborador,
  cnpjColaborador, setCnpjColaborador,
  ieColaborador, setIeColaborador,
  imColaborador, setImColaborador,
  cargoColaborador, setCargoColaborador,
  departamentoColaborador, setDepartamentoColaborador,
  enderecoColaborador, setEnderecoColaborador,
  bairroColaborador, setBairroColaborador,
  cidadeColaborador, setCidadeColaborador,
  estadoColaborador, setEstadoColaborador,
  cepColaborador, setCepColaborador,
  emailColaborador, setEmailColaborador,
  siteColaborador, setSiteColaborador,
  telefoneColaborador, setTelefoneColaborador,
  celularColaborador, setCelularColaborador,
  pisColaborador, setPisColaborador,
  ctpsColaborador, setCtpsColaborador,
  localNascColaborador, setLocalNascColaborador,
  estadoCivilColaborador, setEstadoCivilColaborador,
  filiacaoPaiColaborador, setFiliacaoPaiColaborador,
  filiacaoMaeColaborador, setFiliacaoMaeColaborador,
  emissaoRgColaborador, setEmissaoRgColaborador,
  nascColaborador, setNascColaborador,
  grauInstrucaoColaborador, setGrauInstrucaoColaborador,
  sexoColaborador, setSexoColaborador,
  observacaoColaborador, setObservacaoColaborador,
  salarioBaseColaborador, setSalarioBaseColaborador,
  alimentacaoColaborador, setAlimentacaoColaborador,
  transporteColaborador, setTransporteColaborador,
  chaveColaborador, setChaveColaborador,
  registroColaborador, setRegistroColaborador,
  conselhoColaborador, setConselhoColaborador,
  situacaoColaborador, setSituacaoColaborador,
  vencimentoColaborador, setVencimentoColaborador
}: Step2CollaboratorFormProps) {
  const [colSearch, setColSearch] = useState("");
  const [activeSubTabStep2, setActiveSubTabStep2] = useState<"dados" | "web" | "obs">("dados");

  const collaboratorsList = users.filter(u => u.colaborador !== null);
  const filteredCollaborators = collaboratorsList.filter(
    (u) =>
      u.nome.toLowerCase().includes(colSearch.toLowerCase()) ||
      u.colaborador?.cargo?.toLowerCase().includes(colSearch.toLowerCase())
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      {/* STEP 2 TOP DUAL-CARD ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* Top Left Card: Código & Nome */}
        <Card className="lg:col-span-2 bg-[#121826]/75 border border-border/80 backdrop-blur-xl p-4 space-y-3.5">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">1. Vínculo de Credencial</span>
          
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="col-span-1 space-y-1">
              <label className="text-slate-300 font-bold block">Código</label>
              <Input 
                value={editingUser?.id || "N/A"} 
                className="h-8 bg-[#0E1320] border-border/70 text-slate-300 font-mono text-center font-bold" 
                disabled 
              />
            </div>
            <div className="col-span-2 flex items-center justify-end pt-5 text-[9px] font-extrabold uppercase">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 bg-[#0E1320] p-1.5 px-2.5 rounded-lg border border-border/70">
                <input 
                  type="checkbox" 
                  checked={situacaoColaborador === "I"} 
                  onChange={(e) => setSituacaoColaborador(e.target.checked ? "I" : "A")}
                  className="rounded text-rose-500" 
                />
                <span className={situacaoColaborador === "I" ? "text-rose-400" : ""}>Inativo</span>
              </label>
            </div>
          </div>

          <div className="space-y-1 text-[10px]">
            <label className="text-slate-300 font-bold block">Nome Completo / Razão Social *</label>
            <Input 
              placeholder="Nome do colaborador"
              value={razao || nome} 
              onChange={(e) => setRazao(e.target.value)} 
              className="h-8 bg-[#0F1420] border-border/70 text-xs font-semibold"
              required
            />
          </div>

          {/* Photo Area placeholder */}
          <div className="border border-dashed border-border/70 rounded-xl p-3.5 flex flex-col items-center justify-center gap-1 bg-[#0E1320]/40 text-muted-foreground">
            <Users className="h-5 w-5 text-slate-500" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Carregar Foto do Colaborador</span>
          </div>
        </Card>

        {/* Top Right Card: Colaboradores Cadastrados */}
        <Card className="lg:col-span-3 bg-[#121826]/75 border border-border/80 backdrop-blur-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Colaboradores Cadastrados</span>
                <span className="text-[9px] text-muted-foreground">Selecione para ver detalhes e editar dados de equipe</span>
              </div>
              
              {/* Filter / Search input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  value={colSearch}
                  onChange={(e) => setColSearch(e.target.value)}
                  className="h-7 w-32 px-2 rounded bg-[#0F1420] border border-border text-[9px] text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Table list */}
            <div className="max-h-[110px] overflow-y-auto text-[10px] pr-1 mt-2 scrollbar-none">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-border/30 bg-[#0F1420]/30 font-mono text-[9px]">
                    <th className="p-1 pl-2">Código</th>
                    <th className="p-1">Colaborador</th>
                    <th className="p-1">CPF/CNPJ</th>
                    <th className="p-1">Cargo</th>
                    <th className="p-1 text-right pr-2">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-slate-300">
                  {filteredCollaborators.map(u => (
                    <tr 
                      key={u.id}
                      onClick={() => loadUserForEdit(u)}
                      className={`hover:bg-[#1C2538]/40 transition-all cursor-pointer ${
                        editingUser?.id === u.id
                          ? "bg-emerald-950/25 text-emerald-400"
                          : ""
                      }`}
                    >
                      <td className="p-1.5 pl-2 font-mono">{u.colaborador?.id || u.id}</td>
                      <td className="p-1.5 font-bold">{u.nome}</td>
                      <td className="p-1.5 font-mono text-[9px]">{u.colaborador?.cpf || u.colaborador?.cnpj || "N/D"}</td>
                      <td className="p-1.5">{u.colaborador?.cargo || "Operador"}</td>
                      <td className="p-1.5 text-right pr-2">
                        <Edit className="h-3.5 w-3.5 inline-block text-emerald-400 opacity-80" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table tools */}
          <div className="flex items-center justify-end gap-1.5 border-t border-border/30 pt-2 text-[9px] font-bold text-muted-foreground uppercase mt-2">
            <Button type="button" variant="ghost" className="h-6 px-2 text-[8px] flex items-center gap-1 cursor-pointer"><Download className="h-3 w-3" /> CSV</Button>
            <Button type="button" variant="ghost" className="h-6 px-2 text-[8px] flex items-center gap-1 cursor-pointer"><FileText className="h-3 w-3" /> Excel</Button>
          </div>
        </Card>

      </div>

      {/* STEP 2 MAIN FORM WORKSPACE WITH SUBTABS */}
      <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl overflow-hidden">
        {/* Sub-tab selection nav */}
        <div className="flex border-b border-border/40 bg-[#0E131F]/50 text-[10px] font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveSubTabStep2("dados")}
            className={`px-5 py-3 border-r border-border/40 cursor-pointer transition-all ${
              activeSubTabStep2 === "dados"
                ? "bg-[#121826] text-emerald-400 border-b-2 border-b-emerald-500"
                : "text-muted-foreground hover:text-slate-200"
            }`}
          >
            Dados Principais & Profissionais
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTabStep2("web")}
            className={`px-5 py-3 border-r border-border/40 cursor-pointer transition-all ${
              activeSubTabStep2 === "web"
                ? "bg-[#121826] text-emerald-400 border-b-2 border-b-emerald-500"
                : "text-muted-foreground hover:text-slate-200"
            }`}
          >
            Configurações Web & Bancárias
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTabStep2("obs")}
            className={`px-5 py-3 border-r border-border/40 cursor-pointer transition-all ${
              activeSubTabStep2 === "obs"
                ? "bg-[#121826] text-emerald-400 border-b-2 border-b-emerald-500"
                : "text-muted-foreground hover:text-slate-200"
            }`}
          >
            Observações Adicionais
          </button>
        </div>

        <CardContent className="p-5 text-[10px]">
          
          {/* SUBTAB 1: DADOS PRINCIPAIS */}
          {activeSubTabStep2 === "dados" && (
            <div className="space-y-5 animate-fade-in text-slate-300">
              
              {/* Row 1: Tipo & CPF/CNPJ */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Tipo de Registro</label>
                  <div className="flex items-center gap-4 bg-[#0F1420] border border-border/70 rounded-md p-1.5 h-8.5 select-none">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="tipoCol" 
                        checked={tipoColaborador === "F"} 
                        onChange={() => setTipoColaborador("F")} 
                        className="text-emerald-500" 
                      />
                      <span>Física</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="tipoCol" 
                        checked={tipoColaborador === "J"} 
                        onChange={() => setTipoColaborador("J")} 
                        className="text-emerald-500" 
                      />
                      <span>Jurídica</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">{tipoColaborador === "F" ? "CPF" : "CNPJ"}</label>
                  <Input 
                    placeholder={tipoColaborador === "F" ? "000.000.000-00" : "00.000.000/0000-00"} 
                    value={tipoColaborador === "F" ? cpfColaborador : cnpjColaborador} 
                    onChange={(e) => tipoColaborador === "F" ? setCpfColaborador(e.target.value) : setCnpjColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Inscrição Estadual (I.E)</label>
                  <Input 
                    placeholder="ISENTO" 
                    value={ieColaborador} 
                    onChange={(e) => setIeColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Inscrição Municipal (I.M)</label>
                  <Input 
                    placeholder="N/A" 
                    value={imColaborador} 
                    onChange={(e) => setImColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>
              </div>

              {/* Row 2: RG, Orgão, Sexo, Birth */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">R.G.</label>
                  <Input 
                    placeholder="00.000.000-0" 
                    value={rgColaborador} 
                    onChange={(e) => setRgColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Emissão RG</label>
                  <Input 
                    type="date"
                    value={emissaoRgColaborador} 
                    onChange={(e) => setEmissaoRgColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border/80" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Sexo</label>
                  <div className="flex items-center gap-4 bg-[#0F1420] border border-border/70 rounded-md p-1.5 h-8.5 select-none">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="sexCol" 
                        checked={sexoColaborador === "M"} 
                        onChange={() => setSexoColaborador("M")} 
                      />
                      <span>Masculino</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="sexCol" 
                        checked={sexoColaborador === "F"} 
                        onChange={() => setSexoColaborador("F")} 
                      />
                      <span>Feminino</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Data de Nascimento</label>
                  <Input 
                    type="date"
                    value={nascColaborador} 
                    onChange={(e) => setNascColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border/80" 
                  />
                </div>
              </div>

              {/* Row 3: PIS, CTPS, Birthplace, State */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">P.I.S / PASEP</label>
                  <Input 
                    placeholder="000.00000.00-0" 
                    value={pisColaborador} 
                    onChange={(e) => setPisColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">C.T.P.S / Série</label>
                  <Input 
                    placeholder="Ex: 12345 / 0001" 
                    value={ctpsColaborador} 
                    onChange={(e) => setCtpsColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Naturalidade</label>
                  <Input 
                    placeholder="Ex: São Paulo - SP" 
                    value={localNascColaborador} 
                    onChange={(e) => setLocalNascColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Estado Civil</label>
                  <select
                    value={estadoCivilColaborador}
                    onChange={(e) => setEstadoCivilColaborador(e.target.value)}
                    className="w-full h-8.5 px-2.5 rounded bg-[#0F1420] border border-border text-xs text-slate-200"
                  >
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: CEP, Endereço, Bairro, Cidade, UF */}
              <div className="border-t border-border/30 pt-4 space-y-3.5">
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Endereço de Residência</span>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">CEP</label>
                    <Input 
                      placeholder="01234-567" 
                      value={cepColaborador} 
                      onChange={(e) => setCepColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-300 font-bold block">Endereço Completo</label>
                    <Input 
                      placeholder="Ex: Rua das Palmeiras" 
                      value={enderecoColaborador} 
                      onChange={(e) => setEnderecoColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Bairro</label>
                    <Input 
                      placeholder="Ex: Centro" 
                      value={bairroColaborador} 
                      onChange={(e) => setBairroColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Município</label>
                    <Input 
                      placeholder="Ex: São Paulo" 
                      value={cidadeColaborador} 
                      onChange={(e) => setCidadeColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">UF</label>
                    <Input 
                      placeholder="SP" 
                      value={estadoColaborador} 
                      onChange={(e) => setEstadoColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: WhatsApp, Cargo, Salario, Comissoes */}
              <div className="border-t border-border/30 pt-4 space-y-3.5">
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block">Informações de Cargo & Remuneração</span>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Cargo</label>
                    <Input 
                      value={cargoColaborador} 
                      onChange={(e) => setCargoColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Departamento</label>
                    <Input 
                      value={departamentoColaborador} 
                      onChange={(e) => setDepartamentoColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Salário Base (R$)</label>
                    <Input 
                      placeholder="5000.00" 
                      value={salarioBaseColaborador} 
                      onChange={(e) => setSalarioBaseColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Comissão (%)</label>
                    <Input 
                      placeholder="5.00" 
                      value={transporteColaborador} 
                      onChange={(e) => setTransporteColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Comissão em Dupla (%)</label>
                    <Input 
                      placeholder="2.50" 
                      value={alimentacaoColaborador} 
                      onChange={(e) => setAlimentacaoColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Pagamento após (Dias)</label>
                    <Input 
                      placeholder="30" 
                      value={vencimentoColaborador} 
                      onChange={(e) => setVencimentoColaborador(e.target.value)} 
                      className="h-8 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SUBTAB 2: CONFIGURACOES WEB & BANCARIAS */}
          {activeSubTabStep2 === "web" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in text-slate-300">
              
              {/* Left Column: Web services */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Serviços Web</span>
                
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Site Oficial / Portfólio</label>
                  <Input 
                    placeholder="www.empresax.com.br" 
                    value={siteColaborador} 
                    onChange={(e) => setSiteColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">E-mail Corporativo</label>
                  <Input 
                    placeholder="contato@empresa.com" 
                    value={emailColaborador} 
                    onChange={(e) => setEmailColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1">
                    <label className="text-slate-300 font-bold block">Conselho Profissional</label>
                    <select
                      value={conselhoColaborador}
                      onChange={(e) => setConselhoColaborador(e.target.value)}
                      className="w-full h-8 px-2 rounded bg-[#0F1420] border border-border text-xs text-slate-200"
                    >
                      <option value="CRC">CRC</option>
                      <option value="CREA">CREA</option>
                      <option value="OAB">OAB</option>
                      <option value="CRM">CRM</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-slate-300 font-bold block">Registro do Conselho</label>
                    <Input 
                      placeholder="123456/O-0" 
                      value={registroColaborador} 
                      onChange={(e) => setRegistroColaborador(e.target.value)} 
                      className="h-8.5 bg-[#0F1420] text-xs border-border" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Chave de Segurança Web</label>
                  <Input 
                    placeholder="ABC123456" 
                    value={chaveColaborador} 
                    onChange={(e) => setChaveColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>
              </div>

              {/* Right Column: Contact & Bank details placeholders */}
              <div className="space-y-3.5 border-l border-border/30 pl-6">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Contatos de Emergência & Pix</span>
                
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Telefone Comercial / Ramal</label>
                  <Input 
                    placeholder="(11) 98888-7777" 
                    value={telefoneColaborador} 
                    onChange={(e) => setTelefoneColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">WhatsApp Celular</label>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    value={celularColaborador} 
                    onChange={(e) => setCelularColaborador(e.target.value)} 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Chave PIX para Pagamentos</label>
                  <Input 
                    placeholder="Ex: CPF, E-mail ou Celular" 
                    className="h-8.5 bg-[#0F1420] text-xs border-border" 
                    disabled
                  />
                </div>

                <div className="border border-border/80 rounded-xl p-3 bg-[#0F1420]/40 flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>Configurações Bancárias Homologadas</span>
                  <Badge className="text-[8px] bg-slate-800 border-border">Pendente</Badge>
                </div>
              </div>

            </div>
          )}

          {/* SUBTAB 3: OBSERVACOES ADICIONAIS */}
          {activeSubTabStep2 === "obs" && (
            <div className="space-y-4 animate-fade-in text-slate-300">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Observações do Histórico de Contratação</label>
                <textarea
                  placeholder="Digite observações sobre o colaborador, feedbacks, pendências de documentos, etc..."
                  rows={5}
                  value={observacaoColaborador}
                  onChange={(e) => setObservacaoColaborador(e.target.value)}
                  className="w-full bg-[#0F1420] border border-border/70 rounded-lg p-3 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-slate-200"
                ></textarea>
              </div>

              {/* Drop zone mockup for attachments */}
              <div className="border-2 border-dashed border-border/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#0E1320]/30 text-muted-foreground select-none">
                <Users className="h-6 w-6 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Carregar Contrato / Assinatura Digital</span>
                <span className="text-[9px]">Arraste ou selecione arquivos PDF, PNG ou JPG (máx 2MB)</span>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* STEP 2 FOOTER ACTIONS */}
      <div className="flex items-center justify-between border-t border-border/40 pt-4 bg-[#121826]/30 p-4 rounded-xl border">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <button 
            type="button" 
            onClick={() => setCurrentStep("user")} 
            className="flex items-center gap-1 hover:text-emerald-400 font-bold transition-all shrink-0 cursor-pointer text-slate-300"
          >
            <Key className="h-4 w-4 shrink-0 text-slate-400" /> Voltar para Diretivas
          </button>
          <span className="text-muted-foreground/60">|</span>
          <span>Vinculado a: <strong className="text-emerald-400">@{usuario}</strong> (ID: {editingUser?.id})</span>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="text-xs font-semibold h-9 cursor-pointer"
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitLoading}
            className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.15)] flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" /> Salvar Colaborador & Concluir
              </>
            )}
          </Button>
        </div>
      </div>

    </form>
  );
}
