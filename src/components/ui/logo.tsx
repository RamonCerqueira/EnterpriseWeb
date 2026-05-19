"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ width = 36, height = 36, className = "", showText = false, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-500 hover:rotate-[15deg] cursor-pointer"
        {...props}
      >
        <defs>
          {/* 2026 Metallic Silver/Slate Gradient */}
          <linearGradient id="silverGlobeGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" /> {/* slate-200 */}
            <stop offset="30%" stopColor="#F8FAFC" /> {/* slate-50 (highlight reflection) */}
            <stop offset="65%" stopColor="#94A3B8" /> {/* slate-400 */}
            <stop offset="100%" stopColor="#475569" /> {/* slate-600 */}
          </linearGradient>
          
          {/* 2026 Vibrant Emerald-to-Teal Gradient */}
          <linearGradient id="emeraldGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" /> {/* emerald-400 */}
            <stop offset="50%" stopColor="#10B981" /> {/* emerald-500 */}
            <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
          </linearGradient>

          {/* Glowing Filter for the dynamic bands */}
          <filter id="neonGlobeGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#10B981" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Silver Metallic Crescent (Right Shell of Globe) */}
        <path
          d="M 50 12 C 71 12, 88 29, 88 50 C 88 71, 71 88, 50 88 C 66 78, 74 65, 74 50 C 74 35, 66 22, 50 12 Z"
          fill="url(#silverGlobeGrad)"
        />

        {/* Dynamic sweeping bands of technology */}
        {/* Top Band */}
        <path
          d="M 22 36 C 26 22, 45 15, 64 22 C 48 24, 34 33, 30 46 C 28 50, 20 42, 22 36 Z"
          fill="url(#emeraldGlobeGrad)"
          filter="url(#neonGlobeGlow)"
        />

        {/* Middle Band */}
        <path
          d="M 18 52 C 24 35, 48 28, 70 38 C 50 40, 32 50, 26 64 C 23 68, 16 60, 18 52 Z"
          fill="url(#emeraldGlobeGrad)"
          filter="url(#neonGlobeGlow)"
        />

        {/* Bottom Band */}
        <path
          d="M 16 68 C 22 51, 48 44, 72 58 C 50 58, 30 70, 22 84 C 18 86, 14 76, 16 68 Z"
          fill="url(#emeraldGlobeGrad)"
          filter="url(#neonGlobeGlow)"
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-left select-none leading-none gap-0.5">
          <div className="text-lg font-black tracking-tight flex items-center">
            <span className="text-slate-100">Soft</span>
            <span className="text-emerald-400 ml-0.5">Line</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
            Sistemas
          </div>
          <div className="text-[7.5px] font-medium text-slate-500 tracking-wide mt-0.5 whitespace-nowrap">
            Evolução em Software para o seu Negócio
          </div>
        </div>
      )}
    </div>
  );
}
