'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car, TrendingUp, TrendingDown, DollarSign,
  Plus, Minus, QrCode, AlertTriangle, Clock,
  CheckCircle2, MapPin, X,
} from 'lucide-react'
import { cn } from '@utils/cn'
import { GUARD, ZONES, VEHICLE_RECORDS, ALERTS } from '../data/mock'
import type { SpaceStatus } from '@types-sp/parking.types'

const totalSpaces  = ZONES.reduce((s, z) => s + z.rows * z.cols, 0)
const occupiedCount = ZONES.reduce((s, z) => s + z.cells.flat().filter(c => c === 'occupied').length, 0)
const freeCount    = totalSpaces - occupiedCount
const todayEntries = VEHICLE_RECORDS.length
const todayExits   = VEHICLE_RECORDS.filter(r => !r.active).length
const todayRev     = VEHICLE_RECORDS.reduce((s, r) => s + r.amount, 0)

const SPACE_COLORS: Record<SpaceStatus, string> = {
  free:        '#3DA35D',
  occupied:    '#E5484D',
  reserved:    '#E0A211',
  disabled:    '#6B7280',
  maintenance: '#9AA0A6',
}

const QUICK_ACTIONS = [
  { icon: <Plus size={20} />,        label: 'Registrar Entrada', color: '#3DA35D', bg: '#E4F3E9' },
  { icon: <Minus size={20} />,       label: 'Registrar Salida',  color: '#E5484D', bg: '#FBE4E5' },
  { icon: <QrCode size={20} />,      label: 'Escanear QR',       color: '#3B82F6', bg: '#E5EEFD' },
  { icon: <AlertTriangle size={20} />, label: 'Reportar Incidente', color: '#E0A211', bg: '#FBEFD6' },
]

function StatCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 flex items-start gap-4"
      style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div>
        <div className="text-[13px] text-sp-t2 font-medium">{label}</div>
        <div className="text-[26px] font-bold text-sp-t1 leading-none mt-0.5">{value}</div>
        <div className="text-[11.5px] text-sp-t3 mt-1">{sub}</div>
      </div>
    </motion.div>
  )
}

function MiniSpaceGrid() {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-semibold text-sp-t1">Estado actual del parqueadero</span>
        <div className="flex items-center gap-3 text-[11px] text-sp-t3">
          {(['free','occupied','reserved','disabled'] as SpaceStatus[]).map(s => (
            <span key={s} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm" style={{ background: SPACE_COLORS[s] }} />
              {s === 'free' ? 'Libre' : s === 'occupied' ? 'Ocupado' : s === 'reserved' ? 'Reservado' : 'Bloqueado'}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {ZONES.map(zone => (
          <div key={zone.id}>
            <div className="text-[11px] font-medium text-sp-t2 mb-2">
              {zone.label} · {zone.vehicleType === 'car' ? 'Autos' : zone.vehicleType === 'moto' ? 'Motos' : 'Bicicletas'}
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${zone.cols}, minmax(0, 1fr))` }}>
              {zone.cells.flat().map((cell, i) => (
                <div
                  key={i}
                  className="h-5 rounded-sm"
                  style={{ background: SPACE_COLORS[cell], opacity: cell === 'disabled' ? 0.35 : 1 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertsBanner() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const visible = ALERTS.filter(a => !dismissed.includes(a.id))
  if (!visible.length) return null

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
      <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: '#FBEFD6', borderBottom: '1px solid #F5DFA8' }}>
        <AlertTriangle size={15} style={{ color: '#E0A211' }} />
        <span className="text-[13px] font-semibold" style={{ color: '#7A5200' }}>
          {visible.length} alerta{visible.length > 1 ? 's' : ''} activa{visible.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="divide-y divide-sp-border/50">
        {visible.map(alert => (
          <div key={alert.id} className="flex items-start gap-3 px-5 py-3">
            <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: '#E0A211' }} />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-sp-t1">
                {alert.plate} · {alert.zone}-{alert.space.split('-')[1]}
              </div>
              <div className="text-[11.5px] text-sp-t2 mt-0.5">{alert.message}</div>
              <div className="text-[10.5px] text-sp-t3 mt-0.5">Desde {alert.since}</div>
            </div>
            <button onClick={() => setDismissed(p => [...p, alert.id])} className="text-sp-t4 hover:text-sp-t2 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentRecords() {
  const recent = VEHICLE_RECORDS.slice(0, 6)
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
        <span className="text-[14px] font-semibold text-sp-t1">Registros recientes</span>
      </div>
      <div className="divide-y divide-sp-border/40">
        {recent.map(r => (
          <div key={r.id} className="flex items-center gap-3 px-5 py-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: r.active ? '#E4F3E9' : '#F3F4EF', color: r.active ? '#3DA35D' : '#6B7280' }}
            >
              <Car size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-sp-t1">{r.plate}</div>
              <div className="text-[11px] text-sp-t3">{r.zone}-{r.space.split('-')[1]} · {r.inTime}</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-semibold text-sp-t1">${r.amount.toLocaleString('es-CO')}</div>
              <div className={cn('text-[10.5px] font-medium', r.active ? 'text-sp-green' : 'text-sp-t3')}>
                {r.active ? 'Activo' : `Salió ${r.outTime}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VigilanteDashboard() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  const occ = Math.round((occupiedCount / totalSpaces) * 100)

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>
            Buenos días, {GUARD.name.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sp-t2 text-[13px]">
            <Clock size={14} />
            <span>Turno {GUARD.shift} · {GUARD.parking}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[28px] font-bold text-sp-t1 leading-none">{timeStr}</div>
          <div className="text-[12px] text-sp-t3 mt-1">
            {now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Entradas hoy"  value={todayEntries} sub="desde inicio de turno" icon={<TrendingUp size={20} />}  color="#3DA35D" />
        <StatCard label="Salidas hoy"   value={todayExits}   sub="vehículos completados" icon={<TrendingDown size={20} />} color="#3B82F6" />
        <StatCard label="Ocupación"     value={`${occ}%`}    sub={`${occupiedCount} / ${totalSpaces} espacios`} icon={<Car size={20} />} color="#E0A211" />
        <StatCard label="Ingresos turno" value={`$${Math.round(todayRev / 1000)}k`} sub="COP este turno" icon={<DollarSign size={20} />} color="#C6F24E" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(a => (
          <button
            key={a.label}
            className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow text-center"
            style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: a.bg, color: a.color }}>
              {a.icon}
            </div>
            <span className="text-[12px] font-medium text-sp-t1">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Alerts */}
      <AlertsBanner />

      {/* Bottom grid */}
      <div className="grid grid-cols-2 gap-6">
        <MiniSpaceGrid />
        <RecentRecords />
      </div>
    </div>
  )
}
