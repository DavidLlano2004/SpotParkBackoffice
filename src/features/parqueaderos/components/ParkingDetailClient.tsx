'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Clock, Wifi, Shield, Zap, Car, Bike, Users,
  Settings, TrendingUp, AlertTriangle, ToggleLeft, ToggleRight, Edit2,
} from 'lucide-react'
import { useParking } from '@hooks/useParkings'
import { Card, CardHeader } from '@components/ui/Card'
import { ParkingStatusBadge } from '@components/ui/Badge'
import { formatCOPk, formatCOP } from '@utils/formatCurrency'
import { MOCK_WORKERS } from '@features/trabajadores/data/mock'
import type { SpaceStatus, VehicleType } from '@types-sp/parking.types'

type Tab = 'resumen' | 'espacios' | 'vigilantes' | 'tarifas' | 'reportes'

const TABS: { k: Tab; l: string }[] = [
  { k: 'resumen',    l: 'Resumen'    },
  { k: 'espacios',   l: 'Espacios'   },
  { k: 'vigilantes', l: 'Vigilantes' },
  { k: 'tarifas',    l: 'Tarifas'    },
  { k: 'reportes',   l: 'Reportes'   },
]

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  vigilancia: <Shield size={13} />,
  cctv:       <Shield size={13} />,
  techado:    <Car size={13} />,
  factura:    <TrendingUp size={13} />,
  accesible:  <Users size={13} />,
  carga:      <Zap size={13} />,
  wifi:       <Wifi size={13} />,
  lavado:     <Car size={13} />,
  valet:      <Car size={13} />,
  baño:       <Settings size={13} />,
}

const SERVICE_LABELS: Record<string, string> = {
  vigilancia: 'Vigilancia 24/7',
  cctv:       'CCTV',
  techado:    'Techado',
  factura:    'Factura electrónica',
  accesible:  'Accesible',
  carga:      'Carga eléctrica',
  wifi:       'Wi-Fi',
  lavado:     'Lavado',
  valet:      'Valet',
  baño:       'Baño',
}

function SpaceCell({ status, label }: { status: SpaceStatus; label: string }) {
  const colors: Record<SpaceStatus, string> = {
    free:        'var(--sp-green)',
    occupied:    'var(--sp-red)',
    reserved:    'var(--sp-blue)',
    disabled:    'var(--sp-border)',
    maintenance: 'var(--sp-yellow)',
  }
  return (
    <div
      className="h-10 rounded-lg flex items-center justify-center text-[11px] font-bold cursor-pointer transition-transform hover:scale-105"
      style={{ background: colors[status], color: status === 'disabled' ? 'var(--sp-t3)' : '#fff', opacity: status === 'disabled' ? 0.5 : 1 }}
    >
      {label}
    </div>
  )
}

