"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CalendarCheck,
  ParkingSquare,
  Building2,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@components/ui/MetricCard";
import { Card, CardHeader } from "@components/ui/Card";
import { AIInsightCard } from "@components/ui/AIInsightCard";
import { RevenueAreaChart } from "@features/dashboard/components/RevenueAreaChart";
import { OccupancyDonut } from "@features/dashboard/components/OccupancyDonut";
import {
  MOCK_PARKINGS,
  MOCK_ACTIVITY,
  MOCK_REVENUE_SERIES,
  MOCK_VEHICLE_SPLIT,
} from "@features/parqueaderos/data/mock";
import { MOCK_INCIDENTS } from "@features/incidentes/data/mock";
import { formatCOPk } from "@utils/formatCurrency";
import { ACTIVITY_META } from "@constants/colors";
import { Sparkles } from "lucide-react";

const DATE_RANGES = [
  { k: "hoy", l: "Hoy" },
  { k: "semana", l: "Esta semana" },
  { k: "mes", l: "Este mes" },
  { k: "ano", l: "Este año" },
];

const totals = {
  rev: MOCK_PARKINGS.reduce((s, p) => s + p.rev, 0),
  reservas: MOCK_PARKINGS.reduce((s, p) => s + p.reservas, 0),
  occ:
    MOCK_PARKINGS.filter((p) => p.status === "active").reduce(
      (s, p) => s + p.occ,
      0,
    ) / MOCK_PARKINGS.filter((p) => p.status === "active").length,
  active: MOCK_PARKINGS.filter((p) => p.status === "active").length,
  openIncidents: MOCK_INCIDENTS.filter((i) => i.status !== "resolved").length,
};

const activityIcons: Record<string, React.ReactNode> = {
  entry: <span className="text-[13px]">🚗</span>,
  exit: <span className="text-[13px]">↗</span>,
  reservation: <span className="text-[13px]">📅</span>,
  incident: <span className="text-[13px]">⚠️</span>,
  worker: <span className="text-[13px]">👤</span>,
};

