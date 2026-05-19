"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CollaboratorFichaTabProps {
  tipoColaborador: "F" | "J";
  setTipoColaborador: (v: "F" | "J") => void;
  cpfColaborador: string;
  setCpfColaborador: (v: string) => void;
  cnpjColaborador: string;
  setCnpjColaborador: (v: string) => void;
  ieColaborador: string;
  setIeColaborador: (v: string) => void;
  razao: string;
  setRazao: (v: string) => void;
  rgColaborador: string;
  setRgColaborador: (v: string) => void;
  orgaoColaborador: string;
  setOrgaoColaborador: (v: string) => void;
  sexoColaborador: "M" | "F";
  setSexoColaborador: (v: "M" | "F") => void;
  nascColaborador: string;
  setNascColaborador: (v: string) => void;
  pisColaborador: string;
  setPisColaborador: (v: string) => void;
  ctpsColaborador: string;
  setCtpsColaborador: (v: string) => void;
  localNascColaborador: string;
  setLocalNascColaborador: (v: string) => void;
  estadoCivilColaborador: string;
  setEstadoCivilColaborador: (v: string) => void;
  cepColaborador: string;
  setCepColaborador: (v: string) => void;
  enderecoColaborador: string;
  setEnderecoColaborador: (v: string) => void;
  bairroColaborador: string;
  setBairroColaborador: (v: string) => void;
  cidadeColaborador: string;
  setCidadeColaborador: (v: string) => void;
  estadoColaborador: string;
  setEstadoColaborador: (v: string) => void;
  cargoColaborador: string;
  setCargoColaborador: (v: string) => void;
  departamentoColaborador: string;
  setDepartamentoColaborador: (v: string) => void;
  salarioBaseColaborador: string;
  setSalarioBaseColaborador: (v: string) => void;
  transporteColaborador: string;
  setTransporteColaborador: (v: string) => void;
  alimentacaoColaborador: string;
  setAlimentacaoColaborador: (v: string) => void;
  telefoneColaborador: string;
  setTelefoneColaborador: (v: string) => void;
  celularColaborador: string;
  setCelularColaborador: (v: string) => void;
  emailColaborador: string;
  setEmailColaborador: (v: string) => void;
  conselhoColaborador: string;
  setConselhoColaborador: (v: string) => void;
  registroColaborador: string;
  setRegistroColaborador: (v: string) => void;
  observacaoColaborador: string;
  setObservacaoColaborador: (v: string) => void;
}

