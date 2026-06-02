'use client'

import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts'
import {
  Download, TrendingUp, Calendar, DollarSign, Car, Layers,
  Target, Sparkles, RefreshCw,
} from 'lucide-react'
import { Card, CardHeader } from '@components/ui/Card'
import { MetricCard } from '@components/ui/MetricCard'
import { formatCOPk } from '@utils/formatCurrency'
import { MOCK_PARKINGS, MOCK_PEAK_HOURS } from '@features/parqueaderos/data/mock'

// ─── Constants ───────────────────────────────────────────────

const PARK_COLOR: Record<string, string> = {
  p1: '#5E7F12',
  p2: '#1D5FD6',
  p3: '#E8851E',
  p4: '#1F7A3D',
  p5: '#9A5B0E',
  p6: '#B4262B',
}

const DATE_RANGES = [
  { k: 'hoy',    l: 'Hoy'           },
  { k: 'semana', l: 'Esta semana'   },
  { k: 'mes',    l: 'Este mes'      },
  { k: 'ano',    l: 'Este año'      },
  { k: 'custom', l: 'Personalizado' },
]

const MONTHS = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May']

// ─── Mock data ────────────────────────────────────────────────

const DAILY_REVENUE = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  label: (i + 1) % 6 === 1 ? String(i + 1) : '',
  value: Math.max(984_000, Math.round(
    1_550_000 + Math.sin(i * 0.8) * 380_000 + Math.cos(i * 0.3) * 180_000 +
    ((i % 7 >= 5) ? 190_000 : 0),
  )),
}))

const WEEKLY_HEATMAP_DATA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, di) => ({
  day,
  hours: Array.from({ length: 24 }, (_, h) => {
    const rush = (h >= 7 && h <= 9) || (h >= 17 && h <= 19)
    const mid  = h >= 10 && h <= 16
    const base = h < 5 || h > 22 ? 2 : rush ? 40 : mid ? 22 : 12
    return Math.max(1, Math.round((base + ((h * di * 3) % 8) - 3) * (di >= 5 ? 0.7 : 1)))
  }),
}))

const PROJECTION_DATA = [
  ...Array.from({ length: 22 }, (_, i) => ({
    day: i + 1,
    label: (i + 1) % 5 === 0 ? String(i + 1) : '',
    historical: Math.max(900_000, Math.round(1_400_000 + Math.sin(i * 0.7) * 300_000)),
    projected:  null as number | null,
    confHigh:   null as number | null,
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    day: 23 + i,
    label: (23 + i) % 5 === 0 ? String(23 + i) : '',
    historical: null as number | null,
    projected:  Math.round(1_600_000 + i * 30_000 + Math.sin(i * 0.5) * 100_000),
    confHigh:   Math.round(1_750_000 + i * 40_000),
  })),
]

const totalRev      = MOCK_PARKINGS.reduce((s, p) => s + p.rev, 0)
const totalReservas = MOCK_PARKINGS.reduce((s, p) => s + p.reservas, 0)
const activePark    = MOCK_PARKINGS.filter(p => p.status === 'active')
const avgOcc        = Math.round(activePark.reduce((s, p) => s + p.occ, 0) / activePark.length * 100)
const maxPeak       = Math.max(...MOCK_PEAK_HOURS.map(h => h.value))

const TOOLTIP_STYLE = {
  background: 'var(--sp-surface)',
  border: '1px solid var(--sp-border)',
  borderRadius: 12,
  fontSize: 12,
  boxShadow: 'var(--sp-sh-pop)',
}

// ─── Shared tooltip ───────────────────────────────────────────

function RevenueTooltip({ active, payload }: any) {
  if (!active || !payload?.length || payload[0]?.value == null) return null
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-sh-pop)' }}>
      <div className="text-sp-t3 text-xs mb-0.5">Día {payload[0]?.payload?.day}</div>
      <div className="font-bold" style={{ fontFamily: 'var(--sp-display)', color: 'var(--sp-lime-deep)' }}>
        {formatCOPk(payload[0].value)}
      </div>
    </div>
  )
}

// ─── Weekly heatmap ───────────────────────────────────────────

