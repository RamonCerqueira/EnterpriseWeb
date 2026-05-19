"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Usuário ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao tentar conectar ao servidor do ERP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* SoftLine Logo */}
        <div className="flex justify-center mb-8">
          <Logo showText width={48} height={48} className="scale-110" />
        </div>

        <Card className="border border-border/80 bg-[#121826]/75 backdrop-blur-md shadow-2xl relative">
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-xl font-bold text-center text-slate-100">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center text-xs text-muted-foreground">
              Insira suas credenciais para acessar o painel ERP.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-rose-950/35 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 animate-shake">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Usuário
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/75">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Seu nome de usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    disabled={isLoading}
                    className="pl-9 h-10 border-border bg-[#0E1320] text-sm"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Senha
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/75">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    type="password"
                    placeholder="Sua senha secreta"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={isLoading}
                    className="pl-9 h-10 border-border bg-[#0E1320] text-sm"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-sm font-semibold gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    Entrar no Sistema
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-[10px] text-muted-foreground text-center flex flex-col gap-1 select-none">
                <span>Banco de dados de Teste ativo: <strong className="text-slate-300">TESTE</strong></span>
                <span className="opacity-75">Ambiente seguro com conexões criptografadas.</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
