"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, BrainCircuit, CornerDownLeft } from "lucide-react";
import { SessionData } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface AiAssistantProps {
  session: SessionData | null;
}

export default function AiAssistant({ session }: AiAssistantProps) {
  const userName = session?.nome?.split(" ")[0] || "Ramon";
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Olá ${userName}! Sou o SoftLine Assistente IA. Posso ajudar você com análises financeiras, controle de estoque ou relatórios hoje?`,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const suggestions = [
    { label: "Resumo financeiro da semana", value: "me de o resumo financeiro da semana" },
    { label: "Clientes inadimplentes", value: "quais clientes estao inadimplentes?" },
    { label: "Propostas para aprovação", value: "quais propostas estao aguardando aprovacao?" },
    { label: "Performance de vendas", value: "como esta a nossa performance de vendas?" },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = "";
      const lower = text.toLowerCase();

      if (lower.includes("financeiro") || lower.includes("resumo")) {
        aiText = `Aqui está o resumo financeiro consolidado: \n\n• **Receitas Recorrentes:** R$ 48.200,00 (Fluxo de Caixa).\n• **Recebimentos hoje:** R$ 12.480,00.\n• **Contas a Receber Vencidas:** R$ 28.650,50 (12 títulos vencidos).\n\nRecomendo enviar lembretes de cobrança automáticos para reverter o saldo devedor.`;
      } else if (lower.includes("inadimplente") || lower.includes("cliente")) {
        aiText = `Atualmente, temos **12 títulos vencidos** que totalizam **R$ 28.650,50**. O principal cliente inadimplente listado é **João da Silva ME** (duplicata vencida no valor de R$ 1.250,00). Deseja gerar o boleto com juros e multa atualizados?`;
      } else if (lower.includes("proposta") || lower.includes("aprovacao")) {
        aiText = `Temos **4 propostas aguardando aprovação**, somando **R$ 47.890,00**. A proposta de maior valor é da **Empresa ABC Ltda** (R$ 3.450,00). Quer que eu envie uma mensagem de acompanhamento para o contato comercial?`;
      } else if (lower.includes("vendas") || lower.includes("performance")) {
        aiText = `Excelente! O volume de vendas aumentou **18.6%** em relação ao mesmo período do mês passado. O total faturado acumulado é de **R$ 48.200,00**, com projeção de superar a meta em **12.5%** até o final de Maio.`;
      } else {
        aiText = `Entendi a sua dúvida! Posso realizar buscas rápidas no banco de dados sobre usuários, colaboradores cadastrados (indicados) e produtos. \n\nPor exemplo: você pode perguntar sobre o estoque de produtos ou o número de colaboradores ativos. Como deseja prosseguir?`;
      }

      const aiMsg: Message = { sender: "ai", text: aiText, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#121826]/40 border border-border/80 rounded-xl overflow-hidden shadow-sm flex-1">
      {/* Header */}
      <div className="p-3 bg-[#0F1420] border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
            Assistente IA <span className="text-[8px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full uppercase scale-90">Beta</span>
          </span>
        </div>
        <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto space-y-3 max-h-[300px] min-h-[220px]"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2 max-w-[85%] text-xs rounded-lg p-2.5 leading-relaxed transition-all",
              msg.sender === "ai"
                ? "bg-[#0F1420]/80 text-slate-200 mr-auto border border-border/35"
                : "bg-emerald-950/20 text-emerald-400 border border-emerald-500/25 ml-auto"
            )}
          >
            {msg.sender === "ai" && (
              <BrainCircuit className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            )}
            <div className="whitespace-pre-line font-medium">{msg.text}</div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 max-w-[80%] bg-[#0F1420]/80 text-slate-400 border border-border/35 text-xs rounded-lg p-2.5 mr-auto">
            <BrainCircuit className="h-4 w-4 text-indigo-400 animate-spin shrink-0" />
            <span className="animate-pulse">Analisando dados do ERP...</span>
          </div>
        )}
      </div>

      {/* Suggestion list */}
      {messages.length === 1 && !isTyping && (
        <div className="px-3 pb-2 flex flex-col gap-1.5">
          {suggestions.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSend(item.value)}
              className="text-left text-[10px] text-slate-300 bg-[#0F1420] hover:bg-[#1C253B] border border-border/60 hover:border-emerald-500/40 rounded-lg p-2 transition-all cursor-pointer truncate"
            >
              🚀 {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-2.5 bg-[#0F1420] border-t border-border/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte algo..."
            className="w-full h-8 pl-3 pr-10 rounded-lg bg-[#0B0F19] border border-border/80 text-[11px] text-slate-200 placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-500 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 h-6 w-6 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center cursor-pointer transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 shrink-0"
          >
            <Send className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
