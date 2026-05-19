"use client";

import React, { useState } from "react";
import { 
  Users, Search, ShieldAlert, Key, CheckCircle, Loader2, Edit,
  ToggleLeft, ToggleRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PERMISSIONS_LIST, CATEGORIES_LABELS, Permission } from "@/lib/permissions";

interface Step1UserDirectivesProps {
  nome: string;
  setNome: (v: string) => void;
  usuario: string;
  setUsuario: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  inativo: boolean;
  setInativo: (v: boolean) => void;
  compromisso: boolean;
  setCompromisso: (v: boolean) => void;
  descMaximo: string;
  setDescMaximo: (v: string) => void;
  descMaximoAtacado: string;
  setDescMaximoAtacado: (v: string) => void;
  descMaximoST: string;
  setDescMaximoST: (v: string) => void;
  totalMaximoCompra: string;
  setTotalMaximoCompra: (v: string) => void;
  trabalhoInicio: string;
  setTrabalhoInicio: (v: string) => void;
  trabalhoFim: string;
  setTrabalhoFim: (v: string) => void;
  trabalhoDom: boolean;
  setTrabalhoDom: (v: boolean) => void;
  trabalhoSeg: boolean;
  setTrabalhoSeg: (v: boolean) => void;
  trabalhoTer: boolean;
  setTrabalhoTer: (v: boolean) => void;
  trabalhoQua: boolean;
  setTrabalhoQua: (v: boolean) => void;
  trabalhoQui: boolean;
  setTrabalhoQui: (v: boolean) => void;
  trabalhoSex: boolean;
  setTrabalhoSex: (v: boolean) => void;
  trabalhoSab: boolean;
  setTrabalhoSab: (v: boolean) => void;
  emailAlternativo: string;
  setEmailAlternativo: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  spool: string;
  setSpool: (v: string) => void;
  tipoPreco: string;
  setTipoPreco: (v: string) => void;
  selectedPermissions: Record<string, string>;
  setSelectedPermissions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  editingUser: any;
  users: any[];
  loadUserForEdit: (u: any) => void;
  resetForm: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitLoading: boolean;
}

