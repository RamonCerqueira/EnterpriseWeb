"use client";

import React from "react";
import { Key, Shield, Clock, Percent, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PERMISSIONS_LIST, CATEGORIES_LABELS, Permission } from "@/lib/permissions";

interface UserAcessoTabProps {
  nome: string;
  setNome: (v: string) => void;
  usuario: string;
  setUsuario: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  
  activePermCategory: Permission["category"];
  setActivePermCategory: (v: Permission["category"]) => void;
  permSearch: string;
  setPermSearch: (v: string) => void;
  selectedPermissions: Record<string, string>;
  
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

  descMaximo: string;
  setDescMaximo: (v: string) => void;
  descMaximoAtacado: string;
  setDescMaximoAtacado: (v: string) => void;
  descMaximoST: string;
  setDescMaximoST: (v: string) => void;
  totalMaximoCompra: string;
  setTotalMaximoCompra: (v: string) => void;

  tipoPreco: string;
  setTipoPreco: (v: string) => void;
  spool: string;
  setSpool: (v: string) => void;
  compromisso: boolean;
  setCompromisso: (v: boolean) => void;

  email: string;
  setEmail: (v: string) => void;
  emailAlternativo: string;
  setEmailAlternativo: (v: string) => void;

  selectedUser: any;
  handleMakeAdmin: () => void;
  handleClearPermissions: () => void;
  handleSelectAllCategory: () => void;
  handleSetPermissionLevel: (key: string, level: string) => void;
}

