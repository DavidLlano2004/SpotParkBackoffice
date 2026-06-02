'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, LayoutGrid, List, MapPin, Users, Star } from 'lucide-react'
import { useParkings } from '@hooks/useParkings'
import { Card } from '@components/ui/Card'
import { Badge, ParkingStatusBadge } from '@components/ui/Badge'
import { formatCOPk } from '@utils/formatCurrency'
import type { Parking } from '@types-sp/parking.types'

type ViewMode = 'cards' | 'list'

function OccBar({ pct }: { pct: number }) {
  const color = pct > 0.9 ? 'var(--sp-red)' : pct > 0.7 ? 'var(--sp-yellow)' : 'var(--sp-green)'
  return (
    <div className="h-1.5 rounded-full bg-sp-elevated overflow-hidden mt-3">
      <div className="h-full rounded-full" style={{ width: `${Math.round(pct * 100)}%`, background: color, animation: 'sp-bar .6s ease both' }} />
    </div>
  )
}

function ScoreGauge({ score }: { score: number }) {
  const color = score > 80 ? 'var(--sp-green)' : score > 60 ? 'var(--sp-yellow)' : 'var(--sp-red)'
  const r = 18; const sw = 4; const circ = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--sp-elevated)" strokeWidth={sw} />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} />
      </svg>
      <span className="tnum text-[11px] font-bold -mt-8 leading-none">{score}</span>
      <span className="t-micro text-sp-t3 mt-6 text-[9px]">Score</span>
    </div>
  )
}

function ParkingCard({ p, delay }: { p: Parking; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card padding="none" className="overflow-hidden flex flex-col">
        {/* Cover */}
        <div className="h-36 relative flex items-center justify-center" style={{ background: 'var(--sp-elevated)' }}>
          <MapPin size={32} className="text-sp-t3" />
          <div className="absolute top-3 left-3">
            <ParkingStatusBadge status={p.status} />
          </div>
          <div className="absolute top-3 right-3">
            <ScoreGauge score={p.score} />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-[15px] font-semibold leading-snug">{p.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={11} className="text-sp-t3" />
            <span className="t-small text-sp-t2 text-[12px]">{p.addr}</span>
          </div>
          <div className="t-micro text-sp-t3 mt-0.5 text-[11px]">{p.schedule}</div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: 'Espacios', value: p.cap },
              { label: 'Ocupación', value: `${Math.round(p.occ * 100)}%` },
              { label: 'Ingresos mes', value: formatCOPk(p.rev) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-2 text-center" style={{ background: 'var(--sp-elevated)' }}>
                <div className="t-micro uppercase text-sp-t3 text-[9px]">{label}</div>
                <div className="tnum text-[13px] font-semibold mt-0.5">{value}</div>
              </div>
            ))}
          </div>
          <OccBar pct={p.occ} />

          {/* Workers */}
          <div className="flex items-center gap-2 mt-3">
            <span className="t-micro text-sp-t3">Vigilantes:</span>
            <div className="flex -space-x-2">
              {p.workers.slice(0, 3).map((w, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold"
                  style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
                >
                  {w.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              ))}
            </div>
            {p.workers.length > 3 && (
              <span className="t-micro text-sp-t3">+{p.workers.length - 3} más</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-0 flex gap-2">
          <Link
            href={`/parqueaderos/${p.id}`}
            className="flex-1 h-9 rounded-xl flex items-center justify-center text-[13px] font-semibold transition-all hover:bg-sp-elevated"
            style={{ border: '1px solid var(--sp-border)', color: 'var(--sp-t1)', background: 'var(--sp-surface)' }}
          >
            Ver detalles
          </Link>
          <Link
            href={`/parqueaderos/${p.id}`}
            className="flex-1 h-9 rounded-xl flex items-center justify-center text-[13px] font-semibold text-sp-ink"
            style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
          >
            Gestionar
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}

export function ParqueaderosClient() {
  const [view, setView]     = useState<ViewMode>('cards')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('todos')

  const { data: parkings = [], isLoading } = useParkings()

  const filtered = parkings.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.addr.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'todos' || p.status === status
    return matchSearch && matchStatus
  })

  const totals = {
    total: parkings.length,
    active: parkings.filter((p) => p.status === 'active').length,
    inactive: parkings.filter((p) => p.status === 'inactive').length,
    cap: parkings.reduce((s, p) => s + p.cap, 0),
  }

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="t-h1">Parqueaderos</h1>
        <Link
          href="/parqueaderos/nuevo"
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13.5px] font-semibold text-sp-ink"
          style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
        >
          <Plus size={17} /> Crear parqueadero
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: totals.total },
          { label: 'Activos', value: totals.active },
          { label: 'Inactivos', value: totals.inactive },
          { label: 'Capacidad total', value: `${totals.cap} espacios` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl px-4 py-2.5" style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border-card)', boxShadow: 'var(--sp-sh-card)' }}>
            <div className="t-micro upper text-sp-t3 text-[10px]">{label}</div>
            <div className="tnum text-[19px] font-bold mt-0.5" style={{ fontFamily: 'var(--sp-display)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center gap-2 h-9 px-3 rounded-xl flex-1 max-w-xs"
          style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-sh-card)' }}
        >
          <Search size={15} className="text-sp-t3 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar parqueadero..."
            className="flex-1 bg-transparent border-none outline-none text-[13px]"
          />
        </div>
        {(['todos', 'active', 'inactive', 'maintenance'] as const).map((s) => {
          const labels = { todos: 'Todos', active: 'Activo', inactive: 'Inactivo', maintenance: 'Mantenimiento' }
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="h-9 px-3 rounded-xl text-[13px] font-medium transition-all"
              style={{
                background: status === s ? 'var(--sp-ink)' : 'var(--sp-surface)',
                color:      status === s ? '#fff' : 'var(--sp-t2)',
                border:     `1px solid ${status === s ? 'var(--sp-ink)' : 'var(--sp-border)'}`,
              }}
            >
              {labels[s]}
            </button>
          )
        })}
        <div className="ml-auto flex gap-1">
          {(['cards', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: view === v ? 'var(--sp-ink)' : 'var(--sp-surface)',
                color:      view === v ? '#fff' : 'var(--sp-t2)',
                border:     `1px solid ${view === v ? 'var(--sp-ink)' : 'var(--sp-border)'}`,
              }}
            >
              {v === 'cards' ? <LayoutGrid size={16} /> : <List size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-[18px] bg-sp-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <ParkingCard key={p.id} p={p} delay={i * 0.06} />
          ))}
        </div>
      )}
    </div>
  )
}
