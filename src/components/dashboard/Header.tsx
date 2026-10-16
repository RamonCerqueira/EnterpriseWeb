"use client";

import React, { useRef, useState } from "react";
import { ChevronDown, Camera, X } from "lucide-react";
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
    <header className="h-16 border-b border-border bg-[#0B0F19] flex items-center justify-between px-6 select-none shrink-0 z-40">
      {/* Profile panel */}
      <div className="ml-auto flex items-center justify-end">
        {/* Administrator Profile Card */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-1 group">
          <button onClick={() => photoInput.current?.click()} className="relative h-9 w-9 rounded-lg overflow-hidden border border-border bg-emerald-950/40 flex items-center justify-center font-bold text-emerald-400 select-none text-xs group/avatar" title="Alterar foto de perfil">
            {photo ? <img src={photo} alt={`Foto de ${userName}`} className="h-full w-full object-cover" /> : userName.substring(0, 2).toUpperCase()}
            <span className="absolute inset-0 hidden group-hover/avatar:flex bg-black/55 items-center justify-center"><Camera className="h-3.5 w-3.5 text-white" /></span>
          </button>
          
          <div className="flex flex-col text-right select-none">
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
      <input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => choosePhoto(e.target.files?.[0])} />
      {source && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-[#121826] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold">Recortar foto de perfil</h2><button onClick={() => setSource("")}><X className="h-4 w-4" /></button></div>
            <div className="mx-auto h-56 w-56 overflow-hidden rounded-full border-2 border-emerald-400 bg-slate-900"><img src={source} alt="Prévia do recorte" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} /></div>
            <label className="mt-4 block text-xs text-slate-300">Zoom<input type="range" min="1" max="2.5" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-2 w-full" /></label>
            <button onClick={savePhoto} disabled={savingPhoto} className="mt-4 h-9 w-full rounded-md bg-emerald-500 text-xs font-bold text-black disabled:opacity-60">{savingPhoto ? "Salvando..." : "Usar esta foto"}</button>
          </div>
        </div>
      )}
    </header>
  );
}
