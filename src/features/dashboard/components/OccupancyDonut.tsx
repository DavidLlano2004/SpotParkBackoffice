"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { VehicleSplit } from "@types-sp/report.types";

interface Props {
  data: VehicleSplit[];
  totalOcc: number;
}

export function OccupancyDonut({ data, totalOcc }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <>
      <div className="relative flex justify-center pb-4 pt-2">
        <ResponsiveContainer width={158} height={158}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              animationDuration={800}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number, name: string) => [
                `${Math.round((v / total) * 100)}%`,
                name,
              ]}
              contentStyle={{
                background: "var(--sp-surface)",
                border: "1px solid var(--sp-border)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="tnum font-bold text-[28px] leading-none"
            style={{ fontFamily: "var(--sp-display)" }}
          >
            {Math.round(totalOcc * 100)}%
          </span>
          <span className="t-micro text-sp-t3 mt-0.5">ocupación</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: d.color }}
            />
            <span className="t-small flex-1">{d.label}</span>
            <span className="t-small tnum text-sp-t2">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