function TabResumen({ p }: { p: ReturnType<typeof useParking>['data'] }) {
  if (!p) return null
  const occ = p.occ
  const occColor = occ > 0.9 ? 'var(--sp-red)' : occ > 0.7 ? 'var(--sp-yellow)' : 'var(--sp-green)'

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 flex flex-col gap-4">
        {/* Stats */}
        <Card padding="lg">
          <CardHeader title="Estado actual" />
          <div className="grid grid-cols-4 gap-3 mt-1">
            {[
              { l: 'Espacios totales', v: p.cap },
              { l: 'Ocupados',         v: p.used },
              { l: 'Libres',           v: p.free },
              { l: 'Ocupación',        v: `${Math.round(occ * 100)}%` },
            ].map(({ l, v }) => (
              <div key={l} className="rounded-xl p-3" style={{ background: 'var(--sp-elevated)' }}>
                <div className="t-micro text-sp-t3 text-[10px] uppercase">{l}</div>
                <div className="tnum text-[20px] font-bold mt-1" style={{ fontFamily: 'var(--sp-display)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--sp-elevated)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(occ * 100)}%`, background: occColor }} />
          </div>
        </Card>

        {/* Revenue */}
        <Card padding="lg">
          <CardHeader title="Ingresos del mes" />
          <div className="grid grid-cols-3 gap-3 mt-1">
            {[
              { l: 'Total mes', v: formatCOPk(p.rev) },
              { l: 'Reservas', v: String(p.reservas) },
              { l: 'Score',    v: String(p.score) },
            ].map(({ l, v }) => (
              <div key={l} className="rounded-xl p-3" style={{ background: 'var(--sp-elevated)' }}>
                <div className="t-micro text-sp-t3 text-[10px] uppercase">{l}</div>
                <div className="tnum text-[20px] font-bold mt-1" style={{ fontFamily: 'var(--sp-display)' }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Vehicle split */}
        <Card padding="lg">
          <CardHeader title="Distribución de vehículos" />
          <div className="flex flex-col gap-2.5 mt-2">
            {(Object.entries(p.split) as [string, number][]).map(([type, count]) => {
              const total = Object.values(p.split).reduce((s, v) => s + v, 0)
              const pct = total ? count / total : 0
              const labels: Record<string, string> = { car: 'Carros', moto: 'Motos', bike: 'Bicicletas' }
              const colors = ['var(--sp-lime-deep)', 'var(--sp-green)', 'var(--sp-blue)']
              const idx = Object.keys(p.split).indexOf(type)
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="t-small w-24 text-right text-sp-t2">{labels[type]}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--sp-elevated)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.round(pct * 100)}%`, background: colors[idx] }} />
                  </div>
                  <span className="tnum t-small w-8 text-sp-t2">{count}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        {/* Info */}
        <Card padding="lg">
          <CardHeader title="Información" />
          <div className="flex flex-col gap-3 mt-2">
            <div>
              <div className="t-micro text-sp-t3 text-[10px] uppercase">Dirección</div>
              <div className="t-small mt-0.5">{p.addr}</div>
            </div>
            <div>
              <div className="t-micro text-sp-t3 text-[10px] uppercase">Ciudad</div>
              <div className="t-small mt-0.5">{p.city}</div>
            </div>
            <div>
              <div className="t-micro text-sp-t3 text-[10px] uppercase">Horario</div>
              <div className="t-small mt-0.5 flex items-center gap-1.5"><Clock size={12} className="text-sp-t3" />{p.schedule}</div>
            </div>
            <div>
              <div className="t-micro text-sp-t3 text-[10px] uppercase">Coordenadas</div>
              <div className="t-small mt-0.5 flex items-center gap-1.5"><MapPin size={12} className="text-sp-t3" />{p.coords}</div>
            </div>
            <div>
              <div className="t-micro text-sp-t3 text-[10px] uppercase">Tarifas dinámicas</div>
              <div className="t-small mt-0.5">{p.dynamic ? 'Activadas' : 'Desactivadas'}</div>
            </div>
          </div>
        </Card>

        {/* Services */}
        <Card padding="lg">
          <CardHeader title="Servicios" />
          <div className="flex flex-wrap gap-2 mt-2">
            {p.services.map((s) => (
              <div
                key={s}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[12px]"
                style={{ background: 'var(--sp-lime-bg)', color: 'var(--sp-lime-deep)', border: '1px solid var(--sp-lime-tint)' }}
              >
                {SERVICE_ICONS[s]}
                {SERVICE_LABELS[s] ?? s}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card padding="lg">
          <CardHeader title="Acciones" />
          <div className="flex flex-col gap-2 mt-2">
            <button
              className="h-9 rounded-xl text-[13px] font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: 'var(--sp-lime)', color: 'var(--sp-ink)', boxShadow: 'var(--sp-sh-lime)' }}
            >
              <Edit2 size={14} /> Editar parqueadero
            </button>
            <button
              className="h-9 rounded-xl text-[13px] font-medium transition-all flex items-center justify-center gap-2"
              style={{ background: 'var(--sp-elevated)', color: 'var(--sp-t1)', border: '1px solid var(--sp-border)' }}
            >
              {p.status === 'active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
              {p.status === 'active' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function TabEspacios({ p }: { p: NonNullable<ReturnType<typeof useParking>['data']> }) {
  const zones = [
    { name: 'Zona A – Carros', rows: 3, cols: 6, offset: 0 },
    { name: 'Zona B – Carros', rows: 2, cols: 6, offset: 18 },
    { name: 'Zona M – Motos',  rows: 2, cols: 4, offset: 30 },
  ]
  const seed = (n: number) => {
    const statuses: SpaceStatus[] = ['free', 'occupied', 'reserved', 'disabled']
    const weights = [p.free, p.used, Math.floor(p.reservas / 10), 1]
    const total = weights.reduce((s, v) => s + v, 0)
    const r = (n * 9871 + 3357) % total
    let cum = 0
    for (let i = 0; i < statuses.length; i++) {
      cum += weights[i]
      if (r < cum) return statuses[i]
    }
    return 'free' as SpaceStatus
  }
  const legend: { s: SpaceStatus; l: string }[] = [
    { s: 'free', l: 'Libre' }, { s: 'occupied', l: 'Ocupado' },
    { s: 'reserved', l: 'Reservado' }, { s: 'disabled', l: 'Inhabilitado' },
  ]
  const legendColors: Record<SpaceStatus, string> = {
    free: 'var(--sp-green)', occupied: 'var(--sp-red)', reserved: 'var(--sp-blue)', disabled: 'var(--sp-border)', maintenance: 'var(--sp-yellow)',
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {legend.map(({ s, l }) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: legendColors[s] }} />
            <span className="t-small text-sp-t2">{l}</span>
          </div>
        ))}
        <div className="ml-auto flex gap-2">
          <span className="t-small text-sp-t2">Libres: <strong className="text-sp-t1">{p.free}</strong></span>
          <span className="t-small text-sp-t2">Ocupados: <strong className="text-sp-t1">{p.used}</strong></span>
        </div>
      </div>
      {zones.map((z) => (
        <Card key={z.name} padding="lg">
          <CardHeader title={z.name} />
          <div
            className="grid gap-2 mt-3"
            style={{ gridTemplateColumns: `repeat(${z.cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: z.rows * z.cols }, (_, i) => {
              const n = z.offset + i
              const alpha = String.fromCharCode(65 + Math.floor(i / z.cols))
              const num = (i % z.cols) + 1
              return <SpaceCell key={i} status={seed(n)} label={`${alpha}${num}`} />
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}

function TabVigilantes({ p }: { p: NonNullable<ReturnType<typeof useParking>['data']> }) {
  const workers = MOCK_WORKERS.filter((w) => w.parkings.includes(p.id))
  const statusColors: Record<string, string> = {
    shift:     'var(--sp-green)',
    active:    'var(--sp-lime-deep)',
    inactive:  'var(--sp-t3)',
    suspended: 'var(--sp-red)',
  }
  const statusLabels: Record<string, string> = {
    shift: 'En turno', active: 'Activo', inactive: 'Inactivo', suspended: 'Suspendido',
  }

  return (
    <Card padding="lg">
      <CardHeader title="Equipo asignado" right={<span className="t-micro text-sp-t3">{workers.length} personas</span>} />
      <div className="mt-2">
        {workers.map((w, i) => (
          <div
            key={w.id}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: i < workers.length - 1 ? '1px solid var(--sp-separator)' : 'none' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
              style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
            >
              {w.init}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px]">{w.name}</div>
              <div className="t-micro text-sp-t3">{w.role} · {w.last}</div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: statusColors[w.status] }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[w.status] }} />
              {statusLabels[w.status]}
            </div>
            <div className="text-right">
              <div className="tnum text-[13px] font-semibold">{w.shifts} turnos</div>
              <div className="t-micro text-sp-t3">{w.entries} entradas</div>
            </div>
          </div>
        ))}
        {workers.length === 0 && (
          <div className="py-8 text-center text-sp-t3 t-small">Sin vigilantes asignados</div>
        )}
      </div>
    </Card>
  )
}

function TabTarifas({ p }: { p: NonNullable<ReturnType<typeof useParking>['data']> }) {
  const vehicleTypes: { k: VehicleType; l: string; icon: React.ReactNode }[] = [
    { k: 'car',  l: 'Carro',      icon: <Car size={16} />  },
    { k: 'moto', l: 'Moto',       icon: <Bike size={16} /> },
    { k: 'bike', l: 'Bicicleta',  icon: <Bike size={16} /> },
    { k: 'suv',  l: 'SUV/Camión', icon: <Car size={16} />  },
  ]
  const mockTarifas: Record<VehicleType, { hour: number; day: number; min: string; grace: string; dynamic: boolean; peak?: number; valley?: number }> = {
    car:  { hour: 3500,  day: 35000,  min: '30 min', grace: '10 min', dynamic: p.dynamic, peak: 4500,  valley: 2500 },
    moto: { hour: 2000,  day: 20000,  min: '30 min', grace: '10 min', dynamic: false },
    bike: { hour: 1000,  day: 8000,   min: '15 min', grace: '5 min',  dynamic: false },
    suv:  { hour: 5000,  day: 50000,  min: '30 min', grace: '10 min', dynamic: p.dynamic, peak: 6500,  valley: 4000 },
  }
  return (
    <div className="grid grid-cols-2 gap-4">
      {vehicleTypes.map(({ k, l, icon }) => {
        const t = mockTarifas[k]
        return (
          <Card key={k} padding="lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--sp-elevated)' }}>
                {icon}
              </div>
              <span className="font-semibold text-[15px]">{l}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'Por hora',    v: formatCOP(t.hour) },
                { l: 'Por día',     v: formatCOP(t.day) },
                { l: 'Mínimo',      v: t.min },
                { l: 'Gracia',      v: t.grace },
              ].map(({ l: label, v }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: 'var(--sp-elevated)' }}>
                  <div className="t-micro text-sp-t3 text-[10px] uppercase">{label}</div>
                  <div className="tnum font-semibold text-[15px] mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            {t.dynamic && (
              <div className="mt-3 p-3 rounded-xl" style={{ background: 'var(--sp-lime-bg)', border: '1px solid var(--sp-lime-tint)' }}>
                <div className="t-micro text-[10px] uppercase mb-1.5" style={{ color: 'var(--sp-lime-deep)' }}>Tarifa dinámica</div>
                <div className="flex gap-3">
                  <div><div className="t-micro text-sp-t3">Pico</div><div className="tnum font-semibold">{formatCOP(t.peak ?? 0)}</div></div>
                  <div><div className="t-micro text-sp-t3">Valle</div><div className="tnum font-semibold">{formatCOP(t.valley ?? 0)}</div></div>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

function TabReportes({ p }: { p: NonNullable<ReturnType<typeof useParking>['data']> }) {
  const months = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May']
  const baseRev = p.rev
  const series = months.map((m, i) => ({ m, v: Math.round(baseRev * (0.6 + i * 0.08 + Math.random() * 0.05)) }))
  const maxV = Math.max(...series.map((s) => s.v))

  return (
    <div className="flex flex-col gap-4">
      <Card padding="lg">
        <CardHeader title="Ingresos mensuales" right={<span className="t-micro text-sp-t3">Últimos 6 meses</span>} />
        <div className="flex items-end gap-3 h-40 mt-4">
          {series.map(({ m, v }) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="t-micro text-sp-t3 text-[10px]">{formatCOPk(v)}</div>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{ height: `${Math.round((v / maxV) * 100)}%`, background: 'var(--sp-lime-deep)' }}
              />
              <div className="t-micro text-sp-t3">{m}</div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: 'Promedio diario', v: formatCOPk(baseRev / 30) },
          { l: 'Total reservas',  v: String(p.reservas) },
          { l: 'Incidentes',      v: String(p.incidents) },
        ].map(({ l, v }) => (
          <Card key={l} padding="lg">
            <div className="t-micro text-sp-t3 text-[10px] uppercase">{l}</div>
            <div className="tnum text-[24px] font-bold mt-1" style={{ fontFamily: 'var(--sp-display)' }}>{v}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ParkingDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('resumen')
  const { data: p, isLoading } = useParking(id)

  if (isLoading) {
    return (
      <div className="max-w-[1400px]">
        <div className="h-8 w-48 rounded-xl bg-sp-surface animate-pulse mb-5" />
        <div className="h-64 rounded-[18px] bg-sp-surface animate-pulse" />
      </div>
    )
  }

  if (!p) {
    return (
      <div className="max-w-[1400px] py-20 text-center text-sp-t3">
        Parqueadero no encontrado.
      </div>
    )
  }

  const occ = p.occ
  const occColor = occ > 0.9 ? 'var(--sp-red)' : occ > 0.7 ? 'var(--sp-yellow)' : 'var(--sp-green)'

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <button
          onClick={() => router.back()}
          className="mt-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-sp-elevated shrink-0"
          style={{ border: '1px solid var(--sp-border)' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="t-h1">{p.name}</h1>
            <ParkingStatusBadge status={p.status} />
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 t-small text-sp-t2">
              <MapPin size={13} className="text-sp-t3" />
              {p.addr} · {p.city}
            </div>
            <div className="flex items-center gap-1.5 t-small text-sp-t2">
              <Clock size={13} className="text-sp-t3" />
              {p.schedule}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: occColor }}>
          <AlertTriangle size={14} style={{ display: occ > 0.9 ? 'block' : 'none' }} />
          {Math.round(occ * 100)}% ocupación
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-xl w-fit"
        style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)' }}
      >
        {TABS.map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className="h-8 px-4 rounded-[9px] text-[13px] font-medium transition-all"
            style={{
              background: tab === k ? 'var(--sp-ink)' : 'transparent',
              color:      tab === k ? '#fff' : 'var(--sp-t2)',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        {tab === 'resumen'    && <TabResumen    p={p} />}
        {tab === 'espacios'   && <TabEspacios   p={p} />}
        {tab === 'vigilantes' && <TabVigilantes p={p} />}
        {tab === 'tarifas'    && <TabTarifas    p={p} />}
        {tab === 'reportes'   && <TabReportes   p={p} />}
      </motion.div>
    </div>
  )
}
