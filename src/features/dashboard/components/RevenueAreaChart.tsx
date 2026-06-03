"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCOPk } from "@utils/formatCurrency";
import type { RevenuePoint } from "@types-sp/report.types";

interface Props {
  data: RevenuePoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-sm"
      style={{
        background: "var(--sp-surface)",
        border: "1px solid var(--sp-border)",
        boxShadow: "var(--sp-sh-pop)",
      }}
    >
      <div className="font-medium text-sp-t2 text-xs mb-0.5">{label}</div>
      <div
        className="font-bold"
        style={{
          fontFamily: "var(--sp-display)",
          color: "var(--sp-lime-deep)",
        }}
      >
        {formatCOPk(payload[0].value)}
      </div>
    </div>
  );
}

export function RevenueAreaChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={206}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
      >
        <defs>
          <linearGradient id="sp-area" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--sp-lime-deep)"
              stopOpacity={0.15}
            />
            <stop
              offset="95%"
              stopColor="var(--sp-lime-deep)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--sp-separator)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          tick={{
            fontSize: 11,
            fill: "var(--sp-t3)",
            fontFamily: "var(--sp-font)",
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCOPk}
          tick={{
            fontSize: 11,
            fill: "var(--sp-t3)",
            fontFamily: "var(--sp-font)",
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "var(--sp-border)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--sp-lime-deep)"
          strokeWidth={2}
          fill="url(#sp-area)"
          dot={false}
          activeDot={{
            r: 4,
            fill: "var(--sp-lime-deep)",
            stroke: "var(--sp-surface)",
            strokeWidth: 2,
          }}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
