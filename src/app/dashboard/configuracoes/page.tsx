"use client";

import React, { useState } from "react";
import { Settings, Save, Building2, Sliders, Bell, Database, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("empresa");
  const [companyName, setCompanyName] = useState("SoftLine Sistemas Ltda");
  const [cnpj, setCnpj] = useState("12.345.678/0001-90");
  const [smtpServer, setSmtpServer] = useState("smtp.softlinesistemas.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [backupPeriod, setBackupPeriod] = useState("Diário");

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-400" /> Configurações Gerais
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ajuste os parâmetros fiscais e comerciais da empresa, configurações do servidor SMTP de e-mails, alertas e backups.
          </p>
        </div>

        <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
          <Save className="h-4 w-4" /> Salvar Alterações
        </Button>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-border/40 gap-2 overflow-x-auto select-none shrink-0">
        {[
          { id: "empresa", label: "Dados da Empresa", icon: Building2 },
          { id: "sistema", label: "Sistema & SMTP", icon: Sliders },
          { id: "notificacoes", label: "Notificações", icon: Bell },
          { id: "backup", label: "Backups & Nuvem", icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap outline-none ${
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10"
                : "border-transparent text-muted-foreground hover:text-slate-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab contents */}
      <Card className="bg-[#121826]/75 border border-border/60 p-6">
        {activeTab === "empresa" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-200 border-b border-border/40 pb-2">Informações Jurídicas</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Razão Social</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">CNPJ Oficial</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Inscrição Estadual</label>
                <input
                  type="text"
                  defaultValue="110.220.330.120"
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Regime Tributário</label>
                <select
                  defaultValue="Simples Nacional"
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sistema" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-200 border-b border-border/40 pb-2">Servidor SMTP para Envio de E-mails</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Servidor SMTP</label>
                <input
                  type="text"
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Porta SMTP</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">E-mail SMTP Remetente</label>
                <input
                  type="email"
                  defaultValue="no-reply@softlinesistemas.com"
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Protocolo de Criptografia</label>
                <select
                  defaultValue="STARTTLS"
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="STARTTLS">STARTTLS (Recomendado)</option>
                  <option value="SSL/TLS">SSL / TLS</option>
                  <option value="Nenhum">Nenhuma Criptografia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notificacoes" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-200 border-b border-border/40 pb-2">Preferências de Notificações</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-[#0E1320] cursor-pointer" onClick={() => setNotifEmail(!notifEmail)}>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Notificar por E-mail</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Envia relatórios diários de faturamento e alertas de estoque por e-mail.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={() => {}}
                  className="h-4.5 w-4.5 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500 pointer-events-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-[#0E1320] cursor-pointer" onClick={() => setNotifSms(!notifSms)}>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Notificar por SMS</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Envia lembretes SMS automáticos para faturas vencidas de clientes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={() => {}}
                  className="h-4.5 w-4.5 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500 pointer-events-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-200 border-b border-border/40 pb-2">Controle de Segurança de Dados</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Periodicidade do Backup</label>
                <select
                  value={backupPeriod}
                  onChange={(e) => setBackupPeriod(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="Diário">Diário (Recomendado)</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Destino do Backup na Nuvem</label>
                <select
                  defaultValue="Amazon S3"
                  className="w-full h-9.5 px-3 rounded-lg bg-[#0F1420] border border-border text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="Amazon S3">Amazon S3 Secure Storage</option>
                  <option value="Google Cloud">Google Cloud Bucket</option>
                  <option value="Local">Armazenamento Local</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-3">
                <Button className="text-xs font-semibold h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer">
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin-slow" /> Realizar Backup Imediato Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
