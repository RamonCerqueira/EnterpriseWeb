"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

// Three.js Interactive Wave Background Component
function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    let renderer: any = null;
    let animationFrameId: number;

    const initThree = () => {
      const THREE = (window as any).THREE;
      if (!THREE || !containerRef.current) return;

      // 1. Scene & Perspective Camera
      const scene = new THREE.Scene();
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
      camera.position.z = 210;
      camera.position.y = 85;
      camera.lookAt(0, 0, 0);

      // 2. WebGL Renderer with High-Performance Settings
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      // 3. Grid of Particles (Wave Landscape)
      const numParticlesX = 85;
      const numParticlesY = 85;
      const separation = 8.5;
      const count = numParticlesX * numParticlesY;
      const positions = new Float32Array(count * 3);

      let index = 0;
      for (let ix = 0; ix < numParticlesX; ix++) {
        for (let iy = 0; iy < numParticlesY; iy++) {
          positions[index] = ix * separation - (numParticlesX * separation) / 2; // x
          positions[index + 1] = 0; // y (wave dynamic height)
          positions[index + 2] = iy * separation - (numParticlesY * separation) / 2; // z
          index += 3;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // 4. Create custom glowing round particle texture dynamically
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.2, "rgba(34, 211, 238, 0.85)"); // cyan-400
        grad.addColorStop(0.6, "rgba(16, 185, 129, 0.25)"); // emerald-500
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      const texture = new THREE.CanvasTexture(canvas);

      // 5. Material
      const material = new THREE.PointsMaterial({
        size: 3.8,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // 6. Interactive Mouse Movement Tracking (Cinematic Camera Sway)
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.12;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.12;
      };

      window.addEventListener("mousemove", handleMouseMove);

      // 7. Math Ripple Wave Loop
      let timer = 0;
      const animate = () => {
        if (!isMounted) return;

        animationFrameId = requestAnimationFrame(animate);

        timer += 0.035;

        // Smoothly interpolate camera position according to mouse position
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX + Math.sin(timer * 0.08) * 35;
        camera.position.y = 85 - targetY + Math.cos(timer * 0.12) * 20;
        camera.lookAt(0, 0, 0);

        // Ripple particle coordinates mathematically using sine/cosine combinations
        const positionsArray = geometry.attributes.position.array as Float32Array;
        let posIndex = 0;
        for (let ix = 0; ix < numParticlesX; ix++) {
          for (let iy = 0; iy < numParticlesY; iy++) {
            positionsArray[posIndex + 1] =
              Math.sin(ix * 0.18 + timer) * 14 +
              Math.cos(iy * 0.18 + timer) * 14;
            posIndex += 3;
          }
        }
        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();

      // 8. Dynamic Resize Handler
      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
      };
    };

    // Load Three.js dynamically via high-speed CDN if not already loaded globally
    if (!(window as any).THREE) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.async = true;
      script.onload = () => {
        if (isMounted) initThree();
      };
      document.head.appendChild(script);
    } else {
      initThree();
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement && containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // Silent cleanup catch
        }
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full opacity-55 pointer-events-none" />;
}

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
    <div className="min-h-screen bg-[#070B14] text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic 3D Wave Constellation Background */}
      <ThreeBackground />

      {/* Radial soft colored background glow underlay */}
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[450px] h-[450px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* SoftLine Logo */}
        <div className="flex justify-center mb-8">
          <Logo showText width={72} height={72} />
        </div>

        <Card className="border border-border/60 bg-[#0E1322]/80 backdrop-blur-lg shadow-2xl relative">
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-xl font-extrabold text-center text-slate-100">
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
                <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">
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
                    className="pl-9 h-10 border-border bg-[#05080E]/90 text-sm font-semibold focus:border-cyan-500/70"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">
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
                    className="pl-9 h-10 border-border bg-[#05080E]/90 text-sm font-semibold focus:border-cyan-500/70"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-sm font-extrabold gap-2 transition-all cursor-pointer bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.15)]"
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
