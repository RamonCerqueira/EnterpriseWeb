import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  Wallet,
  Users,
  FileText,
  Percent,
  ClipboardList,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Contact,
  CalendarDays,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Settings,
  Hammer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FinancialChart from "@/components/dashboard/FinancialChart";
import AiAssistant from "@/components/dashboard/AiAssistant";
import { cn, formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session?.nome?.split(" ")[0] || "Ramon";

  // Mock list of recent transactions
  const transactions = [
    {
      tipo: "Recebimento",
      descricao: "Pagamento de duplicata",
      ref: "REC-5421",
      cliente: "João da Silva ME",
      valor: 1250.0,
      status: "Concluído",
      data: "14/05/2026 10:30",
    },
    {
      tipo: "Venda",
      descricao: "Venda de produtos",
      ref: "VEN-8892",
      cliente: "Empresa ABC Ltda",
      valor: 3450.0,
      status: "Concluído",
      data: "14/05/2026 09:15",
    },
    {
      tipo: "OS",
      descricao: "Manutenção preventiva",
      ref: "OS-1289",
      cliente: "Condomínio Central",
      valor: 850.0,
      status: "Em andamento",
      data: "14/05/2026 08:45",
    },
    {
      tipo: "Compra",
      descricao: "Compra de materiais",
      ref: "COM-3421",
      cliente: "Forn. de Materiais Ltda",
      valor: 2150.0,
      status: "Pendente",
      data: "13/05/2026 16:20",
    },
  ];

  // Mock recent activities list
  const activities = [
    { text: "Nova proposta criada - Proposta #P-2345 para Cliente ABC Ltda", time: "há 2 min" },
    { text: "Pagamento recebido - R$ 2.450,00 de João da Silva ME", time: "há 15 min" },
    { text: "OS #OS-1289 atualizada - Status alterado para Em andamento", time: "há 1 h" },
    { text: "Produto com estoque baixo - Cabo HDMI 2m - 3 unidades restantes", time: "há 2 h" },
    { text: "Novo cliente cadastrado - Empresa XYZ Ltda", time: "há 3 h" },
  ];

  // Quick access grid list (exactly 12 items matching the layout image)
  const quickAccess = [
    {
      label: "Proposta",
      href: "/dashboard/propostas",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="14" y="6" width="36" height="52" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2.5"/>
          <rect x="20" y="16" width="8" height="8" rx="2" fill="#EF4444"/>
          <path d="M22 20L24 22L26 18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="32" y1="20" x2="44" y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="20" y="28" width="8" height="8" rx="2" fill="#EF4444"/>
          <path d="M22 32L24 34L26 30" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="32" y1="32" x2="44" y2="32" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="20" y1="44" x2="44" y2="44" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: "Compras",
      href: "/dashboard/compras",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M12 16H20L26 42H50L56 22H24" stroke="#34D399" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="28" cy="50" r="5" fill="#34D399"/>
          <circle cx="48" cy="50" r="5" fill="#34D399"/>
        </svg>
      )
    },
    {
      label: "Clientes",
      href: "/dashboard/clientes",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <circle cx="24" cy="24" r="8" fill="#10B981"/>
          <path d="M12 44C12 36 18 34 24 34C30 34 36 36 36 44" fill="#10B981" opacity="0.8"/>
          <circle cx="40" cy="28" r="6" fill="#FBBF24"/>
          <path d="M32 44C32 39 36 38 40 38C44 38 48 39 48 44" fill="#FBBF24" opacity="0.85"/>
          <circle cx="44" cy="22" r="5.5" fill="#10B981" stroke="#131825" strokeWidth="1.5"/>
          <path d="M44 19.5V24.5M41.5 22H46.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: "Fornecedores",
      href: "/dashboard/fornecedores",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="22" y="32" width="20" height="20" rx="4" fill="#64748B"/>
          <circle cx="32" cy="20" r="8" fill="#FDBA74"/>
          <path d="M22 36C22 36 25 32 32 32C39 32 42 36 42 36" fill="#475569"/>
          <path d="M27 32L32 42L37 32" stroke="#E2E8F0" strokeWidth="2.2"/>
          <path d="M32 32V42" stroke="#EF4444" strokeWidth="2.5"/>
        </svg>
      )
    },
    {
      label: "Contatos",
      href: "/dashboard/contatos",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="18" y="10" width="30" height="44" rx="5" fill="#06B6D4"/>
          <rect x="14" y="16" width="6" height="4" rx="1" fill="#475569"/>
          <rect x="14" y="26" width="6" height="4" rx="1" fill="#475569"/>
          <rect x="14" y="36" width="6" height="4" rx="1" fill="#475569"/>
          <circle cx="33" cy="24" r="5" fill="white"/>
          <path d="M26 38C26 34 29 32 33 32C37 32 40 34 40 38" fill="white" opacity="0.9"/>
        </svg>
      )
    },
    {
      label: "Colaboradores",
      href: "/dashboard/clientes",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <circle cx="32" cy="18" r="5" fill="#EF4444"/>
          <circle cx="18" cy="42" r="5" fill="#0EA5E9"/>
          <circle cx="46" cy="42" r="5" fill="#F59E0B"/>
          <line x1="32" y1="23" x2="18" y2="37" stroke="#64748B" strokeWidth="3"/>
          <line x1="32" y1="23" x2="46" y2="37" stroke="#64748B" strokeWidth="3"/>
          <line x1="23" y1="42" x2="41" y2="42" stroke="#64748B" strokeWidth="3"/>
          <circle cx="32" cy="18" r="7" stroke="#EF4444" strokeWidth="1.5" opacity="0.5"/>
          <circle cx="18" cy="42" r="7" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.5"/>
          <circle cx="46" cy="42" r="7" stroke="#F59E0B" strokeWidth="1.5" opacity="0.5"/>
        </svg>
      )
    },
    {
      label: "Produtos",
      href: "/dashboard/produtos",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M32 8L50 17V38L32 48L14 38V17L32 8Z" fill="#D97706" opacity="0.95"/>
          <path d="M32 8L14 17L32 26L50 17L32 8Z" fill="#F59E0B"/>
          <path d="M32 26V48" stroke="#B45309" strokeWidth="2.8"/>
          <path d="M14 17V38" stroke="#B45309" strokeWidth="1.8"/>
          <path d="M50 17V38" stroke="#B45309" strokeWidth="1.8"/>
          <circle cx="46" cy="42" r="7.5" fill="#10B981" stroke="#131825" strokeWidth="1.5"/>
          <path d="M46 38.5V45.5M42.5 42H49.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: "Ordem de Serviço",
      href: "/dashboard/ordens-servico",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <circle cx="32" cy="32" r="16" stroke="#6366F1" strokeWidth="5.5" strokeDasharray="8 4"/>
          <circle cx="32" cy="32" r="10" fill="#3B82F6"/>
          <circle cx="32" cy="28" r="3.5" fill="white"/>
          <path d="M26 39C26 36 29 34 32 34C35 34 38 36 38 39" fill="white" opacity="0.9"/>
        </svg>
      )
    },
    {
      label: "Locação",
      href: "/dashboard/locacao",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="12" y="24" width="30" height="18" rx="3" fill="#F59E0B"/>
          <rect x="42" y="28" width="10" height="14" rx="2" fill="#D97706"/>
          <circle cx="20" cy="44" r="5" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5"/>
          <circle cx="40" cy="44" r="5" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5"/>
          <rect x="18" y="14" width="18" height="10" rx="3" fill="#E2E8F0" stroke="#B45309" strokeWidth="2"/>
        </svg>
      )
    },
    {
      label: "Contas a Receber",
      href: "/dashboard/financeiro",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M12 42C12 42 16 34 26 34H44L52 42H12Z" fill="#3B82F6" opacity="0.9"/>
          <circle cx="42" cy="22" r="9.5" fill="#FBBF24" stroke="#D97706" strokeWidth="2"/>
          <path d="M42 17v10M38.5 22h7" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: "Contas a Pagar",
      href: "/dashboard/financeiro",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M32 10C42 10 50 18 50 28C50 31 49 34 47 36" stroke="#EF4444" strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M32 46C22 46 14 38 14 28C14 25 15 22 17 20" stroke="#EF4444" strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M47 30L52 38L44 37" fill="#EF4444"/>
          <path d="M17 26L12 18L19 20" fill="#EF4444"/>
          <circle cx="32" cy="28" r="9" fill="#FBBF24" stroke="#D97706" strokeWidth="2"/>
          <path d="M32 23v10M28.5 28h7" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: "Conta a Caixa",
      href: "/dashboard/financeiro",
      icon: (
        <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="14" y="14" width="36" height="36" rx="4" fill="#10B981" stroke="#047857" strokeWidth="2.5"/>
          <circle cx="32" cy="32" r="8" fill="#3B82F6" stroke="white" strokeWidth="2.5"/>
          <line x1="32" y1="24" x2="32" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="2.5" fill="white"/>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6 select-none pb-8 animate-fade-in">
      {/* Top Greeting Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Boa tarde, {firstName}! 👋
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aqui está o resumo do que está acontecendo hoje no SoftLine ERP.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="text-xs font-semibold h-8 border border-border/80 bg-card">
            Personalizar Dashboard
          </Button>
          <Button variant="default" size="sm" className="text-xs font-semibold h-8 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            Ações Rápidas <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Row 1: Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Recebimentos */}
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Recebimentos Hoje</span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-100">{formatCurrency(12480.0)}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
              ↑ 18.6% <span className="text-muted-foreground font-medium">vs ontem</span>
            </span>
          </div>
        </Card>

        {/* Card 2: A Receber */}
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-rose-950/45 text-rose-400 flex items-center justify-center border border-rose-500/10">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">A receber (vencido)</span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-100">{formatCurrency(28650.5)}</h3>
            <span className="text-[9px] text-rose-400 font-semibold flex items-center gap-1">
              ● <span className="font-semibold text-[9px]">12 títulos vencidos</span>
            </span>
          </div>
        </Card>

        {/* Card 3: OS */}
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-950/45 text-amber-400 flex items-center justify-center border border-amber-500/10">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Ordens de Serviço</span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-100">8 em andamento</h3>
            <span className="text-[9px] text-amber-400 font-semibold flex items-center gap-1">
              ● <span className="font-semibold text-[9px]">2 atrasadas</span>
            </span>
          </div>
        </Card>

        {/* Card 4: Propostas */}
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-950/45 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Propostas</span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-100">4 aguardando</h3>
            <span className="text-[9px] text-slate-300 font-semibold">{formatCurrency(47890.0)}</span>
          </div>
        </Card>

        {/* Card 5: Fluxo de Caixa */}
        <Card className="p-4 bg-[#121826]/75 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-950/45 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Fluxo de Caixa (mês)</span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-100">{formatCurrency(48200.0)}</h3>
            <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
              ↑ 12.5% <span className="text-muted-foreground font-medium">previsto</span>
            </span>
          </div>
        </Card>
      </div>

      {/* Row 2: Mid Split Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column (Span 2) */}
        <div className="xl:col-span-2 space-y-6">

          {/* Section: Acesso Rápido (Without outer card wrapper, matching requested image layout perfectly) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 tracking-wide pl-1 select-none">
              Acesso Rápido
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {quickAccess.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-800/80 bg-[#131825]/45 hover:bg-[#161d2d]/60 hover:border-emerald-500/35 hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all duration-300 group cursor-pointer text-center relative overflow-hidden min-h-[140px] shadow-lg"
                >
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="mb-2 shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                  
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors mt-2 tracking-wide block">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Card: Resumo Financeiro Chart */}
          <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
            <div className="p-5 border-b border-border/40 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-200">Resumo Financeiro</CardTitle>
                <p className="text-[10px] text-muted-foreground">Estatísticas mensais de faturamento</p>
              </div>
              <select className="bg-[#0F1420] border border-border px-2 py-1 rounded text-[10px] font-semibold text-slate-300 focus:outline-none cursor-pointer">
                <option>Este mês</option>
                <option>Últimos 3 meses</option>
                <option>Ano corrente</option>
              </select>
            </div>
            <CardContent className="p-4">
              <FinancialChart />
            </CardContent>
          </Card>

          {/* Card: Últimas Transações Table */}
          <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
            <div className="p-5 border-b border-border/40 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-200">Últimas Transações</CardTitle>
                <p className="text-[10px] text-muted-foreground">Lançamentos financeiros e operacionais recentes</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] text-emerald-400 h-7 font-bold hover:text-emerald-300">
                Ver todas &rarr;
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-[#0E131F]/70">
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-5">Tipo</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descrição</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Referência</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente/Fornecedor</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pr-5">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {transactions.map((t, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors text-xs">
                      {/* Tipo badge */}
                      <td className="p-3.5 pl-5 font-semibold text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "h-2 w-2 rounded-full",
                            t.tipo === "Recebimento" ? "bg-emerald-400" :
                              t.tipo === "Venda" ? "bg-green-400" :
                                t.tipo === "OS" ? "bg-blue-400" : "bg-purple-400"
                          )}></span>
                          {t.tipo}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{t.descricao}</td>
                      <td className="p-3.5 text-muted-foreground font-mono font-medium">{t.ref}</td>
                      <td className="p-3.5 text-slate-200 font-semibold">{t.cliente}</td>
                      <td className="p-3.5 text-slate-200 font-bold">{formatCurrency(t.valor)}</td>
                      {/* Status Badges */}
                      <td className="p-3.5">
                        <Badge
                          variant={
                            t.status === "Concluído" ? "success" :
                              t.status === "Em andamento" ? "info" : "warning"
                          }
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-muted-foreground pr-5 font-medium">{t.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">

          {/* Card: Recent Activities */}
          <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-200">Atividades Recentes</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground h-6 font-bold hover:text-slate-100">
                Ver todas
              </Button>
            </div>
            <CardContent className="p-4 pt-2">
              <div className="space-y-4">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-3 items-start text-xs border-b border-border/20 pb-3 last:border-0 last:pb-0">
                    <div className="h-5 w-5 rounded-full bg-secondary text-emerald-400 flex items-center justify-center shrink-0 border border-border">
                      ●
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-slate-200 leading-snug font-medium">{act.text}</p>
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card: Pendências List */}
          <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-200">Pendências</CardTitle>
                <span className="h-4.5 px-1.5 rounded bg-rose-500/25 border border-rose-500/35 text-[10px] font-bold text-rose-400 flex items-center justify-center">
                  14
                </span>
              </div>
            </div>
            <CardContent className="p-3 space-y-2">
              {[
                { title: "Contas a receber vencidas", count: 12, color: "text-rose-400" },
                { title: "Ordens de serviço atrasadas", count: 2, color: "text-amber-400" },
                { title: "Produtos com estoque crítico", count: 5, color: "text-amber-500" },
                { title: "Propostas aguardando aprovação", count: 3, color: "text-blue-400" },
                { title: "Notas fiscais pendentes", count: 2, color: "text-purple-400" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-[#0E1320] border border-border/50 hover:border-emerald-500/10 transition-colors">
                  <span className="text-xs font-semibold text-slate-300">{item.title}</span>
                  <span className={cn("text-xs font-extrabold px-2 py-0.5 rounded bg-secondary/80 border border-border", item.color)}>
                    {item.count}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interactive AI Assistant Embedded */}
          <AiAssistant session={session} />

          {/* Card: Calendário Widget */}
          <Card className="bg-[#121826]/75 border border-border/60 overflow-hidden">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-200">Calendário</CardTitle>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">Maio 2026</span>
            </div>
            <CardContent className="p-4 pt-2 space-y-3">
              {[
                { day: "14", weekday: "MAI", time: "10:00 - 11:00", title: "Reunião com cliente", detail: "João da Silva ME", type: "meeting" },
                { day: "14", weekday: "MAI", time: "14:00 - 15:00", title: "Visita técnica", detail: "Condomínio Central", type: "tech" },
                { day: "15", weekday: "MAI", time: "Dia todo", title: "Vencimento de títulos", detail: "Faturamento mensal", type: "finance" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3.5 items-center p-2.5 rounded bg-[#0E1320] border border-border/60 hover:border-emerald-500/10 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center shrink-0 border-r border-border/50 pr-3.5 select-none">
                    <span className="text-sm font-extrabold text-slate-200 leading-none">{item.day}</span>
                    <span className="text-[8px] text-muted-foreground font-bold mt-1 tracking-wider">{item.weekday}</span>
                  </div>
                  <div className="flex-1 space-y-0.5 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 leading-tight">{item.title}</h4>
                      <span className="text-[8px] text-muted-foreground font-semibold uppercase">{item.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">{item.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
