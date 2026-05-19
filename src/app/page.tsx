"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Sparkles, ShieldCheck, Cpu, ArrowUpRight, Terminal, BarChart3, Database, MessageSquare, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19] text-foreground overflow-hidden relative">
      {/* Premium custom page animations style block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-slower {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes orbit {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float-slower {
          animation: float-slower 9s ease-in-out infinite;
        }
        .animate-orbit-1 {
          animation: orbit 22s ease-in-out infinite;
        }
        .animate-orbit-2 {
          animation: orbit 28s ease-in-out infinite alternate;
        }
      `}} />

      {/* Modern SVG grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370b_1px,transparent_1px),linear-gradient(to_bottom,#1f29370b_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Background glowing blobs with orbiting keyframes */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-orbit-1"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none animate-orbit-2"></div>

      {/* Header */}
      <header className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-border/40 z-10 relative">
        <Logo showText />
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-300 hover:text-slate-100 hover:bg-secondary/40 cursor-pointer">
              Login
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer">
              Acessar ERP <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main hero section */}
      <main className="container mx-auto px-6 flex-1 flex flex-col items-center justify-center text-center py-16 z-10 relative">
        <div className="inline-flex items-center gap-2 bg-[#121826] border border-border px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400 mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Próxima Geração de ERP Web</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-[1.15] mb-6">
          Gestão Empresarial Inteligente com o{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 bg-clip-text text-transparent glow-text-green font-black">
            EnterpriseWeb
          </span>
        </h1>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mb-8">
          Gerencie seu financeiro, prospecção de vendas, tabelas de preço, ordem de serviço, inventário de produtos e colaboradores em uma única plataforma espetacular rodando em Next.js com Banco SQL Server.
        </p>

        {/* Floating tech badge pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-xl animate-float-slower">
          <span className="px-3 py-1 rounded-full border border-border/80 bg-[#0E1320]/65 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ⚡ SQL Server: Ativo
          </span>
          <span className="px-3 py-1 rounded-full border border-border/80 bg-[#0E1320]/65 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            🛡️ Segurança: Op1-Op105
          </span>
          <span className="px-3 py-1 rounded-full border border-border/80 bg-[#0E1320]/65 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
            ✨ Assistente IA: Online
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full max-w-md">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto font-bold gap-2 h-12 text-sm px-8 bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer">
              Acessar Painel ERP <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold h-12 text-sm px-8 border-border hover:bg-secondary/40 cursor-pointer">
              Falar com Suporte
            </Button>
          </a>
        </div>

        {/* Interactive Dashboard Mockup Preview */}
        <div className="relative mb-20 w-full max-w-4xl rounded-2xl border border-border/80 bg-[#0E1320]/60 p-4 shadow-[0_0_50px_rgba(16,185,129,0.08)] backdrop-blur-md group hover:border-emerald-500/20 transition-all duration-500 select-none">
          {/* Windows Title bar */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4 px-2">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest font-semibold uppercase">softline-erp-v2026.app</span>
            <div className="h-3.5 w-12 rounded bg-secondary/50 border border-border/40"></div>
          </div>

          {/* Mock Dashboard Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Financial card & status */}
            <div className="space-y-4">
              <div className="bg-[#121826]/80 border border-border/80 rounded-xl p-4 text-left">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">Faturamento Consolidado</span>
                <h4 className="text-lg font-extrabold text-slate-100 mt-1">R$ 128.780,00</h4>
                <div className="flex items-center gap-1 mt-2 text-[9px] font-semibold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded w-fit">
                  <span>↑ 18.6%</span>
                  <span className="text-muted-foreground font-medium">este mês</span>
                </div>
              </div>
              <div className="bg-[#121826]/80 border border-border/80 rounded-xl p-4 text-left">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">Ordens de Serviço</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-slate-200">8 Em Execução</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="h-1.5 w-full bg-secondary/60 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[70%]" />
                </div>
              </div>
            </div>

            {/* Column 2: Graph Lines */}
            <div className="bg-[#121826]/80 border border-border/80 rounded-xl p-4 flex flex-col justify-between text-left md:col-span-2">
              <div>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">Fluxo de Caixa Operacional</span>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Saldo Líquido Previsto: + R$ 48.200,00</span>
              </div>
              
              {/* Clean Mock Graph Bars */}
              <div className="h-28 flex items-end justify-between gap-2 mt-4 border-b border-l border-border/30 pl-2 pb-2">
                {[30, 45, 35, 60, 50, 75, 90, 85, 95, 110, 105, 120].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                    <div 
                      className="w-full rounded-t bg-gradient-to-t from-emerald-500/20 to-emerald-400/80 group-hover/bar:to-emerald-300 transition-all duration-300 relative" 
                      style={{ height: `${h * 0.7}px` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-border px-1 py-0.5 rounded text-[8px] font-bold text-slate-100 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        R$ {h}k
                      </div>
                    </div>
                    <span className="text-[7px] font-mono text-muted-foreground uppercase">{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
          <div className="bg-[#121826]/75 border border-border/80 rounded-xl p-6 glow-card transition-all duration-300">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-4 border border-emerald-500/20">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">Prisma & SQL Server</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Totalmente integrado ao seu banco corporativo **TESTE** no SQL Server, garantindo performance e integridade de dados absoluta.
            </p>
          </div>

          <div className="bg-[#121826]/75 border border-border/80 rounded-xl p-6 glow-card transition-all duration-300">
            <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center mb-4 border border-indigo-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">Controle de Permissões</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mapeamento de **105 operadores (Op1 a Op105)** do legado para habilitar ou bloquear módulos, garantindo controle estrito de acessos.
            </p>
          </div>

          <div className="bg-[#121826]/75 border border-border/80 rounded-xl p-6 glow-card transition-all duration-300">
            <div className="h-10 w-10 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center mb-4 border border-teal-500/20">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">Assistente com IA</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Converse com o Assistente de Inteligência Artificial integrado ao ERP para obter insights de faturamento, estoque e inadimplência.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/40 text-center text-xs text-muted-foreground z-10">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} SoftLine Sistemas. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5 text-emerald-400" /> Next.js + SQL Server v15</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
