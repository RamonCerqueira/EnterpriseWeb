"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "01 Mai", Receitas: 20000, Despesas: 12000 },
  { name: "05 Mai", Receitas: 32000, Despesas: 18000 },
  { name: "10 Mai", Receitas: 28000, Despesas: 15000 },
  { name: "15 Mai", Receitas: 45680, Despesas: 22150 }, // Tooltip highlighted point in mockup
  { name: "20 Mai", Receitas: 38000, Despesas: 19000 },
  { name: "25 Mai", Receitas: 52000, Despesas: 24000 },
  { name: "31 Mai", Receitas: 65000, Despesas: 26000 },
];

export default function FinancialChart() {
  return (
    <div className="h-[250px] w-full mt-4 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            {/* Glowing neon green gradient for Receitas */}
            <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            {/* Muted slate gray gradient for Despesas */}
            <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B/35" vertical={false} />

          {/* X Axis */}
          <XAxis
            dataKey="name"
            stroke="#4B5563"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            dy={10}
          />

          {/* Y Axis */}
          <YAxis
            stroke="#4B5563"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />

          {/* Custom Styled Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#121826",
              borderColor: "#1E293B",
              borderRadius: "8px",
              color: "#F3F4F6",
              fontSize: "11px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            }}
            formatter={(value: any, name: any) => [
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value),
              name,
            ]}
          />

          <Legend
            verticalAlign="top"
            align="left"
            height={36}
            iconSize={8}
            iconType="circle"
            formatter={(value) => <span className="text-[10px] text-slate-300 font-semibold">{value}</span>}
          />

          {/* Glowing Area Line for Receitas */}
          <Area
            type="monotone"
            dataKey="Receitas"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorReceitas)"
            activeDot={{ r: 5, stroke: "#0B0F19", strokeWidth: 2 }}
          />

          {/* Muted Area Line for Despesas */}
          <Area
            type="monotone"
            dataKey="Despesas"
            stroke="#9CA3AF"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorDespesas)"
            activeDot={{ r: 4, stroke: "#0B0F19", strokeWidth: 1.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