export function DashboardClient() {
  const [range, setRange] = useState("mes");
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="t-h1">Dashboard</h1>
          <p
            className="t-small mt-0.5 capitalize"
            style={{ color: "var(--sp-t3)" }}
          >
            {today}
          </p>
        </div>
        <div className="flex gap-1.5">
          {DATE_RANGES.map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setRange(k)}
              className="h-8 px-3 rounded-[9px] text-xs font-semibold transition-all"
              style={{
                background: range === k ? "var(--sp-ink)" : "var(--sp-surface)",
                color: range === k ? "#fff" : "var(--sp-t2)",
                boxShadow: range === k ? "none" : "var(--sp-sh-card)",
                border: range === k ? "none" : "1px solid var(--sp-border)",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1 — Metric cards */}
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <MetricCard
          icon={<DollarSign size={19} />}
          iconBg="var(--sp-green-bg)"
          label="Ingresos totales"
          value={totals.rev}
          prefix="$"
          trend="12% vs mes anterior"
          trendDir="up"
          delay={0}
        />
        <MetricCard
          icon={<CalendarCheck size={19} />}
          iconBg="var(--sp-blue-bg)"
          label="Reservas completadas"
          value={totals.reservas}
          trend="8% vs mes anterior"
          trendDir="up"
          delay={0.05}
        />
        <MetricCard
          icon={<ParkingSquare size={19} />}
          iconBg="var(--sp-lime-bg)"
          label="Ocupación promedio"
          value={Math.round(totals.occ * 100)}
          suffix="%"
          ring={totals.occ}
          trend="2% vs mes anterior"
          trendDir="down"
          delay={0.1}
        />
      </div>
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <MetricCard
          icon={<Building2 size={19} />}
          iconBg="var(--sp-elevated)"
          label="Parqueaderos activos"
          value={totals.active}
          sub={`de ${MOCK_PARKINGS.length} totales`}
          delay={0.15}
        />
        <MetricCard
          icon={<Users size={19} />}
          iconBg="var(--sp-blue-bg)"
          label="Trabajadores activos"
          value={12}
          sub="3 en turno ahora"
          subColor="var(--sp-green-tx)"
          delay={0.2}
        />
        <MetricCard
          icon={<AlertTriangle size={19} />}
          iconBg="var(--sp-yellow-bg)"
          label="Incidentes abiertos"
          value={totals.openIncidents}
          sub="Requieren atención"
          subColor="var(--sp-orange)"
          warn
          delay={0.25}
        />
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <Card className="col-span-2" padding="lg">
          <CardHeader
            title="Ingresos"
            right={<span className="t-micro text-sp-t3">Últimos 6 meses</span>}
          />
          <RevenueAreaChart data={MOCK_REVENUE_SERIES} />
          <div
            className="grid grid-cols-3 gap-2.5 mt-3 pt-3.5"
            style={{ borderTop: "1px solid var(--sp-separator)" }}
          >
            {[
              [
                "Total periodo",
                formatCOPk(
                  MOCK_REVENUE_SERIES.reduce((s, d) => s + d.value, 0),
                ),
              ],
              ["Promedio diario", formatCOPk(totals.rev / 30)],
              ["Mejor día", "$2.1M"],
            ].map(([label, val]) => (
              <div key={label}>
                <div className="t-micro upper text-sp-t3 text-[10px]">
                  {label}
                </div>
                <div
                  className="tnum text-[18px] font-bold mt-0.5"
                  style={{ fontFamily: "var(--sp-display)" }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader title="Ocupación por tipo" />
          <OccupancyDonut data={MOCK_VEHICLE_SPLIT} totalOcc={totals.occ} />
        </Card>
      </div>

      {/* Row 3 — Tables + Feed */}
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <Card className="col-span-2" padding="lg">
          <CardHeader
            title="Rendimiento por parqueadero"
            right={
              <Link
                href="/parqueaderos"
                className="text-[13px] font-semibold"
                style={{ color: "var(--sp-lime-deep)" }}
              >
                Ver todos →
              </Link>
            }
          />
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--sp-separator)" }}>
                {[
                  "Parqueadero",
                  "Ingresos",
                  "Ocupación",
                  "Reservas",
                  "Tendencia",
                ].map((h) => (
                  <th
                    key={h}
                    className="t-micro upper text-sp-t3 text-[11px] text-left px-2 py-2.5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PARKINGS.filter((p) => p.status === "active")
                .sort((a, b) => b.rev - a.rev)
                .map((p) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer hover:bg-sp-elevated/40 transition-colors"
                    style={{ borderBottom: "1px solid var(--sp-separator)" }}
                  >
                    <td className="px-2 py-3">
                      <div className="font-semibold text-[13.5px]">
                        {p.short}
                      </div>
                      <div className="t-micro text-sp-t3">{p.city}</div>
                    </td>
                    <td className="px-2 py-3 tnum font-semibold">
                      {formatCOPk(p.rev)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-sp-elevated overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.round(p.occ * 100)}%`,
                              background:
                                p.occ > 0.9
                                  ? "var(--sp-red)"
                                  : p.occ > 0.7
                                    ? "var(--sp-yellow)"
                                    : "var(--sp-green)",
                            }}
                          />
                        </div>
                        <span className="tnum text-xs text-sp-t2 w-8">
                          {Math.round(p.occ * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 tnum">{p.reservas}</td>
                    <td className="px-2 py-3">
                      <MiniSparkline
                        data={p.trend}
                        up={p.trend[p.trend.length - 1] >= p.trend[0]}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>

        <Card padding="lg">
          <CardHeader
            title="Actividad reciente"
            right={
              <span
                className="flex items-center gap-1.5 text-[11.5px] font-semibold"
                style={{ color: "var(--sp-green-tx)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full sp-pulse"
                  style={{ background: "var(--sp-green)" }}
                />
                En vivo
              </span>
            }
          />
          <div className="max-h-[280px] overflow-y-auto no-sb -mx-1">
            {MOCK_ACTIVITY.map((a, i) => {
              const meta = ACTIVITY_META[a.kind];
              return (
                <div
                  key={a.id}
                  className="flex gap-2.5 py-2.5 px-1"
                  style={{
                    borderBottom:
                      i < MOCK_ACTIVITY.length - 1
                        ? "1px solid var(--sp-separator)"
                        : "none",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0"
                    style={{ background: meta.bg }}
                  >
                    {activityIcons[a.kind]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium leading-snug">
                      {a.text}
                    </div>
                    <div className="flex gap-1.5 mt-0.5">
                      <span className="t-micro text-sp-t3">{a.parking}</span>
                      <span className="t-micro text-sp-t4">· {a.ago}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row 4 — AI Business Insights */}
      <div
        className="rounded-2xl p-[18px] relative overflow-hidden"
        style={{
          background: "var(--sp-lime-bg)",
          border: "1px solid var(--sp-lime-tint)",
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
          style={{ background: "var(--sp-lime)" }}
        />
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} style={{ color: "var(--sp-lime-deep)" }} />
          <span
            className="text-[14.5px] font-semibold"
            style={{ color: "var(--sp-lime-deep)" }}
          >
            SpotPark AI · Insights del negocio
          </span>
        </div>
        <div
          className="grid grid-cols-3 gap-6 pt-4"
          style={{ borderTop: "1px solid var(--sp-lime-tint)" }}
        >
          {[
            {
              type: "Oportunidad",
              body: "El parqueadero Terminal tiene 40% de ocupación los miércoles AM. Considera una tarifa reducida para atraer más usuarios.",
              action: "Ver análisis",
            },
            {
              type: "Alerta",
              body: "Los ingresos de Hosp. Santa Sofía cayeron 18% esta semana. El vigilante Pedro Sáenz tiene 3 anomalías sin resolver.",
              action: "Investigar",
            },
            {
              type: "Predicción",
              body: "Próximo viernes festivo: demanda proyectada +45%. Considera reactivar La Estación para ese día.",
              action: "Planear",
            },
          ].map(({ type, body, action }, i) => (
            <motion.div
              key={type}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.12 }}
            >
              <div
                className="t-micro upper text-[10px] mb-1.5"
                style={{ color: "var(--sp-lime-deep)" }}
              >
                {type}
              </div>
              <p className="t-small leading-[1.5] m-0">{body}</p>
              <button
                className="text-[12.5px] font-semibold mt-2 p-0"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--sp-lime-deep)",
                  cursor: "pointer",
                }}
              >
                {action} →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const color = up ? "var(--sp-green)" : "var(--sp-red)";
  return (
    <svg width={w} height={h}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
