"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Database,
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
  Sun,
  Search,
  Check,
  CreditCard,
  Calculator,
  Landmark,
  BookMarked,
  Building2,
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
  const searchParams = useSearchParams();

  // Sidebar collapse states
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // States for Interactive Company Selector
  interface Company {
    id: number;
    nome: string;
    razao: string;
    cnpj: string;
  }

  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [activeCompanyLogo, setActiveCompanyLogo] = useState<string | null>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }

    // Load active company from localStorage
    const savedCompany = localStorage.getItem("active-company");
    if (savedCompany) {
      try {
        setActiveCompany(JSON.parse(savedCompany));
      } catch (e) {
        console.error("Failed to parse active-company", e);
      }
    }

    setMounted(true);

    // Fetch all active companies from backend
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/empresas");
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
          
          // Default to first company if none selected yet
          if (!savedCompany && data.length > 0) {
            const firstCompany = data[0];
            setActiveCompany(firstCompany);
            localStorage.setItem("active-company", JSON.stringify(firstCompany));
          }
        }
      } catch (err) {
        console.error("Failed to fetch companies in Sidebar:", err);
      }
    };

    fetchCompanies();
  }, []);

  // The selected company owns the brand shown in the navigation. The existing
  // SoftLine mark remains visible while no logo has been registered.
  useEffect(() => {
    if (!activeCompany?.id) {
      setActiveCompanyLogo(null);
      return;
    }

    setActiveCompanyLogo(null);
    let cancelled = false;
    const loadCompanyLogo = async () => {
      try {
        const res = await fetch(`/api/empresas/${activeCompany.id}`);
        if (!res.ok || cancelled) return;

        const company = await res.json();
        if (!cancelled) setActiveCompanyLogo(company.Logo || null);
      } catch (err) {
        if (!cancelled) {
          setActiveCompanyLogo(null);
          console.error("Failed to load active company logo:", err);
        }
      }
    };

    loadCompanyLogo();

    const handleBrandChange = () => loadCompanyLogo();
    window.addEventListener("companyBrandChanged", handleBrandChange);
    return () => {
      cancelled = true;
      window.removeEventListener("companyBrandChanged", handleBrandChange);
    };
  }, [activeCompany?.id]);

  // Click outside listener for company dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const handleCompanySelect = (company: Company) => {
    setActiveCompany(company);
    localStorage.setItem("active-company", JSON.stringify(company));
    setIsCompanyDropdownOpen(false);
    setCompanySearch("");
    
    // Dispatch custom event for system-wide sync
    window.dispatchEvent(new CustomEvent("activeCompanyChanged", { detail: company }));
  };

  const filteredCompanies = companies.filter(c =>
    c.nome.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.cnpj.toLowerCase().includes(companySearch.toLowerCase())
  );

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

  const cadastroGroups = [
    {
      name: "",
      items: [
        { name: "Clientes", href: "/dashboard/clientes", op: "Op3", icon: Users },
        { name: "Fornecedores", href: "/dashboard/fornecedores", op: "Op4", icon: Truck },
        { name: "Contatos", href: "/dashboard/contatos", op: "Op3", icon: Contact },
        { name: "Colaboradores", href: "/dashboard/usuarios?view=colaboradores", op: "Op8", icon: Users },
      ],
    },
    {
      name: "Módulo Financeiro",
      items: [
        { name: "Tabela", href: "/dashboard/tabela", op: "Op5", icon: Package },
        { name: "Forma de Pagamento", href: "/dashboard/cadastros?model=Forma", op: "Op19", icon: CreditCard },
        { name: "Tipo Contábil", href: "/dashboard/cadastros?model=Tipo", op: "Op20", icon: Calculator },
        { name: "Conta Bancária", href: "/dashboard/cadastros?model=Banco", op: "Op15", icon: Landmark },
        { name: "Referências", href: "/dashboard/cadastros?model=Ref_Ban", op: "Op15", icon: BookMarked },
      ],
    },
    {
      name: "Configurações",
      items: [
        { name: "Usuários", href: "/dashboard/usuarios?view=usuarios", op: "Op8", icon: Users },
        { name: "Permissões", href: "/dashboard/permissoes", op: "Op91", icon: ShieldAlert },
        { name: "Empresa", href: "/dashboard/configuracoes", op: "Op28", icon: Building2 },
        { name: "Integrações", href: "/dashboard/integracoes", op: "Op70", icon: Network },
      ],
    },
  ];

  const hiddenMenuModules = [
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
      name: "Serviços",
      icon: ClipboardList,
      href: "/dashboard/servicos", // Mapped to Services screen
      op: "Op5", // Mapped to Products / Services permission
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

  const menuModules = cadastroGroups.flatMap(group => group.items.map(item => ({ ...item, section: group.name })));
  void hiddenMenuModules;

  const hiddenMenuConfig = [
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
      name: "Cadastros",
      icon: Database,
      href: "/dashboard/cadastros",
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
            <Logo
              width={38}
              height={38}
              showText={!isCollapsed}
              logoSrc={activeCompanyLogo}
              companyName={activeCompany?.nome}
            />
          </Link>
          
          <button
            onClick={toggleSidebar}
            className="h-6 w-6 rounded bg-secondary/80 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-slate-800 hover:border-border transition-all cursor-pointer outline-none shrink-0"
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
            title={activeCompany ? activeCompany.nome : "SoftLine Sistemas"}
          >
            <Network className="h-4 w-4 text-emerald-700 shrink-0" />
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className={cn(
                "bg-background/60 hover:bg-background border border-border/80 rounded-lg p-2.5 flex items-center justify-between cursor-pointer group transition-all duration-200 select-none",
                isCompanyDropdownOpen && "border-emerald-500/80 bg-background/80 ring-1 ring-emerald-500/30"
              )}
            >
              <div className="flex flex-col text-left min-w-0 pr-2">
                <span className="text-[10px] text-muted-foreground">Empresa Atual</span>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors truncate max-w-[150px]">
                  {activeCompany ? activeCompany.nome : "SoftLine Sistemas"}
                </span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground group-hover:text-slate-800 transition-all shrink-0",
                isCompanyDropdownOpen && "transform rotate-180 text-emerald-700"
              )} />
            </div>

            {/* Premium Dropdown list */}
            {isCompanyDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1.5 bg-[#FFFFFF]/95 backdrop-blur-md border border-border/85 rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in text-left">
                {/* Search bar inside dropdown */}
                <div className="p-2 border-b border-border/40 relative">
                  <input
                    type="text"
                    placeholder="Buscar filial..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#F8FAFC]/75 border border-border/60 text-xs text-slate-800 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/80 transition-all"
                  />
                  <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-4.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* List items */}
                <div className="max-h-52 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
                  {filteredCompanies.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground font-semibold">
                      Nenhuma filial encontrada
                    </div>
                  ) : (
                    filteredCompanies.map((c) => {
                      const isSelected = activeCompany?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => handleCompanySelect(c)}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 group",
                            isSelected
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700"
                              : "hover:bg-slate-50/60 text-slate-600 hover:text-slate-800 border border-transparent"
                          )}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs font-bold truncate group-hover:text-emerald-700 transition-colors">
                              {c.nome}
                            </span>
                            {c.cnpj && (
                              <span className="text-[9px] text-muted-foreground mt-0.5 truncate">
                                CNPJ: {c.cnpj}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer stats */}
                <div className="p-2 border-t border-border/20 bg-[#F8FAFC]/50 flex items-center justify-between text-[9px] text-muted-foreground font-bold px-3 uppercase tracking-wider">
                  <span>Filiais: {companies.length}</span>
                  <Link 
                    href="/dashboard/configuracoes" 
                    onClick={() => setIsCompanyDropdownOpen(false)}
                    className="text-emerald-700 hover:text-emerald-700 flex items-center gap-0.5"
                  >
                    Gerenciar <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Body */}
      <div className="flex-1 px-3 py-4 space-y-6">
        {/* Core navigation */}
        <div className="space-y-1">
          <div className="relative group">
            <Link
              href="/dashboard"
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 group overflow-hidden",
                pathname === "/dashboard"
                  ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-700 font-medium pl-4.5"
                  : "text-muted-foreground hover:bg-slate-50/40 hover:text-slate-800",
                isCollapsed && "justify-center px-0"
              )}
            >
              {pathname === "/dashboard" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
              )}
              <LayoutDashboard className={cn("h-4 w-4 shrink-0 transition-colors", pathname === "/dashboard" ? "text-emerald-700" : "text-muted-foreground group-hover:text-foreground")} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-50 border border-border text-slate-800 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Dashboard
              </div>
            )}
          </div>
          
          <div className="relative group hidden">
            <Link
              href="/dashboard/favoritos"
              className={cn(
                "relative flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 group overflow-hidden",
                pathname === "/dashboard/favoritos"
                  ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-700 font-medium pl-4.5"
                  : "text-muted-foreground hover:bg-slate-50/40 hover:text-slate-800",
                isCollapsed && "justify-center px-0"
              )}
            >
              {pathname === "/dashboard/favoritos" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
              )}
              <div className="flex items-center gap-3">
                <Star className={cn("h-4 w-4 shrink-0 transition-colors", pathname === "/dashboard/favoritos" ? "text-emerald-700" : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && <span>Favoritos</span>}
              </div>
              {!isCollapsed && <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />}
            </Link>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-50 border border-border text-slate-800 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Favoritos
              </div>
            )}
          </div>
        </div>

        {/* Cadastros section */}
        <div className="space-y-1.5">
          {!isCollapsed ? (
            <h2 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left">
              Cadastros
            </h2>
          ) : (
            <div className="border-t border-border/40 my-2 mx-1" />
          )}
          <div className="space-y-0.5">
            {menuModules.map((item, index) => {
              const visible = hasPermission(item.op);
              if (!visible) return null;

              const [itemPath, itemSearch] = item.href.split("?");
              const active = pathname === itemPath && searchParams.toString() === (itemSearch ?? "");

              return (
                <div key={item.name} className="relative group">
                  {item.section && (index === 0 || menuModules[index - 1].section !== item.section) && !isCollapsed && (
                    <h2 className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground first:pt-0">{item.section}</h2>
                  )}
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 group overflow-hidden",
                      active
                        ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-700 font-medium pl-4.5"
                        : "text-muted-foreground hover:bg-slate-50/40 hover:text-slate-800",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
                    )}
                    <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-emerald-700" : "text-muted-foreground group-hover:text-foreground")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-50 border border-border text-slate-800 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legacy configuration links are intentionally hidden. */}
        <div className="hidden space-y-1.5">
          {!isCollapsed ? (
            <h2 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left">
              Configurações
            </h2>
          ) : (
            <div className="border-t border-border/40 my-2 mx-1" />
          )}
          <div className="space-y-0.5">
            {hiddenMenuConfig.map((item) => {
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
                        ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/2 to-transparent text-emerald-700 font-medium pl-4.5"
                        : "text-muted-foreground hover:bg-slate-50/40 hover:text-slate-800",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-md bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
                    )}
                    <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-emerald-700" : "text-muted-foreground group-hover:text-foreground")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-50 border border-border text-slate-800 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
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
          <div className="bg-[#FFFFFF] border border-border/80 rounded-lg p-3 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-emerald-700" /> Novidades da Versão
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
            <div className="h-8 w-8 rounded-lg bg-[#FFFFFF] border border-border/80 flex items-center justify-center hover:bg-secondary/40 transition-colors">
              <Info className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 p-3 bg-slate-50 border border-border text-slate-800 text-[10px] rounded shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-1 transition-all duration-200 z-50 w-52 leading-relaxed text-left">
              <div className="font-extrabold text-emerald-700 mb-1 flex items-center justify-between">
                <span>Versão 2026.1.0</span>
                <span className="bg-emerald-500 text-black text-[8px] px-1 rounded font-extrabold uppercase">Novo</span>
              </div>
              Desfrute do novo dashboard com assistente de IA.
            </div>
          </div>
        )}

        {/* Light theme indicator */}
        {!isCollapsed ? (
          <div className="mt-1 border-t border-border/60 pt-2">
            <span className="mb-1.5 block text-left text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              Apar?ncia
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[10px] font-bold text-emerald-800">
              <Sun className="h-3.5 w-3.5 shrink-0" />
              <span>Tema claro</span>
            </div>
          </div>
        ) : (
          <div className="relative group/tooltip">
            <div
              aria-label="Tema claro ativo"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              <Sun className="h-4 w-4" />
            </div>
            <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded border border-border bg-white px-2 py-1.5 text-[10px] font-bold text-slate-800 opacity-0 shadow-xl transition-all duration-200 group-hover/tooltip:translate-x-1 group-hover/tooltip:opacity-100">
              Tema claro
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
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-50 border border-border text-slate-800 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Suporte
              </div>
            )}
          </div>
          
          <div className="relative group/tooltip w-full">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-rose-700 hover:bg-rose-50 hover:text-rose-700 transition-all group cursor-pointer text-left w-full border-0 bg-transparent font-semibold",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-4 w-4 text-rose-700 group-hover:text-rose-700 shrink-0" />
              {!isCollapsed && <span>Sair do Sistema</span>}
            </button>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1.5 bg-slate-50 border border-border text-slate-800 text-[10px] font-bold rounded shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap">
                Sair do Sistema
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
