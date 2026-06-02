'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, Bike, Filter, DollarSign, TrendingUp, Clock, Search } from 'lucide-react'
import { cn } from '@utils/cn'
import { VEHICLE_RECORDS } from '../data/mock'
import type { PayMethod, VehicleRecord } from '@types-sp/vigilante.types'

const PAY_LABELS: Record<PayMethod, string> = {
  cash: 'Efectivo', card: 'Tarjeta', qr: 'QR', app: 'App',
}

const PAY_COLORS: Record<PayMethod, { bg: string; text: string }> = {
  cash: { bg: '#E4F3E9', text: '#1F7A3D' },
  card: { bg: '#E5EEFD', text: '#1D5FD6' },
  qr:   { bg: '#EFF6DC', text: '#5E7F12' },
  app:  { bg: '#FBEFD6', text: '#9A5B0E' },
}

const VEH_ICON = (t: string) =>
  t === 'bike' ? <Bike size={15} /> : <Car size={15} />

function RecordRow({ r, i }: { r: VehicleRecord; i: number }) {
  const pay = PAY_COLORS[r.payMethod]
  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className="hover:bg-sp-bg/60 transition-colors"
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: r.active ? '#E4F3E9' : '#F3F4EF', color: r.active ? '#3DA35D' : '#6B7280' }}
          >
            {VEH_ICON(r.vehicleType)}
          </div>
          <div>
            <div className="text-[13px] font-bold text-sp-t1 font-mono">{r.plate}</div>
            <div className="text-[10.5px] text-sp-t3">{r.vehicleType}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[12.5px] text-sp-t1 font-medium">{r.zone} · {r.space}</td>
      <td className="px-4 py-3 text-[12.5px] text-sp-t2">{r.inTime}</td>
      <td className="px-4 py-3 text-[12.5px] text-sp-t2">{r.outTime ?? '—'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-[12px] text-sp-t2">
          <Clock size={11} />
          {r.durMin} min
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
          style={{ background: pay.bg, color: pay.text }}
        >
          {PAY_LABELS[r.payMethod]}
        </span>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="text-[13px] font-bold text-sp-t1">${r.amount.toLocaleString('es-CO')}</div>
      </td>
      <td className="px-5 py-3">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold',
          )}
          style={{
            background: r.active ? '#E4F3E9' : '#F3F4EF',
            color: r.active ? '#1F7A3D' : '#6B7280',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {r.active ? 'Activo' : 'Completado'}
        </span>
      </td>
    </motion.tr>
  )
}

export function VigilanteRegistros() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [search, setSearch] = useState('')

  const filtered = VEHICLE_RECORDS.filter(r => {
    if (filter === 'active' && !r.active) return false
    if (filter === 'completed' && r.active) return false
    if (search && !r.plate.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalRev = VEHICLE_RECORDS.reduce((s, r) => s + r.amount, 0)
  const activeCount = VEHICLE_RECORDS.filter(r => r.active).length

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>Registros de vehículos</h1>
        <p className="text-[13px] text-sp-t2 mt-1">Historial de entradas y salidas del turno actual</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Entradas totales', value: VEHICLE_RECORDS.length, icon: <TrendingUp size={18} />, color: '#3DA35D', bg: '#E4F3E9' },
          { label: 'Vehículos activos', value: activeCount, icon: <Car size={18} />, color: '#E0A211', bg: '#FBEFD6' },
          { label: 'Ingresos turno', value: `$${Math.round(totalRev / 1000)}k`, icon: <DollarSign size={18} />, color: '#3B82F6', bg: '#E5EEFD' },
        ].map(c => (
          <div
            key={c.label}
            className="bg-white rounded-2xl p-4 flex items-center gap-4"
            style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <div className="text-[12px] text-sp-t2">{c.label}</div>
              <div className="text-[22px] font-bold text-sp-t1 leading-none mt-0.5">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
        {/* Toolbar */}
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
          <div className="relative flex-1 max-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-t3" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por placa..."
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-sp-border text-[12.5px] text-sp-t1 bg-sp-bg focus:outline-none focus:border-sp-ink/25"
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {([
              { k: 'all', l: 'Todos' },
              { k: 'active', l: 'Activos' },
              { k: 'completed', l: 'Completados' },
            ] as const).map(f => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={cn(
                  'px-3 h-8 rounded-xl text-[12px] font-medium transition-colors',
                  filter === f.k
                    ? 'bg-sp-ink text-white'
                    : 'bg-sp-bg text-sp-t2 hover:text-sp-t1',
                )}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
                {['Vehículo', 'Zona / Espacio', 'Entrada', 'Salida', 'Duración', 'Pago', 'Total', 'Estado'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-sp-t3 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sp-border/40">
              {filtered.length ? (
                filtered.map((r, i) => <RecordRow key={r.id} r={r} i={i} />)
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sp-t3 text-[13px]">
                    No hay registros que coincidan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
