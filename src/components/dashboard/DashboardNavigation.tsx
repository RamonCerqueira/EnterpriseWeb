"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookMarked,
  Building2,
  Calculator,
  ChevronDown,
  CreditCard,
  Database,
  Landmark,
  Menu,
  Package,
  Settings,
  ShieldAlert,
  Truck,
  Users,
  Contact,
  Network,
  X,
} from "lucide-react";
import { SessionData } from "@/lib/auth";
import { cn } from "@/lib/utils";

const menuGroups = [
  {
    name: "Cadastros",
    icon: Database,
    items: [
      { name: "Clientes", href: "/dashboard/clientes", op: "Op3", icon: Users },
      { name: "Fornecedores", href: "/dashboard/fornecedores", op: "Op4", icon: Truck },
      { name: "Contatos", href: "/dashboard/contatos", op: "Op3", icon: Contact },
      { name: "Colaboradores", href: "/dashboard/usuarios?view=colaboradores", op: "Op8", icon: Users },
      { name: "Grupo de Segmentos", href: "/dashboard/cadastros?model=Grup_Seg", op: "Op60", icon: BookMarked },
      { name: "Segmentos de Atividade", href: "/dashboard/cadastros?model=Segmento", op: "Op29", icon: BookMarked },
    ],
  },
  {
    name: "Tabela",
    icon: Package,
    items: [
      { name: "Tabela de Preços", href: "/dashboard/tabela", op: "Op5", icon: Package },
      { name: "Forma de Pagamento", href: "/dashboard/cadastros?model=Forma", op: "Op19", icon: CreditCard },
      { name: "Tipo Contábil", href: "/dashboard/cadastros?model=Tipo", op: "Op20", icon: Calculator },
      { name: "Conta Bancária", href: "/dashboard/cadastros?model=Banco", op: "Op15", icon: Landmark },
      { name: "Referências", href: "/dashboard/cadastros?model=Ref_Ban", op: "Op15", icon: BookMarked },
    ],
  },
  {
    name: "Configurações",
    icon: Settings,
    items: [
      { name: "Usuários", href: "/dashboard/usuarios?view=usuarios", op: "Op8", icon: Users },
      { name: "Permissões", href: "/dashboard/permissoes", op: "Op91", icon: ShieldAlert },
      { name: "Empresa", href: "/dashboard/configuracoes", op: "Op28", icon: Building2 },
      { name: "Integrações", href: "/dashboard/integracoes", op: "Op70", icon: Network },
    ],
  },
];

interface DashboardNavigationProps {
  session: SessionData | null;
}

export default function DashboardNavigation({ session }: DashboardNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navigationRef.current && !navigationRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  const hasPermission = (operation: string) =>
    !!session && (session.role === "Administrador" || !!session.permissions?.["Op91"] || !!session.permissions?.[operation]);

  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    return pathname === path && searchParams.toString() === (query ?? "");
  };

  return (
    <div ref={navigationRef} className="relative flex items-center">
      <Link
        href="/dashboard"
        className={cn(
          "hidden rounded-lg px-3 py-2 text-sm font-semibold transition-colors md:inline-flex",
          pathname === "/dashboard" ? "bg-emerald-500/10 text-emerald-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        Visão geral
      </Link>

      <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
        {menuGroups.map(group => {
          const items = group.items.filter(item => hasPermission(item.op));
          if (!items.length) return null;
          const active = items.some(item => isActive(item.href));
          const expanded = openGroup === group.name;
          const GroupIcon = group.icon;

          return (
            <div key={group.name} className="relative">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpenGroup(expanded ? null : group.name)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  active || expanded ? "bg-emerald-500/10 text-emerald-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <GroupIcon className="h-4 w-4" />
                {group.name}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-60 rounded-xl border border-border/80 bg-white p-1.5 shadow-xl">
                  {items.map(item => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpenGroup(null)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          isActive(item.href) ? "bg-emerald-500/10 font-semibold text-emerald-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <ItemIcon className="h-4 w-4 shrink-0" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setMobileOpen(open => !open)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/70 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:hidden"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menu
      </button>

      {mobileOpen && (
        <div className="fixed left-3 right-3 top-[4.25rem] z-50 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-border/80 bg-white p-2 shadow-xl md:hidden">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Visão geral
          </Link>
          {menuGroups.map(group => {
            const items = group.items.filter(item => hasPermission(item.op));
            if (!items.length) return null;
            const expanded = openGroup === group.name;
            const GroupIcon = group.icon;
            return (
              <section key={group.name} className="border-t border-border/50 first:border-t-0">
                <button type="button" aria-expanded={expanded} onClick={() => setOpenGroup(expanded ? null : group.name)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  <GroupIcon className="h-4 w-4 text-emerald-700" />
                  <span className="flex-1">{group.name}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
                </button>
                {expanded && <div className="mb-2 ml-5 border-l border-border/60 pl-2">
                  {items.map(item => {
                    const ItemIcon = item.icon;
                    return <Link key={item.name} href={item.href} onClick={() => { setOpenGroup(null); setMobileOpen(false); }} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm", isActive(item.href) ? "bg-emerald-500/10 font-semibold text-emerald-800" : "text-slate-600 hover:bg-slate-100")}><ItemIcon className="h-4 w-4 shrink-0" />{item.name}</Link>;
                  })}
                </div>}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