function WeeklyHeatmap() {
  const allV  = WEEKLY_HEATMAP_DATA.flatMap(d => d.hours)
  const maxV  = Math.max(...allV)
  return (
    <div className="mt-2 overflow-x-auto">
      <div className="flex gap-0.5" style={{ minWidth: 420 }}>
        <div className="w-7" />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="flex-1 text-center" style={{ fontSize: 9, color: 'var(--sp-t4)' }}>
            {h % 6 === 0 ? h : ''}
          </div>
        ))}
      </div>
      {WEEKLY_HEATMAP_DATA.map(({ day, hours }) => (
        <div key={day} className="flex items-center gap-0.5 mt-1">
          <div className="w-7 text-right pr-1.5" style={{ fontSize: 10, color: 'var(--sp-t3)' }}>{day}</div>
          {hours.map((v, h) => {
            const opacity = 0.07 + (v / maxV) * 0.93
            return (
              <div
                key={h}
                className="flex-1 rounded-sm"
                style={{ height: 22, background: `rgba(94,127,18,${opacity})` }}
                title={`${day} ${h}:00 — ${v} vehículos`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── Comparar tab ─────────────────────────────────────────────

function CompareTab() {
  const [selected, setSelected] = useState(['p2', 'p5', 'p1'])

  const toggle = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev,
    )

  const chosen = MOCK_PARKINGS.filter(p => selected.includes(p.id))

  const metrics: [string, (p: typeof MOCK_PARKINGS[0]) => string | number][] = [
    ['Ingresos mes', p => formatCOPk(p.rev)],
    ['Ocupación',   p => `${Math.round(p.occ * 100)}%`],
    ['Reservas',    p => p.reservas],
    ['Capacidad',   p => p.cap],
    ['Score',       p => p.score],
    ['Incidentes',  p => p.incidents],
  ]

  const compData = MONTHS.map((month, i) => {
    const pt: Record<string, any> = { label: month }
    chosen.forEach(p => { pt[p.id] = p.trend[i] * 100_000 })
    return pt
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Parking pills */}
      <Card padding="md">
        <div className="t-micro upper text-sp-t3 text-[10px] mb-3">Selecciona 2–4 parqueaderos</div>
        <div className="flex flex-wrap gap-2">
          {MOCK_PARKINGS.map(p => {
            const on = selected.includes(p.id)
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-[12.5px] font-semibold transition-all shrink-0"
                style={{
                  background: on ? 'var(--sp-ink)' : 'var(--sp-surface)',
                  color:      on ? '#fff' : 'var(--sp-t2)',
                  border:     on ? 'none' : '1px solid var(--sp-border)',
                  cursor: 'pointer',
                }}
              >
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: PARK_COLOR[p.id] }} />
                {p.short}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Metrics table */}
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--sp-separator)' }}>
              <th className="t-micro upper text-sp-t3 text-[11px] text-left px-5 py-3.5">Métrica</th>
              {chosen.map(p => (
                <th key={p.id} className="text-right px-5 py-3.5">
                  <span className="inline-flex items-center justify-end gap-1.5 t-micro upper text-[11px] font-semibold" style={{ color: PARK_COLOR[p.id] }}>
                    <span className="w-2 h-2 rounded-sm" style={{ background: PARK_COLOR[p.id] }} />
                    {p.short.toUpperCase()}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(([label, fn], i) => (
              <tr key={label} style={{ borderBottom: i < metrics.length - 1 ? '1px solid var(--sp-separator)' : 'none' }}>
                <td className="px-5 py-3.5 font-semibold text-sp-t1">{label}</td>
                {chosen.map(p => (
                  <td key={p.id} className="px-5 py-3.5 tnum font-semibold text-right">{fn(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Comparison chart */}
      <Card padding="lg">
        <CardHeader title="Ingresos comparados (6 meses)" />
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={compData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              {chosen.map(p => (
                <linearGradient key={p.id} id={`cg-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PARK_COLOR[p.id]} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={PARK_COLOR[p.id]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="var(--sp-separator)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCOPk} tick={{ fontSize: 11, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatCOPk(v), '']} />
            {chosen.map(p => (
              <Area
                key={p.id}
                type="monotone"
                dataKey={p.id}
                name={p.short}
                stroke={PARK_COLOR[p.id]}
                strokeWidth={2}
                fill={`url(#cg-${p.id})`}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-3">
          {chosen.map(p => (
            <span key={p.id} className="inline-flex items-center gap-1.5 text-xs text-sp-t2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: PARK_COLOR[p.id] }} />
              {p.short}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Proyecciones tab ─────────────────────────────────────────

function ProjectionsTab() {
  const proj          = Math.round(totalRev * 1.12)
  const projReservas  = Math.round(totalReservas * 1.1)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={<TrendingUp size={17} style={{ color: 'var(--sp-lime-deep)' }} />}
          iconBg="var(--sp-lime-bg)"
          label="Proyección 30 días"
          value={proj}
          prefix="$"
          trend="12% vs periodo actual"
          trendDir="up"
        />
        <MetricCard
          icon={<Calendar size={17} style={{ color: 'var(--sp-blue-tx)' }} />}
          iconBg="var(--sp-blue-bg)"
          label="Reservas proyectadas"
          value={projReservas}
        />
        <MetricCard
          icon={<Target size={17} style={{ color: 'var(--sp-t2)' }} />}
          iconBg="var(--sp-elevated)"
          label="Confianza del modelo"
          value={87}
          suffix="%"
        />
      </div>

      <Card padding="lg">
        <CardHeader
          title="Proyección de ingresos"
          right={<span className="t-micro text-sp-t3">Histórico + 14 días proyectados</span>}
        />
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={PROJECTION_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="proj-conf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--sp-lime-deep)" stopOpacity={0.14} />
                <stop offset="95%" stopColor="var(--sp-lime-deep)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--sp-separator)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCOPk} tick={{ fontSize: 11, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number | null, name: string) => {
                if (v == null) return [null, null]
                const nm: Record<string, string> = { historical: 'Histórico', projected: 'Proyección', confHigh: 'Rango máx.' }
                return [formatCOPk(v), nm[name] ?? name]
              }}
            />
            <ReferenceLine
              x={22}
              stroke="var(--sp-red)"
              strokeDasharray="4 2"
              label={{ value: 'hoy', position: 'insideTopRight', fontSize: 10, fill: 'var(--sp-red)', dy: -4 }}
            />
            {/* Confidence band */}
            <Area type="monotone" dataKey="confHigh" stroke="none" fill="url(#proj-conf)" dot={false} activeDot={false} connectNulls />
            {/* Historical solid line */}
            <Area type="monotone" dataKey="historical" stroke="var(--sp-ink)" strokeWidth={2} fill="none" dot={false} activeDot={{ r: 4, fill: 'var(--sp-ink)' }} connectNulls />
            {/* Projection dashed line */}
            <Area type="monotone" dataKey="projected" stroke="var(--sp-lime-deep)" strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} activeDot={{ r: 4, fill: 'var(--sp-lime-deep)' }} connectNulls />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3">
          {[
            { label: 'Histórico', style: { width: 16, height: 3, background: 'var(--sp-ink)', borderRadius: 2 } },
            { label: 'Proyección', style: { width: 16, height: 3, background: 'var(--sp-lime-deep)', borderRadius: 2 } },
            { label: 'Rango de confianza', style: { width: 16, height: 10, background: 'rgba(94,127,18,.12)', borderRadius: 3 } },
          ].map(({ label, style }) => (
            <span key={label} className="inline-flex items-center gap-2 text-xs text-sp-t2">
              <span style={style as React.CSSProperties} />
              {label}
            </span>
          ))}
        </div>
      </Card>

      {/* AI Insight */}
      <div
        className="relative overflow-hidden rounded-[18px] p-5"
        style={{ background: 'var(--sp-lime-bg)', border: '1px solid var(--sp-lime-tint)', borderLeft: '3px solid var(--sp-lime)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} style={{ color: 'var(--sp-lime-deep)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--sp-lime-deep)' }}>SpotPark AI · Proyección</span>
        </div>
        <p className="text-sm leading-relaxed text-sp-t2 mb-3">
          Si reactivas La Estación los sábados, la proyección a 30 días sube ~12% adicional.
          La demanda festiva del próximo viernes podría añadir $1.4M en un solo día.
        </p>
        <button
          className="h-8 px-4 rounded-[9px] text-xs font-bold"
          style={{ background: 'var(--sp-lime-deep)', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Ver plan recomendado
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────

export function ReportesClient() {
  const [range,  setRange]  = useState('mes')
  const [view,   setView]   = useState<'general' | 'comparar' | 'proyecciones'>('general')
  const [parking, setParking] = useState('')

  const sorted = [...activePark].sort((a, b) => b.rev - a.rev)

  return (
    <div className="max-w-350">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h1 className="t-h1">Reportes</h1>
        <div className="ml-auto flex items-center gap-2.5 flex-wrap">
          {/* Parking dropdown */}
          <select
            value={parking}
            onChange={e => setParking(e.target.value)}
            className="h-8 pl-3 pr-8 rounded-[9px] text-xs font-semibold appearance-none"
            style={{
              background: 'var(--sp-surface)',
              border: '1px solid var(--sp-border)',
              color: 'var(--sp-t1)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239AA0A6' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              cursor: 'pointer',
            }}
          >
            <option value="">Todos los parqueaderos</option>
            {MOCK_PARKINGS.map(p => <option key={p.id} value={p.id}>{p.short}</option>)}
          </select>

          {/* Date range pills */}
          <div className="flex gap-1">
            {DATE_RANGES.map(({ k, l }) => (
              <button
                key={k}
                onClick={() => setRange(k)}
                className="h-8 px-3 rounded-[9px] text-xs font-semibold transition-all"
                style={{
                  background: range === k ? 'var(--sp-ink)' : 'var(--sp-surface)',
                  color:      range === k ? '#fff' : 'var(--sp-t2)',
                  border:     range === k ? 'none' : '1px solid var(--sp-border)',
                  cursor: 'pointer',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Export */}
          {(['PDF', 'Excel'] as const).map(fmt => (
            <button
              key={fmt}
              className="h-8 px-3 rounded-[9px] text-xs font-semibold flex items-center gap-1.5"
              style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)', cursor: 'pointer' }}
            >
              <Download size={13} /> {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex" style={{ borderBottom: '1px solid var(--sp-border)', marginBottom: 20 }}>
        {([['general', 'Vista general'], ['comparar', 'Comparar'], ['proyecciones', 'Proyecciones']] as const).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            style={{
              height: 40,
              padding: '0 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 13.5,
              fontWeight: 600,
              color: view === k ? 'var(--sp-t1)' : 'var(--sp-t3)',
              borderBottom: view === k ? '2px solid var(--sp-lime-deep)' : '2px solid transparent',
              marginBottom: -1,
              fontFamily: 'var(--sp-font)',
              transition: 'color 0.15s',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── Comparar ── */}
      {view === 'comparar' && <CompareTab />}

      {/* ── Proyecciones ── */}
      {view === 'proyecciones' && <ProjectionsTab />}

      {/* ── Vista general ── */}
      {view === 'general' && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <MetricCard
              icon={<DollarSign size={17} style={{ color: 'var(--sp-green-tx)' }} />}
              iconBg="var(--sp-green-bg)"
              label="Ingresos"
              value={totalRev}
              prefix="$"
              trend="12%"
              trendDir="up"
            />
            <MetricCard
              icon={<Calendar size={17} style={{ color: 'var(--sp-blue-tx)' }} />}
              iconBg="var(--sp-blue-bg)"
              label="Reservas"
              value={totalReservas}
              trend="8%"
              trendDir="up"
            />
            <MetricCard
              icon={<Layers size={17} style={{ color: 'var(--sp-lime-deep)' }} />}
              iconBg="var(--sp-lime-bg)"
              label="Ocupación media"
              value={avgOcc}
              suffix="%"
            />
            <MetricCard
              icon={<Car size={17} style={{ color: 'var(--sp-t2)' }} />}
              iconBg="var(--sp-elevated)"
              label="Vehículos únicos"
              value={1284}
            />
          </div>

          {/* Ingresos por día — full width */}
          <Card padding="lg" className="mb-4">
            <CardHeader title="Ingresos por día" right={<span className="t-micro text-sp-t3">Mayo 2025</span>} />
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={DAILY_REVENUE} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="daily-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--sp-lime-deep)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--sp-lime-deep)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--sp-separator)" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatCOPk} tick={{ fontSize: 11, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<RevenueTooltip />} cursor={{ stroke: 'var(--sp-border)', strokeWidth: 1 }} />
                <Area
                  type="monotone" dataKey="value"
                  stroke="var(--sp-lime-deep)" strokeWidth={2}
                  fill="url(#daily-grad)"
                  dot={false}
                  activeDot={{ r: 4, fill: 'var(--sp-lime-deep)', stroke: 'var(--sp-surface)', strokeWidth: 2 }}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Tipo de vehículo + Horas pico */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card padding="lg">
              <CardHeader title="Tipo de vehículo" />
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={sorted.map(p => ({ label: p.short.slice(0, 8), value: p.split.car + p.split.moto + p.split.bike }))}
                  margin={{ top: 0, right: 5, bottom: 0, left: -20 }}
                >
                  <CartesianGrid vertical={false} stroke="var(--sp-separator)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v + ' vehículos', 'Total']} />
                  <Bar dataKey="value" fill="var(--sp-lime-deep)" radius={[6, 6, 0, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card padding="lg">
              <CardHeader title="Horas pico" right={<span className="t-micro text-sp-t3">Pico 8–9 AM</span>} />
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={MOCK_PEAK_HOURS.map(d => ({ label: d.hour % 6 === 0 ? String(d.hour) : '', hour: d.hour, value: d.value }))}
                  margin={{ top: 0, right: 5, bottom: 0, left: -20 }}
                >
                  <CartesianGrid vertical={false} stroke="var(--sp-separator)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--sp-t3)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, _: any, p: any) => [v + ' vehículos', `${p.payload.hour}:00`]} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {MOCK_PEAK_HOURS.map((d) => {
                      const fill = d.value > maxPeak * 0.75
                        ? 'var(--sp-red)'
                        : d.value > maxPeak * 0.45
                        ? 'var(--sp-yellow)'
                        : 'var(--sp-blue)'
                      return <Cell key={d.hour} fill={fill} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Mapa de calor semanal + Ingresos por parqueadero */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
            <Card padding="lg">
              <CardHeader title="Mapa de calor semanal" />
              <WeeklyHeatmap />
            </Card>

            <Card padding="lg">
              <CardHeader title="Ingresos por parqueadero" />
              <div className="flex flex-col">
                {sorted.map((p, i) => {
                  const pct = p.rev / totalRev
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-2.5 py-2.5"
                      style={{ borderBottom: i < sorted.length - 1 ? '1px solid var(--sp-separator)' : 'none' }}
                    >
                      <span className="tnum text-sp-t3 font-bold text-xs w-4 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate">{p.short}</div>
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--sp-elevated)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.round(pct * 100)}%`, background: 'var(--sp-lime-deep)' }}
                          />
                        </div>
                      </div>
                      <span className="tnum text-xs font-semibold w-10 text-right text-sp-t2">
                        {Math.round(pct * 100)}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* AI Insights */}
          <div
            className="relative overflow-hidden rounded-[18px] p-5"
            style={{ background: 'var(--sp-lime-bg)', border: '1px solid var(--sp-lime-tint)', borderLeft: '3px solid var(--sp-lime)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} style={{ color: 'var(--sp-lime-deep)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--sp-lime-deep)' }}>
                SpotPark AI · Insights del periodo
              </span>
              <button
                className="ml-auto flex items-center gap-1.5 h-7 px-3 rounded-[9px] text-xs font-semibold"
                style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)', cursor: 'pointer' }}
              >
                <RefreshCw size={12} /> Actualizar análisis
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4" style={{ borderTop: '1px solid var(--sp-lime-tint)' }}>
              {[
                ['Crecimiento',    'C.C. Fundadores lidera con $14.2M (+9%). Mantiene 89% de ocupación promedio.'],
                ['Atención',       'La Estación lleva 6 días en mantenimiento. Cada día inactivo cuesta ~$320K en ingresos.'],
                ['Recomendación',  'Replica la estrategia de precios dinámicos de Cable Plaza en Terminal para subir ~12% de ingresos.'],
              ].map(([title, body]) => (
                <div key={title}>
                  <div className="t-micro upper text-[10px] font-bold mb-1.5" style={{ color: 'var(--sp-lime-deep)' }}>{title}</div>
                  <p className="text-sm leading-relaxed text-sp-t2 m-0">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
