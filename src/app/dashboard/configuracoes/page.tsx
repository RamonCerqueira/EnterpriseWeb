"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, Save, Building2, Sliders, Bell, Database, 
  RefreshCw, User, MapPin, Percent, FileText, Mail, 
  Image as ImageIcon, CheckCircle, ShieldAlert
} from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import modular components
import CompanyList from "./components/CompanyList";
import IdentificacaoTab from "./components/IdentificacaoTab";
import EnderecoTab from "./components/EnderecoTab";
import TributacaoTab from "./components/TributacaoTab";
import NfeTab from "./components/NfeTab";
import SmtpTab from "./components/SmtpTab";
import ParametrosTab from "./components/ParametrosTab";

interface CompanyListItem {
  id: number;
  nome: string;
  razao: string;
  cnpj: string;
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("empresa");
  
  // Company Registry States
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [companyData, setCompanyData] = useState<any | null>(null);
  const [companySearch, setCompanySearch] = useState("");
  const [isCompaniesLoading, setIsCompaniesLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Sub-tabs inside Company Registry
  const [subTab, setSubTab] = useState("identificacao");

  // System Config mock states (preserved from legacy page structure)
  const [smtpServer, setSmtpServer] = useState("smtp.softlinesistemas.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [backupPeriod, setBackupPeriod] = useState("Diário");

  // Fetch company list
  const fetchCompanies = async () => {
    setIsCompaniesLoading(true);
    try {
      const res = await fetch("/api/empresas");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data || []);
        if (data.length > 0 && selectedCompanyId === null) {
          setSelectedCompanyId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading company list:", err);
    } finally {
      setIsCompaniesLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch selected company details
  const fetchCompanyDetails = async (id: number) => {
    setIsDetailLoading(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/empresas/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCompanyData(data);
      }
    } catch (err) {
      console.error("Error loading company details:", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompanyId !== null) {
      fetchCompanyDetails(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  // Handle Input Changes for Company Registry
  const handleInputChange = (field: string, val: any) => {
    if (!companyData) return;
    setCompanyData({
      ...companyData,
      [field]: val
    });
  };

  // Convert uploaded image to Base64 for database Logo bytes storage
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, logoField: "Logo" | "Logo2") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange(logoField, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Save Operation
  const handleSaveCompany = async () => {
    if (!selectedCompanyId || !companyData) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch(`/api/empresas/${selectedCompanyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData)
      });

      if (res.ok) {
        setSaveStatus({ success: true, message: "Cadastro da empresa atualizado com sucesso no banco!" });
        // Refresh company list
        fetchCompanies();
      } else {
        const errData = await res.json();
        setSaveStatus({ success: false, message: errData.error || "Falha ao salvar cadastro da empresa." });
      }
    } catch (err) {
      console.error("Error saving company details:", err);
      setSaveStatus({ success: false, message: "Erro de comunicação ao salvar." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 text-left text-slate-100 relative">
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

        {activeTab === "empresa" && selectedCompanyId && (
          <Button 
            onClick={handleSaveCompany}
            disabled={isSaving || isDetailLoading}
            className="text-xs font-black h-9 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Gravando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        )}
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

      {/* MAIN CONTAINER */}
      {activeTab === "empresa" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT PANEL: Filiais List */}
          <Card className="lg:col-span-1 bg-[#0E1322]/80 border border-border/60 p-4 shadow-lg backdrop-blur-md">
            <CompanyList
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onSelectCompany={setSelectedCompanyId}
              search={companySearch}
              onSearchChange={setCompanySearch}
              isLoading={isCompaniesLoading}
            />
          </Card>

          {/* RIGHT PANEL: Complex Delphi Form Layout */}
          <Card className="lg:col-span-3 bg-[#0E1322]/80 border border-border/60 p-6 shadow-lg backdrop-blur-md relative min-h-[500px]">
            {isDetailLoading ? (
              <div className="absolute inset-0 z-50 bg-[#0E1322]/90 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
                <span className="text-xs text-muted-foreground font-extrabold">Carregando dados fiscais do SQL Server...</span>
              </div>
            ) : !companyData ? (
              <div className="text-center p-20 text-xs text-muted-foreground font-bold">
                Selecione uma filial no painel esquerdo para visualizar as configurações.
              </div>
            ) : (
              <div className="space-y-6">
                {saveStatus && (
                  <div className={`p-2.5 rounded-lg text-[10px] font-bold flex items-center gap-2 border ${
                    saveStatus.success 
                      ? "bg-emerald-950/35 border-emerald-500/30 text-emerald-400" 
                      : "bg-rose-950/35 border-rose-500/30 text-rose-400"
                  }`}>
                    {saveStatus.success ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" /> : <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />}
                    <span>{saveStatus.message}</span>
                  </div>
                )}

                {/* SUB-TABS NAVIGATION (Delphi style tabs) */}
                <div className="flex border-b border-border/40 gap-1.5 overflow-x-auto shrink-0 pb-1 bg-slate-950/25 p-1 rounded-lg">
                  {[
                    { id: "identificacao", label: "Identificação", icon: User },
                    { id: "endereco", label: "Endereço & Contato", icon: MapPin },
                    { id: "tributacao", label: "Tributação & Simples", icon: Percent },
                    { id: "nfe", label: "NFe & Sequenciais", icon: FileText },
                    { id: "smtp", label: "SMTP/POP & WEB", icon: Mail },
                    { id: "parametros", label: "Parâmetros & Logos", icon: ImageIcon },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubTab(sub.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap outline-none ${
                        subTab === sub.id
                          ? "bg-emerald-500 text-black font-black shadow-md"
                          : "text-slate-400 hover:text-slate-200 hover:bg-[#05080E]/40"
                      }`}
                    >
                      <sub.icon className="h-3.5 w-3.5" />
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* SUB-TAB CONTENTS */}
                <div className="space-y-4 pt-2">
                  {subTab === "identificacao" && (
                    <IdentificacaoTab data={companyData} onChange={handleInputChange} />
                  )}

                  {subTab === "endereco" && (
                    <EnderecoTab data={companyData} onChange={handleInputChange} />
                  )}

                  {subTab === "tributacao" && (
                    <TributacaoTab data={companyData} onChange={handleInputChange} />
                  )}

                  {subTab === "nfe" && (
                    <NfeTab data={companyData} onChange={handleInputChange} />
                  )}

                  {subTab === "smtp" && (
                    <SmtpTab data={companyData} onChange={handleInputChange} />
                  )}

                  {subTab === "parametros" && (
                    <ParametrosTab 
                      data={companyData} 
                      onChange={handleInputChange} 
                      onLogoUpload={handleLogoUpload} 
                    />
                  )}
                </div>

              </div>
            )}
          </Card>
        </div>
      ) : (
        <Card className="bg-[#121826]/75 border border-border/60 p-6 shadow-xl backdrop-blur-md">
          {activeTab === "sistema" && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-slate-200 border-b border-border/40 pb-2 flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-emerald-400" /> Servidor SMTP para Envio de E-mails
              </h3>
              
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
              <h3 className="text-sm font-bold text-slate-200 border-b border-border/40 pb-2 flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-emerald-400" /> Preferências de Notificações
              </h3>
              
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
              <h3 className="text-sm font-bold text-slate-200 border-b border-border/40 pb-2 flex items-center gap-1.5">
                <Database className="h-4.5 w-4.5 text-emerald-400" /> Controle de Segurança de Dados
              </h3>
              
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
      )}
    </div>
  );
}
