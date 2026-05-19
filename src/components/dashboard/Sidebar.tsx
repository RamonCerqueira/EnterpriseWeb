"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  Users,
  FileText,
  DollarSign,
  ClipboardList,
  Package,
  Boxes,
  Percent,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  ShieldAlert,
  Network,
  LogOut,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Hammer,
  Contact,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionData } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  session: SessionData | null;
}

export default function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Sidebar collapse states
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  // Helper to check permission safely
  const hasPermission = (opKey: string) => {
    if (!session) return false;
    // Admins have access to everything
    if (session.role === "Administrador" || session.permissions["Op91"]) return true;
    return !!session.permissions[opKey];
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const menuModules = [
    {
      name: "Clientes",
      icon: Users,
      href: "/dashboard/clientes", // Mapped to Clientes screen
      op: "Op3", // Clientes / Indicados
    },
    {
      name: "Propostas",
      icon: FileText,
      href: "/dashboard/propostas",
      op: "Op84", // Prospecção / Propostas
    },
    {
      name: "Vendas",
      icon: Percent,
      href: "/dashboard/vendas",
      op: "Op9", // Vendas
    },
    {
      name: "Ordens de Serviço",
      icon: ClipboardList,
      href: "/dashboard/ordens-servico",
      op: "Op52", // OS
    },
    {
      name: "Produtos",
      icon: Package,
      href: "/dashboard/produtos", // Mapped to Products screen
      op: "Op5", // Produtos
    },
    {
      name: "Estoque",
      icon: Boxes,
      href: "/dashboard/estoque",
      op: "Op14", // Baixa / Estoque
    },
    {
      name: "Financeiro",
      icon: DollarSign,
      href: "/dashboard/financeiro",
      op: "Op15", // Contas a Receber
    },
    {
      name: "Compras",
      icon: ShoppingCart,
      href: "/dashboard/compras",
      op: "Op10", // Compras
    },
    {
      name: "Fornecedores",
      icon: Truck,
      href: "/dashboard/fornecedores",
      op: "Op4", // Fornecedores
    },
    {
      name: "Locação",
      icon: Hammer,
      href: "/dashboard/locacao",
      op: "Op52", // OS / Locações
    },
    {
      name: "Contatos",
      icon: Contact,
      href: "/dashboard/contatos",
      op: "Op3", // Clientes / CRM Contatos
    },
    {
      name: "Relatórios",
      icon: BarChart3,
      href: "/dashboard/relatorios",
      op: "Op33", // Relatórios
    },
  ];

  const menuConfig = [
    {
      name: "Configurações",
      icon: Settings,
      href: "/dashboard/configuracoes",
      op: "Op28", // Configurações
    },
    {
      name: "Usuários",
      icon: Users,
      href: "/dashboard/usuarios", // Mapped to Users screen
      op: "Op8", // Senha (Users)
    },
    {
      name: "Permissões",
      icon: ShieldAlert,
      href: "/dashboard/permissoes",
      op: "Op91", // Admin role
    },
    {
      name: "Integrações",
      icon: Network,
      href: "/dashboard/integracoes",
      op: "Op70", // Interoperabilidade
    },
  ];

  // Prevent flicker during server rendering
  if (!mounted) {
    return <aside className="w-64 bg-card border-r border-border flex flex-col h-full shrink-0" />;
  }

  return (
    <aside className={cn(
      "bg-card border-r border-border flex flex-col h-full select-none shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Top Header/Brand */}
      <div className="p-4 flex flex-col gap-4 border-b border-border/40 shrink-0">
        <div className="flex items-center justify-between gap-1">
          <Link href="/dashboard" className="hover:opacity-90 transition-opacity">
            <Logo width={28} height={28} showText={!isCollapsed} />
          </Link>
          
          <button
            onClick={toggleSidebar}
            className="h-6 w-6 rounded bg-secondary/80 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-slate-100 hover:border-border transition-all cursor-pointer outline-none shrink-0"
            title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Current Company Dropdown */}
        {isCollapsed ? (
          <div 
            onClick={toggleSidebar}
            className="bg-background/60 hover:bg-background border border-border/80 rounded-lg h-9 flex items-center justify-center cursor-pointer transition-all duration-200"
            title="SoftLine Sistemas"
          >
            <Network className="h-4 w-4 text-emerald-400 shrink-0" />
          </div>
        ) : (
          <div className="bg-background/60 hover:bg-background border border-border/80 rounded-lg p-2.5 flex items-center justify-between cursor-pointer group transition-all duration-200">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-muted-foreground">Empresa Atual</span>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                SoftLine Sistemas
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-slate-200 transition-colors shrink-0" />
          </div>
        )}
      </div>

      {/* Navigation Body */}
      <div className="flex-1 px-3 py-4 space-y-6">
        {/* Core Nav */}
        <div className="space-y-1">
          <div className="relative group">
            <Link
              href="/dashboard"
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 group overflow-hidden",
                pathname === "/dashboard"
                  ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-400 font-medium pl-4.5"
                  : "text-muted-foreground hover:bg-slate-900/40 hover:text-slate-100",
                isCollapsed && "justify-center px-0"
              )}
            >
              {pathname === "/dashboard" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
              )}
              <LayoutDashboard className={cn("h-4 w-4 shrink-0 transition-colors", pathname === "/dashboard" ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground")} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-900 border border-border text-slate-100 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Dashboard
              </div>
            )}
          </div>
          
          <div className="relative group">
            <Link
              href="/dashboard/favoritos"
              className={cn(
                "relative flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 group overflow-hidden",
                pathname === "/dashboard/favoritos"
                  ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-400 font-medium pl-4.5"
                  : "text-muted-foreground hover:bg-slate-900/40 hover:text-slate-100",
                isCollapsed && "justify-center px-0"
              )}
            >
              {pathname === "/dashboard/favoritos" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
              )}
              <div className="flex items-center gap-3">
                <Star className={cn("h-4 w-4 shrink-0 transition-colors", pathname === "/dashboard/favoritos" ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && <span>Favoritos</span>}
              </div>
              {!isCollapsed && <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />}
            </Link>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-900 border border-border text-slate-100 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Favoritos
              </div>
            )}
          </div>
        </div>

        {/* Modules section */}
        <div className="space-y-1.5">
          {!isCollapsed ? (
            <h2 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left">
              Módulos
            </h2>
          ) : (
            <div className="border-t border-border/40 my-2 mx-1" />
          )}
          <div className="space-y-0.5">
            {menuModules.map((item) => {
              const visible = hasPermission(item.op);
              if (!visible) return null;

              const active = pathname === item.href;

              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 group overflow-hidden",
                      active
                        ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-400 font-medium pl-4.5"
                        : "text-muted-foreground hover:bg-slate-900/40 hover:text-slate-100",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
                    )}
                    <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-900 border border-border text-slate-100 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Configurations Section */}
        <div className="space-y-1.5">
          {!isCollapsed ? (
            <h2 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left">
              Configurações
            </h2>
          ) : (
            <div className="border-t border-border/40 my-2 mx-1" />
          )}
          <div className="space-y-0.5">
            {menuConfig.map((item) => {
              const visible = hasPermission(item.op);
              if (!visible) return null;

              const active = pathname === item.href;

              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 group overflow-hidden",
                      active
                        ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-400 font-medium pl-4.5"
                        : "text-muted-foreground hover:bg-slate-900/40 hover:text-slate-100",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
                    )}
                    <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-900 border border-border text-slate-100 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* bottom news notification box */}
      <div className={cn("border-t border-border/40 shrink-0", isCollapsed ? "p-2 py-4 space-y-4 flex flex-col items-center" : "p-3 space-y-4")}>
        {!isCollapsed ? (
          <div className="bg-[#0F1420] border border-border/80 rounded-lg p-3 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-emerald-400" /> Novidades da Versão
              </span>
              <span className="text-[8px] font-extrabold bg-emerald-500 text-black px-1.5 py-0.5 rounded-full uppercase">
                Novo
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">
              Versão 2026.1.0 liberada! Desfrute do novo dashboard com assistente de IA.
            </p>
          </div>
        ) : (
          <div className="relative group/tooltip cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-[#0F1420] border border-border/80 flex items-center justify-center hover:bg-secondary/40 transition-colors">
              <Info className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 p-3 bg-slate-900 border border-border text-slate-100 text-[10px] rounded shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-1 transition-all duration-200 z-50 w-52 leading-relaxed text-left">
              <div className="font-extrabold text-emerald-400 mb-1 flex items-center justify-between">
                <span>Versão 2026.1.0</span>
                <span className="bg-emerald-500 text-black text-[8px] px-1 rounded font-extrabold uppercase">Novo</span>
              </div>
              Desfrute do novo dashboard com assistente de IA.
            </div>
          </div>
        )}

        {/* Footer Support and Logout */}
        <div className="flex flex-col gap-0.5 w-full">
          <div className="relative group/tooltip w-full">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all group",
                isCollapsed && "justify-center px-0"
              )}
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
              {!isCollapsed && <span>Suporte</span>}
            </a>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-900 border border-border text-slate-100 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Suporte
              </div>
            )}
          </div>
          
          <div className="relative group/tooltip w-full">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-rose-400 hover:bg-rose-950/25 hover:text-rose-300 transition-all group cursor-pointer text-left w-full border-0 bg-transparent font-semibold",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-4 w-4 text-rose-400 group-hover:text-rose-300 shrink-0" />
              {!isCollapsed && <span>Sair do Sistema</span>}
            </button>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-900 border border-border text-slate-100 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Sair do Sistema
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
