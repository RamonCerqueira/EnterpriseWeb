"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Plus } from "lucide-react";

interface ParametrosTabProps {
  data: any;
  onChange: (field: string, val: any) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>, logoField: "Logo" | "Logo2") => void;
}

export default function ParametrosTab({ data, onChange, onLogoUpload }: ParametrosTabProps) {
  const [paramSubTab, setParamSubTab] = useState("contador");

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Sub-tabs inside parameters */}
      <div className="flex border-b border-border/30 gap-1 overflow-x-auto shrink-0 pb-1 bg-slate-950/20 p-0.5 rounded">
        {[
          { id: "contador", label: "Contato & Contador" },
          { id: "certificado", label: "Certificados" },
          { id: "observacao", label: "Anotações Internas" },
          { id: "logotipos", label: "Logotipos / Imagens" },
        ].map((pTab) => (
          <button
            key={pTab.id}
            type="button"
            onClick={() => setParamSubTab(pTab.id)}
            className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap outline-none ${
              paramSubTab === pTab.id
                ? "bg-cyan-500 text-black font-black"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#05080E]/20"
            }`}
          >
            {pTab.label}
          </button>
        ))}
      </div>

      {/* PARAMETER CONTROLS */}
      <div className="pt-2">
        
        {/* Param Sub-tab 1: Contador */}
        {paramSubTab === "contador" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Contato Principal / Resp.</label>
              <Input
                type="text"
                value={data.Contato || ""}
                onChange={(e) => onChange("Contato", e.target.value)}
                className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Nome do Contador</label>
              <Input
                type="text"
                value={data.Contador || ""}
                onChange={(e) => onChange("Contador", e.target.value)}
                className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Registro CRC Contador</label>
              <Input
                type="text"
                value={data.CRC || ""}
                onChange={(e) => onChange("CRC", e.target.value)}
                className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 text-cyan-400 focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Param Sub-tab 2: Certificado */}
        {paramSubTab === "certificado" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Arquivo / Caminho Certificado</label>
              <Input
                type="text"
                value={data.Certificado || ""}
                onChange={(e) => onChange("Certificado", e.target.value)}
                className="h-8.5 bg-[#05080E]/90 font-mono text-[10px] font-bold border-border/80 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Razão Social do Certificado Digital</label>
              <Input
                type="text"
                value={data.CertificadoRazao || ""}
                onChange={(e) => onChange("CertificadoRazao", e.target.value)}
                className="h-8.5 bg-[#05080E]/90 text-[10px] font-bold border-border/80 focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Param Sub-tab 3: Observações */}
        {paramSubTab === "observacao" && (
          <div className="space-y-1 animate-fade-in">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">Observações / Anotações Fiscais e Jurídicas</label>
            <textarea
              value={data.Observacao || ""}
              onChange={(e) => onChange("Observacao", e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-border/80 bg-[#05080E]/90 text-[10px] font-semibold text-slate-200 p-3 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        )}

        {/* Param Sub-tab 4: Logos (Preview base64) */}
        {paramSubTab === "logotipos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
            
            {/* Logo 1 */}
            <div className="space-y-3 bg-slate-950/45 p-4 rounded-xl border border-border/30">
              <span className="text-[9px] font-black text-cyan-400 uppercase block">Logotipo Principal (Logo 1)</span>
              <div className="h-[100px] w-[250px] bg-slate-900 border border-dashed border-border/80 rounded-lg flex items-center justify-center overflow-hidden relative mx-auto shadow-md">
                {data.Logo ? (
                  <img 
                    src={data.Logo} 
                    alt="Logo 1 Filial" 
                    className="h-full w-full object-contain animate-fade-in"
                  />
                ) : (
                  <div className="text-center p-3 flex flex-col items-center justify-center gap-1">
                    <ImageIcon className="h-6 w-6 text-muted-foreground animate-pulse" />
                    <span className="text-[8px] text-muted-foreground">Sem logotipo principal</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <label className="inline-flex h-8 px-4 rounded bg-[#05080E] border border-border hover:bg-slate-900 text-[10px] font-bold items-center justify-center gap-1.5 cursor-pointer">
                  <Plus className="h-3.5 w-3.5" /> Selecionar Imagem
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => onLogoUpload(e, "Logo")}
                    className="hidden"
                  />
                </label>
                <span className="text-[8px] text-muted-foreground block mt-1">Tamanho recomendado: 250 x 100 px</span>
              </div>
            </div>

            {/* Logo 2 */}
            <div className="space-y-3 bg-slate-950/45 p-4 rounded-xl border border-border/30">
              <span className="text-[9px] font-black text-cyan-400 uppercase block">Logotipo Secundário (Logo 2)</span>
              <div className="h-[100px] w-[250px] bg-slate-900 border border-dashed border-border/80 rounded-lg flex items-center justify-center overflow-hidden relative mx-auto shadow-md">
                {data.Logo2 ? (
                  <img 
                    src={data.Logo2} 
                    alt="Logo 2 Filial" 
                    className="h-full w-full object-contain animate-fade-in"
                  />
                ) : (
                  <div className="text-center p-3 flex flex-col items-center justify-center gap-1">
                    <ImageIcon className="h-6 w-6 text-muted-foreground animate-pulse" />
                    <span className="text-[8px] text-muted-foreground">Sem logotipo secundário</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <label className="inline-flex h-8 px-4 rounded bg-[#05080E] border border-border hover:bg-slate-900 text-[10px] font-bold items-center justify-center gap-1.5 cursor-pointer">
                  <Plus className="h-3.5 w-3.5" /> Selecionar Imagem
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => onLogoUpload(e, "Logo2")}
                    className="hidden"
                  />
                </label>
                <span className="text-[8px] text-muted-foreground block mt-1">Tamanho recomendado: 250 x 100 px</span>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