export default function Step1UserDirectives({
  nome, setNome,
  usuario, setUsuario,
  senha, setSenha,
  role, setRole,
  inativo, setInativo,
  compromisso, setCompromisso,
  descMaximo, setDescMaximo,
  descMaximoAtacado, setDescMaximoAtacado,
  descMaximoST, setDescMaximoST,
  totalMaximoCompra, setTotalMaximoCompra,
  trabalhoInicio, setTrabalhoInicio,
  trabalhoFim, setTrabalhoFim,
  trabalhoDom, setTrabalhoDom,
  trabalhoSeg, setTrabalhoSeg,
  trabalhoTer, setTrabalhoTer,
  trabalhoQua, setTrabalhoQua,
  trabalhoQui, setTrabalhoQui,
  trabalhoSex, setTrabalhoSex,
  trabalhoSab, setTrabalhoSab,
  emailAlternativo, setEmailAlternativo,
  email, setEmail,
  spool, setSpool,
  tipoPreco, setTipoPreco,
  selectedPermissions, setSelectedPermissions,
  editingUser,
  users,
  loadUserForEdit,
  resetForm,
  onSubmit,
  isSubmitLoading
}: Step1UserDirectivesProps) {
  const [activeCategory, setActiveCategory] = useState<Permission["category"]>("vendas");
  const [permissionFilter, setPermissionFilter] = useState("");

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
    PERMISSIONS_LIST.filter((p) => p.category === activeCategory).forEach((p) => {
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

  const activePermsCount = Object.values(selectedPermissions).filter(v => v !== "0" && v !== "N" && v !== undefined).length;
  const permsPercentage = Math.round((activePermsCount / 105) * 100);

  const filteredPermissions = PERMISSIONS_LIST.filter(
    (p) =>
      p.category === activeCategory &&
      p.label.toLowerCase().includes(permissionFilter.toLowerCase())
  );

  const colSize = Math.ceil(filteredPermissions.length / 4);
  const columns = [
    filteredPermissions.slice(0, colSize),
    filteredPermissions.slice(colSize, colSize * 2),
    filteredPermissions.slice(colSize * 2, colSize * 3),
    filteredPermissions.slice(colSize * 3),
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* TOP 4-CARD PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Selecione o Usuário */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Search className="h-4 w-4" /> Selecione o Usuário
            </CardTitle>
            <CardDescription className="text-[10px]">Escolha uma conta para editar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-300 uppercase block">Usuários do Sistema</label>
              <select
                onChange={(e) => {
                  const selectedVal = e.target.value;
                  if (!selectedVal) {
                    resetForm();
                  } else {
                    const found = users.find(u => u.id.toString() === selectedVal);
                    if (found) loadUserForEdit(found);
                  }
                }}
                value={editingUser?.id || ""}
                className="w-full h-8.5 px-3.5 rounded-md border border-border bg-[#0F1420] text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="">-- [Novo Usuário] --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nome} ({u.usuario})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-300 uppercase block">Alterar Senha</label>
              <Input
                type="password"
                placeholder={editingUser ? "Digite nova senha..." : "Senha secreta"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-8 bg-[#0F1420] text-xs border-border"
                required={!editingUser}
              />
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: Usuários Recentes */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Usuários Recentes
              </CardTitle>
              <CardDescription className="text-[10px]">Últimos logins registrados</CardDescription>
            </div>
            <Badge className="text-[8px] bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Total: {users.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1 scrollbar-none text-[10px]">
              {users.slice(0, 4).map((u) => (
                <div 
                  key={u.id}
                  onClick={() => loadUserForEdit(u)}
                  className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
                    editingUser?.id === u.id
                      ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
                      : "bg-[#0E1320] border-border/50 hover:border-slate-600 text-slate-300"
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Badge className="text-[8px] px-1 py-0 h-4 bg-slate-800 border-border">{u.id}</Badge>
                    <span className="truncate max-w-[100px]">{u.nome.toUpperCase()}</span>
                  </span>
                  <Edit className="h-3 w-3 opacity-60 hover:opacity-100 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: Diretivas de Segurança */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" /> Diretivas de Segurança
            </CardTitle>
            <CardDescription className="text-[10px]">Níveis padrões do sistema</CardDescription>
          </CardHeader>
          <CardContent className="text-[9px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-600 inline-block shrink-0"></span><span>0 = Sem acesso à opção</span></div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block shrink-0"></span><span>1 = Somente consultas</span></div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block shrink-0"></span><span>2 = Altera e inclui registros</span></div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block shrink-0"></span><span>3 = Executa componentes adicionais</span></div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500 inline-block shrink-0"></span><span>4 = Deletar/Acesso completo</span></div>
          </CardContent>
        </Card>

        {/* CARD 4: Resumo de Permissões */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl">
          <CardContent className="pt-4 flex items-center justify-between gap-4">
            <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
              <svg className="h-full w-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#10B981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={200}
                  strokeDashoffset={200 - (200 * permsPercentage) / 100}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-extrabold text-slate-100 font-mono block">{permsPercentage}%</span>
                <span className="text-[7px] text-muted-foreground uppercase font-bold">Ativas</span>
              </div>
            </div>

            <div className="text-left space-y-1.5">
              <div className="text-[9px] text-muted-foreground uppercase font-bold">Resumo de Acessos</div>
              <div className="font-mono text-xs text-slate-200">
                <span className="text-emerald-400 font-extrabold">{activePermsCount}</span> / <span className="text-slate-400">105</span>
              </div>
              <div className="text-[8px] text-muted-foreground">Operadores de Segurança</div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* SYSTEM MODULES PERMISSIONS MATRIX */}
      <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl">
        <CardHeader className="pb-3 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0E131F]/30">
          <div>
            <CardTitle className="text-sm font-bold text-slate-200">Módulos do Sistema</CardTitle>
            <p className="text-[10px] text-muted-foreground">Configure os níveis de permissão por módulo e funcionalidade.</p>
          </div>

          {/* Accelerators */}
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Buscar módulo..."
              value={permissionFilter}
              onChange={(e) => setPermissionFilter(e.target.value)}
              className="h-8 w-44 px-3 rounded-lg bg-[#0F1420] border border-border/70 text-[10px] text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMakeAdmin}
              className="text-[9px] font-bold hover:text-emerald-400 h-8 border-border bg-card cursor-pointer"
            >
              🚀 Tornar Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAllCategory}
              className="text-[9px] font-bold hover:text-emerald-400 h-8 border-border bg-card cursor-pointer"
            >
              ✅ Marcar Categoria
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearPermissions}
              className="text-[9px] font-bold hover:text-rose-400 h-8 border-border bg-card cursor-pointer"
            >
              ❌ Limpar tudo
            </Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[300px] overflow-hidden">
          
          {/* Category selector column */}
          <div className="lg:col-span-1 border-r border-border/40 bg-[#0E1320]/45 p-2 space-y-1">
            {Object.entries(CATEGORIES_LABELS).map(([catKey, catLabel]) => (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategory(catKey as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border ${
                  activeCategory === catKey
                    ? "bg-emerald-950/20 border-emerald-500/35 text-emerald-400"
                    : "bg-transparent border-transparent text-muted-foreground hover:text-slate-200"
                }`}
              >
                <span>{catLabel}</span>
                <Badge className="text-[8px] bg-slate-800 text-slate-400 border-border">
                  {PERMISSIONS_LIST.filter(p => p.category === catKey).length}
                </Badge>
              </button>
            ))}
          </div>

          {/* 4-Column Access level radio matrix */}
          <div className="lg:col-span-4 p-4 max-h-[350px] overflow-y-auto bg-[#121826]/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {columns.map((colPerms, colIdx) => (
                <div key={colIdx} className="space-y-4">
                  {colPerms.map((perm) => {
                    const activeVal = selectedPermissions[perm.key] || "0";
                    return (
                      <div 
                        key={perm.key} 
                        className="bg-[#0E1320]/50 border border-border/40 p-2.5 rounded-xl space-y-2 hover:border-slate-700 transition-all text-[10px]"
                      >
                        <div className="flex flex-col">
                          <span className="text-[7.5px] font-mono text-emerald-400 font-extrabold uppercase">{perm.key}</span>
                          <span className="font-extrabold text-slate-200 truncate" title={perm.label}>{perm.label}</span>
                        </div>

                        {/* Radio selector group (Levels 0, 1, 2, 3, 4) */}
                        <div className="flex items-center justify-between bg-[#0F1420] border border-border/70 p-1 rounded-lg">
                          {["0", "1", "2", "3", "4"].map((level) => (
                            <label 
                              key={level} 
                              className={`flex items-center justify-center h-5 w-5 rounded-md text-[9px] font-bold cursor-pointer transition-all ${
                                activeVal === level
                                  ? "bg-emerald-500 text-black font-extrabold"
                                  : "text-muted-foreground hover:text-slate-200 hover:bg-slate-800"
                              }`}
                              title={`Acesso nível ${level}`}
                            >
                              <input
                                type="radio"
                                name={`perm-${perm.key}`}
                                value={level}
                                checked={activeVal === level}
                                onChange={() => handleSetPermissionLevel(perm.key, level)}
                                className="sr-only"
                              />
                              {level}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

        </div>
      </Card>

      {/* BOTTOM GENERAL CONFIGURATION PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* CARD 1: Configurações Adicionais */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl p-4 space-y-3.5">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Configurações Adicionais</span>
          
          <div className="space-y-1 text-[10px]">
            <label className="text-slate-300 font-bold block">Horário de Utilização</label>
            <div className="flex items-center gap-1.5">
              <Input 
                placeholder="08:00" 
                value={trabalhoInicio} 
                onChange={(e) => setTrabalhoInicio(e.target.value)} 
                className="h-8 bg-[#0F1420] text-xs" 
              />
              <span className="text-muted-foreground">até</span>
              <Input 
                placeholder="18:00" 
                value={trabalhoFim} 
                onChange={(e) => setTrabalhoFim(e.target.value)} 
                className="h-8 bg-[#0F1420] text-xs" 
              />
            </div>
          </div>

          {/* Days Checkbox */}
          <div className="space-y-1 text-[9px]">
            <label className="text-slate-300 font-bold block">Dias da Semana Permitidos</label>
            <div className="grid grid-cols-3 gap-1 bg-[#0F1420] p-2 border border-border/80 rounded-lg">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoSeg} onChange={(e)=>setTrabalhoSeg(e.target.checked)} className="rounded" /><span>Seg</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoTer} onChange={(e)=>setTrabalhoTer(e.target.checked)} className="rounded" /><span>Ter</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoQua} onChange={(e)=>setTrabalhoQua(e.target.checked)} className="rounded" /><span>Qua</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoQui} onChange={(e)=>setTrabalhoQui(e.target.checked)} className="rounded" /><span>Qui</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoSex} onChange={(e)=>setTrabalhoSex(e.target.checked)} className="rounded" /><span>Sex</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoSab} onChange={(e)=>setTrabalhoSab(e.target.checked)} className="rounded" /><span>Sáb</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoDom} onChange={(e)=>setTrabalhoDom(e.target.checked)} className="rounded" /><span>Dom</span></label>
            </div>
          </div>
        </Card>

        {/* CARD 2: Desconto Máximo (%) */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl p-4 space-y-3 text-[10px]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Desconto Máximo (%)</span>
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Atacadista Varejo (%)</label>
            <Input 
              placeholder="10.00" 
              value={descMaximoAtacado} 
              onChange={(e) => setDescMaximoAtacado(e.target.value)} 
              className="h-8 bg-[#0F1420] text-xs" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Produto ST (%)</label>
            <Input 
              placeholder="10.00" 
              value={descMaximoST} 
              onChange={(e) => setDescMaximoST(e.target.value)} 
              className="h-8 bg-[#0F1420] text-xs" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">R$ Máx. Compra</label>
            <Input 
              placeholder="5000.00" 
              value={totalMaximoCompra} 
              onChange={(e) => setTotalMaximoCompra(e.target.value)} 
              className="h-8 bg-[#0F1420] text-xs" 
            />
          </div>
        </Card>

        {/* CARD 3: Outras Informações */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl p-4 space-y-4 text-[10px]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Outras Informações</span>
          
          <div className="flex items-center justify-between">
            <span>Visualizar compromisso ao abrir</span>
            <button
              type="button"
              onClick={() => setCompromisso(!compromisso)}
              className="cursor-pointer shrink-0"
            >
              {compromisso ? <ToggleRight className="h-6 w-6 text-emerald-400" /> : <ToggleLeft className="h-6 w-6 text-slate-500" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span>Acessar todas as empresas</span>
            <ToggleRight className="h-6 w-6 text-emerald-400 opacity-60" />
          </div>

          <div className="flex items-center justify-between">
            <span>Visualizar somente os meus</span>
            <ToggleLeft className="h-6 w-6 text-slate-600 opacity-60" />
          </div>
        </Card>

        {/* CARD 4: Configurações de Preços */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl p-4 space-y-3 text-[10px]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Configuração de Preços</span>
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Tabela de Preços</label>
            <select
              value={tipoPreco}
              onChange={(e) => setTipoPreco(e.target.value)}
              className="w-full h-8 px-2 rounded bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none"
            >
              <option value="2 - Cartão">2 - Cartão</option>
              <option value="1 - À Vista">1 - À Vista</option>
              <option value="3 - Atacado">3 - Atacado</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">PDV (NFC-e)</label>
            <Input 
              placeholder="PDV1" 
              className="h-8 bg-[#0F1420] text-xs border-border" 
              disabled 
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Spool / Impressão</label>
            <select
              value={spool}
              onChange={(e) => setSpool(e.target.value)}
              className="w-full h-8 px-2 rounded bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none"
            >
              <option value="SPO">SPO - Spooler</option>
              <option value="DIR">DIR - Direto</option>
              <option value="WIN">WIN - Windows Printer</option>
            </select>
          </div>
        </Card>

        {/* CARD 5: E-mail / Acesso */}
        <Card className="bg-[#121826]/75 border border-border/80 backdrop-blur-xl p-4 space-y-3 text-[10px]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">E-mail / Acesso</span>
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Nome Completo</label>
            <Input 
              placeholder="Ex: RAMON SILVA" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              className="h-8 bg-[#0F1420] text-xs border-border" 
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">E-mail (Login Cloud)</label>
            <Input 
              placeholder="usuario@empresa.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="h-8 bg-[#0F1420] text-xs border-border" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">E-mail Alternativo</label>
            <Input 
              placeholder="usuario.alt@empresa.com" 
              value={emailAlternativo} 
              onChange={(e) => setEmailAlternativo(e.target.value)} 
              className="h-8 bg-[#0F1420] text-xs border-border" 
            />
          </div>
        </Card>

      </div>

      {/* SYSTEM BUTTON ACTION FOOTER */}
      <div className="flex items-center justify-between border-t border-border/40 pt-4 bg-[#121826]/30 p-4 rounded-xl border">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {editingUser ? (
            <span>Editando Usuário: <strong className="text-emerald-400">@{usuario}</strong> (ID: {editingUser.id})</span>
          ) : (
            <span>Criando novo registro em branco no sistema</span>
          )}
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
                <CheckCircle className="h-4 w-4" /> {editingUser ? "Salvar e Avançar" : "Salvar e Continuar para Colaborador"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
