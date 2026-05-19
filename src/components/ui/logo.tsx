"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ width = 58, height = 58, className = "", showText = false, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3.5 select-none", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        {...props}
      >
        <style>{`
          @keyframes sBeamSpin {
            0% {
              stroke-dashoffset: 198;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
        `}</style>

        <defs>
          {/* Cyan to Cobalt - Top Isometric Ribbon */}
          <linearGradient id="isoCyanBlue" x1="20" y1="20" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" /> {/* cyan-500 */}
            <stop offset="100%" stopColor="#3B82F6" /> {/* blue-500 */}
          </linearGradient>

          {/* Emerald to Teal - Bottom Isometric Ribbon */}
          <linearGradient id="isoEmeraldTeal" x1="80" y1="80" x2="20" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" /> {/* emerald-500 */}
            <stop offset="100%" stopColor="#0D9488" /> {/* teal-600 */}
          </linearGradient>

          {/* Glowing Laser Beam Gradient (Cyan to Emerald fading to transparent tail) */}
          <linearGradient id="beamLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="1" /> {/* High intensity cyan */}
            <stop offset="30%" stopColor="#34D399" stopOpacity="0.8" /> {/* Emerald */}
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0" /> {/* Smooth transparency fade */}
          </linearGradient>

          {/* Central High-Tech Highlight Core */}
          <linearGradient id="isoCoreHighlight" x1="40" y1="35" x2="60" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>

          {/* Laser beam blur filter */}
          <filter id="laserBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Isometric Grid Guideline Ring (Blueprint blueprint underlay) */}
        <circle cx="50" cy="50" r="44" stroke="#1E293B" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />

        {/* Animated backbone trail trace underlay (guideline for the laser) */}
        <path
          d="M 78 32 L 50 16 L 22 32 L 50 48 L 50 52 L 78 68 L 50 84 L 22 68"
          stroke="#1E293B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
          opacity="0.35"
          fill="none"
        />

        {/* Animated cometary beam of light running along the S monogram itself */}
        <path
          d="M 78 32 L 50 16 L 22 32 L 50 48 L 50 52 L 78 68 L 50 84 L 22 68"
          stroke="url(#beamLightGrad)"
          strokeWidth="3.2"
          strokeDasharray="60 138"
          strokeLinecap="round"
          filter="url(#laserBeamGlow)"
          fill="none"
          style={{
            animation: "sBeamSpin 3s linear infinite"
          }}
        />

        {/* Top Loop Segment of the Isometric "S" */}
        <path
          d="M 50 16 L 78 32 L 64 40 L 50 32 L 36 40 L 22 32 Z"
          fill="url(#isoCyanBlue)"
        />
        <path
          d="M 22 32 L 50 48 L 50 60 L 22 44 Z"
          fill="url(#isoCyanBlue)"
          opacity="0.85"
        />

        {/* Bottom Loop Segment of the Isometric "S" */}
        <path
          d="M 50 84 L 22 68 L 36 60 L 50 68 L 64 60 L 78 68 Z"
          fill="url(#isoEmeraldTeal)"
        />
        <path
          d="M 78 68 L 50 52 L 50 40 L 78 56 Z"
          fill="url(#isoEmeraldTeal)"
          opacity="0.85"
        />

        {/* Central Overlay Ribbon that weaves both loops together with precision glassmorphism */}
        <path
          d="M 36 40 L 50 32 L 64 40 L 50 48 Z"
          fill="url(#isoCoreHighlight)"
          style={{ mixBlendMode: "overlay" }}
        />
        <path
          d="M 36 60 L 50 52 L 64 60 L 50 68 Z"
          fill="url(#isoCoreHighlight)"
          style={{ mixBlendMode: "overlay" }}
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-left select-none leading-none gap-1">
          <div className={cn(
            "font-extrabold tracking-tight flex items-center font-sans",
            width > 45 ? "text-[28px]" : "text-[19px]"
          )}>
            <span className="text-slate-100">Soft</span>
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-black ml-0.5">
              Line
            </span>
          </div>
          <div className={cn(
            "font-black text-slate-400 uppercase",
            width > 45 ? "text-[12px] tracking-[0.35em]" : "text-[9px] tracking-[0.32em]"
          )}>
            Sistemas
          </div>
        </div>
      )}
    </div>
  );
}