export default function UserAcessoTab({
  nome, setNome,
  usuario, setUsuario,
  senha, setSenha,
  role, setRole,
  activePermCategory, setActivePermCategory,
  permSearch, setPermSearch,
  selectedPermissions,
  trabalhoInicio, setTrabalhoInicio,
  trabalhoFim, setTrabalhoFim,
  trabalhoDom, setTrabalhoDom,
  trabalhoSeg, setTrabalhoSeg,
  trabalhoTer, setTrabalhoTer,
  trabalhoQua, setTrabalhoQua,
  trabalhoQui, setTrabalhoQui,
  trabalhoSex, setTrabalhoSex,
  trabalhoSab, setTrabalhoSab,
  descMaximo, setDescMaximo,
  descMaximoAtacado, setDescMaximoAtacado,
  descMaximoST, setDescMaximoST,
  totalMaximoCompra, setTotalMaximoCompra,
  tipoPreco, setTipoPreco,
  spool, setSpool,
  compromisso, setCompromisso,
  email, setEmail,
  emailAlternativo, setEmailAlternativo,
  selectedUser,
  handleMakeAdmin,
  handleClearPermissions,
  handleSelectAllCategory,
  handleSetPermissionLevel
}: UserAcessoTabProps) {

  const filteredPermissions = PERMISSIONS_LIST.filter(
    (p) =>
      p.category === activePermCategory &&
      p.label.toLowerCase().includes(permSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* General account options grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-300 uppercase block">Nome Completo</label>
          <Input 
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="h-8.5 bg-[#0F1420] text-xs border-border"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-300 uppercase block">Usuário Login (Senha)</label>
          <Input 
            placeholder="Ex: joao.silva"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="h-8.5 bg-[#0F1420] text-xs border-border"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-300 uppercase block">Definir Senha</label>
          <Input 
            type="password"
            placeholder={selectedUser ? "Opcional (Nova senha)..." : "Senha de acesso"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="h-8.5 bg-[#0F1420] text-xs border-border"
            required={!selectedUser}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-300 uppercase block">Grupo de Permissões</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-8.5 px-3 rounded bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none"
          >
            <option value="Operador">Operador (Acesso restrito)</option>
            <option value="Administrador">Administrador (Total)</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>
      </div>

      {/* Permissions accordion card */}
      <Card className="bg-[#121826]/40 border border-border/80 text-left overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0E131F]/30 p-3">
          <div>
            <CardTitle className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-400" /> Matriz de Segurança do ERP
            </CardTitle>
            <p className="text-[9px] text-muted-foreground">Selecione o nível (0 a 4) de permissão por módulo operacional.</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <input
              type="text"
              placeholder="Pesquisar módulo..."
              value={permSearch}
              onChange={(e) => setPermSearch(e.target.value)}
              className="h-7 w-36 px-2.5 rounded bg-[#0F1420] border border-border/70 text-[9px] text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleMakeAdmin} className="text-[8.5px] font-bold hover:text-emerald-400 h-7 border-border bg-card cursor-pointer">⚡ Tornar Admin</Button>
            <Button type="button" variant="outline" size="sm" onClick={handleSelectAllCategory} className="text-[8.5px] font-bold hover:text-emerald-400 h-7 border-border bg-card cursor-pointer">✅ Marcar Categoria</Button>
            <Button type="button" variant="outline" size="sm" onClick={handleClearPermissions} className="text-[8.5px] font-bold hover:text-rose-400 h-7 border-border bg-card cursor-pointer">❌ Limpar</Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[220px]">
          
          {/* Left categories list */}
          <div className="lg:col-span-1 border-r border-border/30 bg-[#0E1320]/30 p-1.5 space-y-0.5">
            {Object.entries(CATEGORIES_LABELS).map(([catKey, catLabel]) => (
              <button
                key={catKey}
                type="button"
                onClick={() => setActivePermCategory(catKey as any)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border ${
                  activePermCategory === catKey
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                    : "bg-transparent border-transparent text-muted-foreground hover:text-slate-200"
                }`}
              >
                <span>{catLabel}</span>
                <Badge className="text-[8px] bg-slate-800 text-slate-400 border-border px-1 py-0 h-4">
                  {PERMISSIONS_LIST.filter(p => p.category === catKey).length}
                </Badge>
              </button>
            ))}
          </div>

          {/* Right level 0-4 radio lists */}
          <div className="lg:col-span-4 p-3 max-h-[280px] overflow-y-auto bg-[#121826]/10 scrollbar-thin">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              {filteredPermissions.map((perm) => {
                const activeVal = selectedPermissions[perm.key] || "0";
                return (
                  <div 
                    key={perm.key} 
                    className="bg-[#0E1320]/60 border border-border/40 p-2.5 rounded-xl space-y-2 hover:border-slate-600 transition-all text-left flex flex-col justify-between"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] font-mono text-emerald-400 font-black uppercase tracking-wider">{perm.key}</span>
                      <span className="font-extrabold text-[11px] text-slate-100 leading-tight truncate animate-fade-in" title={perm.label}>{perm.label}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 bg-[#0F1420] border border-border/70 p-0.5 rounded-md w-full max-w-[150px] mx-auto">
                      {["0", "1", "2", "3", "4"].map((level) => (
                        <label 
                          key={level} 
                          className={`flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold cursor-pointer transition-all shrink-0 ${
                            activeVal === level
                              ? "bg-emerald-500 text-black font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                          }`}
                          title={`Nível ${level}`}
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
          </div>

        </div>
      </Card>

      {/* Restrictive configurations grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        
        {/* Horários & Dias */}
        <Card className="bg-[#121826]/40 border border-border/70 p-3.5 space-y-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <Clock className="h-4 w-4" /> Horário & Jornada
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-[8.5px] text-slate-300 block mb-0.5">Início</label>
              <Input value={trabalhoInicio} onChange={(e)=>setTrabalhoInicio(e.target.value)} className="h-8 bg-[#0F1420] text-xs border-border" />
            </div>
            <div>
              <label className="text-[8.5px] text-slate-300 block mb-0.5">Término</label>
              <Input value={trabalhoFim} onChange={(e)=>setTrabalhoFim(e.target.value)} className="h-8 bg-[#0F1420] text-xs border-border" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8.5px] text-slate-300 block font-bold">Dias Semana Permitidos</label>
            <div className="grid grid-cols-4 gap-1 bg-[#0F1420] p-1.5 border border-border/70 rounded text-[8px] font-bold">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoSeg} onChange={(e)=>setTrabalhoSeg(e.target.checked)} /><span>Seg</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoTer} onChange={(e)=>setTrabalhoTer(e.target.checked)} /><span>Ter</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoQua} onChange={(e)=>setTrabalhoQua(e.target.checked)} /><span>Qua</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoQui} onChange={(e)=>setTrabalhoQui(e.target.checked)} /><span>Qui</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoSex} onChange={(e)=>setTrabalhoSex(e.target.checked)} /><span>Sex</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoSab} onChange={(e)=>setTrabalhoSab(e.target.checked)} /><span>Sáb</span></label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={trabalhoDom} onChange={(e)=>setTrabalhoDom(e.target.checked)} /><span>Dom</span></label>
            </div>
          </div>
        </Card>

        {/* Limites de Descontos */}
        <Card className="bg-[#121826]/40 border border-border/70 p-3.5 space-y-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <Percent className="h-4 w-4" /> Margem & Descontos (%)
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-[8.5px] text-slate-300 block mb-0.5">Atacado (%)</label>
              <Input value={descMaximoAtacado} onChange={(e)=>setDescMaximoAtacado(e.target.value)} className="h-8 bg-[#0F1420] text-xs border-border" />
            </div>
            <div>
              <label className="text-[8.5px] text-slate-300 block mb-0.5">Produto ST (%)</label>
              <Input value={descMaximoST} onChange={(e)=>setDescMaximoST(e.target.value)} className="h-8 bg-[#0F1420] text-xs border-border" />
            </div>
          </div>
          <div className="text-[10px]">
            <label className="text-[8.5px] text-slate-300 block mb-0.5">R$ Limite Máx. Compra</label>
            <Input value={totalMaximoCompra} onChange={(e)=>setTotalMaximoCompra(e.target.value)} className="h-8 bg-[#0F1420] text-xs border-border" />
          </div>
        </Card>

        {/* Faturamento, Preços & Impressão */}
        <Card className="bg-[#121826]/40 border border-border/70 p-3.5 space-y-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <Settings className="h-4 w-4" /> Tabela & Dispositivos
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-[8.5px] text-slate-300 block mb-0.5">Tab. Preços</label>
              <select value={tipoPreco} onChange={(e)=>setTipoPreco(e.target.value)} className="w-full h-8 px-2 bg-[#0F1420] border border-border rounded text-xs text-slate-300">
                <option value="2 - Cartão">2 - Cartão</option>
                <option value="1 - À Vista">1 - À Vista</option>
                <option value="3 - Atacado">3 - Atacado</option>
              </select>
            </div>
            <div>
              <label className="text-[8.5px] text-slate-300 block mb-0.5">Impressão Spool</label>
              <select value={spool} onChange={(e)=>setSpool(e.target.value)} className="w-full h-8 px-2 bg-[#0F1420] border border-border rounded text-xs text-slate-300">
                <option value="SPO">SPO - Spooler</option>
                <option value="DIR">DIR - Direto</option>
                <option value="WIN">WIN - Windows</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold pt-1 select-none">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input type="checkbox" checked={compromisso} onChange={(e)=>setCompromisso(e.target.checked)} className="rounded text-emerald-500" />
              <span> Compromissos</span>
            </label>
            <label className="flex items-center gap-1.5 text-slate-300 opacity-60">
              <input type="checkbox" checked disabled className="rounded text-emerald-500" />
              <span> Multi-Empresa</span>
            </label>
          </div>
        </Card>

      </div>

      {/* Cloud Email options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-300 uppercase block">E-mail (Login Principal Cloud)</label>
          <Input placeholder="usuario@cloud.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="h-8.5 bg-[#0F1420] text-xs border-border" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-300 uppercase block">E-mail de Acesso Alternativo</label>
          <Input placeholder="usuario.alt@cloud.com" value={emailAlternativo} onChange={(e)=>setEmailAlternativo(e.target.value)} className="h-8.5 bg-[#0F1420] text-xs border-border" />
        </div>
      </div>

    </div>
  );
}