export default function CollaboratorFichaTab({
  tipoColaborador, setTipoColaborador,
  cpfColaborador, setCpfColaborador,
  cnpjColaborador, setCnpjColaborador,
  ieColaborador, setIeColaborador,
  razao, setRazao,
  rgColaborador, setRgColaborador,
  orgaoColaborador, setOrgaoColaborador,
  sexoColaborador, setSexoColaborador,
  nascColaborador, setNascColaborador,
  pisColaborador, setPisColaborador,
  ctpsColaborador, setCtpsColaborador,
  localNascColaborador, setLocalNascColaborador,
  estadoCivilColaborador, setEstadoCivilColaborador,
  cepColaborador, setCepColaborador,
  enderecoColaborador, setEnderecoColaborador,
  bairroColaborador, setBairroColaborador,
  cidadeColaborador, setCidadeColaborador,
  estadoColaborador, setEstadoColaborador,
  cargoColaborador, setCargoColaborador,
  departamentoColaborador, setDepartamentoColaborador,
  salarioBaseColaborador, setSalarioBaseColaborador,
  transporteColaborador, setTransporteColaborador,
  alimentacaoColaborador, setAlimentacaoColaborador,
  telefoneColaborador, setTelefoneColaborador,
  celularColaborador, setCelularColaborador,
  emailColaborador, setEmailColaborador,
  conselhoColaborador, setConselhoColaborador,
  registroColaborador, setRegistroColaborador,
  observacaoColaborador, setObservacaoColaborador
}: CollaboratorFichaTabProps) {

  return (
    <div className="space-y-6 animate-fade-in text-slate-300 text-left">
      
      {/* Sub-Card 1: Dados Jurídicos e Identidade */}
      <Card className="bg-[#121826]/40 border border-border/80 p-4 space-y-4">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block border-b border-border/40 pb-1.5">
          Ficha de Identificação Cadastral
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-[10px]">
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Personalidade Jurídica</label>
            <div className="flex items-center gap-4 bg-[#0F1420] border border-border/70 rounded-md p-1.5 h-8.5 select-none font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={tipoColaborador === "F"} onChange={()=>setTipoColaborador("F")} />
                <span>Pessoa Física</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={tipoColaborador === "J"} onChange={()=>setTipoColaborador("J")} />
                <span>Pessoa Jurídica</span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">{tipoColaborador === "F" ? "CPF do Colaborador" : "CNPJ da Empresa"}</label>
            <Input 
              placeholder={tipoColaborador === "F" ? "000.000.000-00" : "00.000.000/0000-00"}
              value={tipoColaborador === "F" ? cpfColaborador : cnpjColaborador}
              onChange={(e)=>tipoColaborador === "F" ? setCpfColaborador(e.target.value) : setCnpjColaborador(e.target.value)}
              className="h-8.5 bg-[#0F1420] text-xs border-border"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Inscrição Estadual (I.E)</label>
            <Input value={ieColaborador} onChange={(e)=>setIeColaborador(e.target.value)} placeholder="ISENTO" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Razão Social / Nome de Registro</label>
            <Input value={razao} onChange={(e)=>setRazao(e.target.value)} placeholder="Registro oficial completo" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-[10px]">
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Número RG</label>
            <Input value={rgColaborador} onChange={(e)=>setRgColaborador(e.target.value)} placeholder="00.000.000-0" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Órgão Emissor</label>
            <Input value={orgaoColaborador} onChange={(e)=>setOrgaoColaborador(e.target.value)} placeholder="SSP/SP" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Sexo</label>
            <div className="flex items-center gap-4 bg-[#0F1420] border border-border/70 rounded-md p-1.5 h-8.5 select-none font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={sexoColaborador === "M"} onChange={()=>setSexoColaborador("M")} />
                <span>Masculino</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={sexoColaborador === "F"} onChange={()=>setSexoColaborador("F")} />
                <span>Feminino</span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Data de Nascimento</label>
            <Input type="date" value={nascColaborador} onChange={(e)=>setNascColaborador(e.target.value)} className="h-8.5 bg-[#0F1420] text-xs border-border/80" />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-[10px]">
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Número P.I.S / PASEP</label>
            <Input value={pisColaborador} onChange={(e)=>setPisColaborador(e.target.value)} placeholder="PIS" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Carteira Trabalho (C.T.P.S)</label>
            <Input value={ctpsColaborador} onChange={(e)=>setCtpsColaborador(e.target.value)} placeholder="Número / Série" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Naturalidade (Cidade/UF)</label>
            <Input value={localNascColaborador} onChange={(e)=>setLocalNascColaborador(e.target.value)} placeholder="São Paulo - SP" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Estado Civil</label>
            <select value={estadoCivilColaborador} onChange={(e)=>setEstadoCivilColaborador(e.target.value)} className="w-full h-8.5 px-3 bg-[#0F1420] border border-border rounded text-xs text-slate-200">
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
            </select>
          </div>

        </div>
      </Card>

      {/* Sub-Card 2: Endereço Residencial */}
      <Card className="bg-[#121826]/40 border border-border/80 p-4 space-y-4">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block border-b border-border/40 pb-1.5">
          Endereço Residencial Completo
        </span>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-left text-[10px]">
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">C.E.P.</label>
            <Input value={cepColaborador} onChange={(e)=>setCepColaborador(e.target.value)} placeholder="00000-000" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-slate-300 font-bold block">Logradouro / Avenida / Rua</label>
            <Input value={enderecoColaborador} onChange={(e)=>setEnderecoColaborador(e.target.value)} placeholder="Rua, número e complemento" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Bairro</label>
            <Input value={bairroColaborador} onChange={(e)=>setBairroColaborador(e.target.value)} placeholder="Bairro" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Cidade</label>
            <Input value={cidadeColaborador} onChange={(e)=>setCidadeColaborador(e.target.value)} placeholder="Cidade" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Estado (UF)</label>
            <Input value={estadoColaborador} onChange={(e)=>setEstadoColaborador(e.target.value)} placeholder="SP" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

        </div>
      </Card>

      {/* Sub-Card 3: Cargos, Remuneração e Comissões */}
      <Card className="bg-[#121826]/40 border border-border/80 p-4 space-y-4">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block border-b border-border/40 pb-1.5">
          Configurações de Contratação & Comissionamento
        </span>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-left text-[10px]">
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Cargo Atual</label>
            <Input value={cargoColaborador} onChange={(e)=>setCargoColaborador(e.target.value)} placeholder="Ex: Analista de Sistemas" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Departamento</label>
            <Input value={departamentoColaborador} onChange={(e)=>setDepartamentoColaborador(e.target.value)} placeholder="Ex: Tecnologia" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Salário Base (R$)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground text-[10px] font-bold">R$</span>
              <Input value={salarioBaseColaborador} onChange={(e)=>setSalarioBaseColaborador(e.target.value)} className="h-8.5 pl-7 bg-[#0F1420] text-xs border-border" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Comissão Padrão (%)</label>
            <Input value={transporteColaborador} onChange={(e)=>setTransporteColaborador(e.target.value)} placeholder="5.00" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Comissão em Dupla (%)</label>
            <Input value={alimentacaoColaborador} onChange={(e)=>setAlimentacaoColaborador(e.target.value)} placeholder="2.50" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

        </div>
      </Card>

      {/* Sub-Card 4: Contatos e Web */}
      <Card className="bg-[#121826]/40 border border-border/80 p-4 space-y-4">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block border-b border-border/40 pb-1.5">
          Contatos de Equipe & Conselhos
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-[10px]">
          
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Telefone Fixo / Comercial</label>
            <Input value={telefoneColaborador} onChange={(e)=>setTelefoneColaborador(e.target.value)} placeholder="(11) 3333-3333" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">WhatsApp Celular</label>
            <Input value={celularColaborador} onChange={(e)=>setCelularColaborador(e.target.value)} placeholder="(11) 99999-9999" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">E-mail Corporativo</label>
            <Input value={emailColaborador} onChange={(e)=>setEmailColaborador(e.target.value)} placeholder="colaborador@empresa.com" className="h-8.5 bg-[#0F1420] text-xs border-border" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Conselho Profissional & Registro</label>
            <div className="flex gap-2">
              <select value={conselhoColaborador} onChange={(e)=>setConselhoColaborador(e.target.value)} className="h-8.5 px-1 bg-[#0F1420] border border-border rounded text-[10px] text-slate-200 w-16 shrink-0">
                <option value="CRC">CRC</option>
                <option value="OAB">OAB</option>
                <option value="CRM">CRM</option>
                <option value="CREA">CREA</option>
              </select>
              <Input value={registroColaborador} onChange={(e)=>setRegistroColaborador(e.target.value)} placeholder="Registro" className="h-8.5 bg-[#0F1420] text-xs border-border flex-1" />
            </div>
          </div>

        </div>

        {/* Observacoes text */}
        <div className="space-y-1 text-left text-[10px]">
          <label className="text-slate-300 font-bold block">Anotações Internas / Observações</label>
          <textarea
            rows={3}
            value={observacaoColaborador}
            onChange={(e)=>setObservacaoColaborador(e.target.value)}
            placeholder="Histórico do colaborador, anotações de RH ou informações adicionais de pagamentos..."
            className="w-full p-2.5 rounded-lg bg-[#0F1420] border border-border/70 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
          ></textarea>
        </div>
      </Card>

    </div>
  );
}
