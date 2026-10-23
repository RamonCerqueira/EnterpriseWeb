"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Network } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface Company {
  id: number;
  nome: string;
  razao: string;
  cnpj: string;
  Logo?: string | null;
}

export default function CompanySwitcher() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCompany = localStorage.getItem("active-company");
    if (savedCompany) {
      try {
        setActiveCompany(JSON.parse(savedCompany));
      } catch (error) {
        console.error("Failed to parse active-company", error);
      }
    }

    fetch("/api/empresas")
      .then(async response => response.ok ? response.json() : [])
      .then((data: Company[]) => {
        setCompanies(data);
        if (!savedCompany && data.length > 0) {
          setActiveCompany(data[0]);
          localStorage.setItem("active-company", JSON.stringify(data[0]));
        }
      })
      .catch(error => console.error("Failed to fetch companies", error));

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!activeCompany?.id) {
      setLogo(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/empresas/${activeCompany.id}`)
      .then(async response => response.ok ? response.json() : null)
      .then(company => { if (!cancelled) setLogo(company?.Logo || null); })
      .catch(error => { if (!cancelled) console.error("Failed to load company logo", error); });
    return () => { cancelled = true; };
  }, [activeCompany?.id]);

  useEffect(() => {
    const refreshLogo = () => {
      if (!activeCompany?.id) return;
      fetch(`/api/empresas/${activeCompany.id}`)
        .then(async response => response.ok ? response.json() : null)
        .then(company => setLogo(company?.Logo || null))
        .catch(error => console.error("Failed to refresh company logo", error));
    };
    window.addEventListener("companyBrandChanged", refreshLogo);
    return () => window.removeEventListener("companyBrandChanged", refreshLogo);
  }, [activeCompany?.id]);

  const selectCompany = (company: Company) => {
    setActiveCompany(company);
    localStorage.setItem("active-company", JSON.stringify(company));
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("activeCompanyChanged", { detail: company }));
  };

  return (
    <div ref={rootRef} className="relative flex min-w-0 items-center">
      <button type="button" aria-expanded={isOpen} onClick={() => setIsOpen(open => !open)} className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-slate-100">
        <Logo width={34} height={34} logoSrc={logo} companyName={activeCompany?.nome} />
        <span className="hidden max-w-36 truncate text-xs font-semibold text-slate-700 lg:inline">{activeCompany?.nome || "SoftLine Sistemas"}</span>
        <ChevronDown className={`hidden h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform lg:block ${isOpen ? "rotate-180" : ""}`} />
        <Network className="h-4 w-4 shrink-0 text-emerald-700 lg:hidden" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border/80 bg-white p-1.5 shadow-xl">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">Empresa atual</div>
          <div className="max-h-64 overflow-y-auto">
            {companies.map(company => {
              const selected = activeCompany?.id === company.id;
              return (
                <button key={company.id} type="button" onClick={() => selectCompany(company)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${selected ? "bg-emerald-500/10 font-semibold text-emerald-800" : "text-slate-700 hover:bg-slate-100"}`}>
                  <span className="min-w-0"><span className="block truncate">{company.nome}</span>{company.cnpj && <span className="mt-0.5 block truncate text-[10px] text-slate-500">CNPJ: {company.cnpj}</span>}</span>
                  {selected && <Check className="ml-3 h-4 w-4 shrink-0 text-emerald-700" />}
                </button>
              );
            })}
            {companies.length === 0 && <div className="px-3 py-4 text-xs text-slate-500">Nenhuma empresa disponível</div>}
          </div>
        </div>
      )}
    </div>
  );
}
