"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, ChevronDown, LogOut, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { SessionData } from "@/lib/auth";

interface HeaderProps {
  session: SessionData | null;
}

export default function Header({ session }: HeaderProps) {
  const userName = session?.nome || "Ramon Silva";
  const userRole = session?.role || "Administrador";
  const [photo, setPhoto] = useState(session?.foto || "");
  const [source, setSource] = useState("");
  const [zoom, setZoom] = useState(1);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const profileMenu = useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (profileMenu.current && !profileMenu.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const choosePhoto = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => { setSource(String(reader.result)); setZoom(1); };
    reader.readAsDataURL(file);
  };

  const savePhoto = async () => {
    if (!source || !session) return;
    setSavingPhoto(true);
    const image = new Image();
    image.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 320;
      const context = canvas.getContext("2d");
      if (!context) return;
      const size = Math.min(image.width, image.height) / zoom;
      context.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, 320, 320);
      const cropped = canvas.toDataURL("image/jpeg", 0.9);
      const res = await fetch(`/api/usuarios/${session.id}/foto`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: cropped }) });
      const data = await res.json();
      if (res.ok) { setPhoto(data.foto); setSource(""); }
      setSavingPhoto(false);
    };
    image.src = source;
  };

  return (
    <header className="h-16 border-b border-border bg-[#F8FAFC] flex items-center justify-between px-6 select-none shrink-0 z-40">
      {/* Profile panel */}
      <div className="relative ml-auto flex items-center justify-end" ref={profileMenu}>
        {/* Administrator Profile Card */}
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); photoInput.current?.click(); }}
          className="relative h-9 w-9 rounded-lg overflow-hidden border border-border bg-emerald-50 flex items-center justify-center font-bold text-emerald-700 select-none text-xs group/avatar"
          title="Alterar foto de perfil"
        >
          {photo ? <img src={photo} alt={`Foto de ${userName}`} className="h-full w-full object-cover" /> : userName.substring(0, 2).toUpperCase()}
          <span className="absolute inset-0 hidden group-hover/avatar:flex bg-black/55 items-center justify-center"><Camera className="h-3.5 w-3.5 text-white" /></span>
        </button>
        <button
          type="button"
          onClick={() => setIsProfileMenuOpen((open) => !open)}
          aria-expanded={isProfileMenuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 text-left group hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
        >
          <div className="flex flex-col text-right select-none">
            <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
              {userName}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {userRole}
            </span>
          </div>

          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground group-hover:text-slate-800 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
        </button>
        {isProfileMenuOpen && (
          <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-[#FFFFFF] p-1.5 shadow-2xl">
            <button type="button" role="menuitem" onClick={() => { setIsProfileMenuOpen(false); photoInput.current?.click(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-800 hover:bg-secondary">
              <UserRound className="h-4 w-4 text-emerald-700" /> Alterar foto do perfil
            </button>
            <div className="my-1 border-t border-border/60" />
            <button type="button" role="menuitem" onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-rose-700 hover:bg-rose-500/10">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        )}
      </div>
      <input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => choosePhoto(e.target.files?.[0])} />
      {source && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-[#FFFFFF] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold">Recortar foto de perfil</h2><button onClick={() => setSource("")}><X className="h-4 w-4" /></button></div>
            <div className="mx-auto h-56 w-56 overflow-hidden rounded-full border-2 border-emerald-400 bg-slate-50"><img src={source} alt="Prévia do recorte" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} /></div>
            <label className="mt-4 block text-xs text-slate-600">Zoom<input type="range" min="1" max="2.5" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-2 w-full" /></label>
            <button onClick={savePhoto} disabled={savingPhoto} className="mt-4 h-9 w-full rounded-md bg-emerald-500 text-xs font-bold text-black disabled:opacity-60">{savingPhoto ? "Salvando..." : "Usar esta foto"}</button>
          </div>
        </div>
      )}
    </header>
  );
}
