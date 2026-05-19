"use client";

import React from "react";
import { Search, Plus, Bell, MessageSquare, HelpCircle, ChevronDown } from "lucide-react";
import { SessionData } from "@/lib/auth";

interface HeaderProps {
  session: SessionData | null;
}

export default function Header({ session }: HeaderProps) {
  const userName = session?.nome || "Ramon Silva";
  const userRole = session?.role || "Administrador";

  return (
    <header className="h-16 border-b border-border bg-[#0B0F19] flex items-center justify-between px-6 select-none shrink-0 z-40">
      {/* Global Search Bar */}
      <div className="relative w-96 max-w-md hidden md:block">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Buscar clientes, propostas, OS, produtos..."
          className="w-full h-9 pl-9 pr-14 rounded-lg bg-[#0F1420] border border-border/80 text-xs text-slate-200 placeholder:text-muted-foreground/75 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="text-[9px] font-mono bg-secondary px-1.5 py-0.5 border border-border/60 rounded text-muted-foreground uppercase shadow-sm">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right Side Icons & Profile Panel */}
      <div className="flex items-center gap-4 ml-auto md:ml-0">
        {/* Quick Action green button */}
        <button
          className="h-8 w-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_0_10px_rgba(16,185,129,0.25)] hover:scale-105"
          title="Ações Rápidas"
        >
          <Plus className="h-4 w-4 font-bold" />
        </button>

        {/* Notifications Bell with Badge */}
        <button className="relative h-9 w-9 bg-card border border-border/60 hover:bg-secondary rounded-lg flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
            8
          </span>
        </button>

        {/* Message bubble */}
        <button className="h-9 w-9 bg-card border border-border/60 hover:bg-secondary rounded-lg flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-all hidden sm:flex">
          <MessageSquare className="h-4 w-4" />
        </button>

        {/* Help Question circle */}
        <button className="h-9 w-9 bg-card border border-border/60 hover:bg-secondary rounded-lg flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-all hidden sm:flex">
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Vertical divider */}
        <span className="h-6 w-px bg-border/60 hidden sm:block"></span>

        {/* Administrator Profile Card */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-1 group">
          {/* Mock Avatar */}
          <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-border bg-emerald-950/40 flex items-center justify-center font-bold text-emerald-400 select-none text-xs">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="flex flex-col text-left select-none">
            <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
              {userName}
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-medium">
              {userRole}
            </span>
          </div>

          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-slate-200 transition-colors" />
        </div>
      </div>
    </header>
  );
}
