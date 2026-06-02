'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Search, X, Check, User } from 'lucide-react'
import { Card, CardHeader } from '@components/ui/Card'
import { IncidentStatusBadge } from '@components/ui/Badge'
import { MOCK_INCIDENTS } from '@features/incidentes/data/mock'
import { INCIDENT_PRIORITY_COLORS } from '@constants/colors'
import type { IncidentStatus, IncidentType } from '@types-sp/api.types'

const TYPE_LABELS: Record<IncidentType, string> = {
  damage:  'Daño en vehículo',
  billing: 'Cobro / Facturación',
  space:   'Espacio / Demarcación',
  service: 'Servicio',
}

function IncidentCard({ inc, onSelect }: { inc: typeof MOCK_INCIDENTS[0]; onSelect: () => void }) {
  const prio = INCIDENT_PRIORITY_COLORS[inc.prio]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      <button
        onClick={onSelect}
        className="w-full text-left rounded-[18px] p-4 transition-all hover:shadow-md"
        style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border-card)', boxShadow: 'var(--sp-sh-card)' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="h-5 px-2 rounded-full text-[10px] font-bold uppercase"
                style={{ background: prio.bg, color: prio.text }}
              >
                {inc.prio}
              </span>
              <span className="t-micro text-sp-t4">{inc.id}</span>
            </div>
            <div className="font-semibold text-[14px]">{inc.tl}</div>
            <div className="t-micro text-sp-t3 mt-0.5">{inc.parking} · Espacio {inc.space} · Placa {inc.plate}</div>
            <p className="t-small text-sp-t2 mt-2 leading-relaxed line-clamp-2">{inc.desc}</p>
          </div>
          <IncidentStatusBadge status={inc.status} />
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--sp-separator)' }}>
          <span className="t-micro text-sp-t3">{inc.by}</span>
          <span className="t-micro text-sp-t4">·</span>
          <span className="t-micro text-sp-t3">{inc.when}</span>
          {inc.assigned && (
            <>
              <span className="t-micro text-sp-t4">·</span>
              <span className="flex items-center gap-1 t-micro" style={{ color: 'var(--sp-lime-deep)' }}>
                <User size={10} /> {inc.assigned}
              </span>
            </>
          )}
        </div>
      </button>
    </motion.div>
  )
}

function DetailPanel({ inc, onClose }: { inc: typeof MOCK_INCIDENTS[0]; onClose: () => void }) {
  const prio = INCIDENT_PRIORITY_COLORS[inc.prio]
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="sticky top-0"
    >
      <Card padding="lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="t-micro text-sp-t3">{inc.id}</span>
            <h3 className="font-semibold text-[16px] mt-0.5">{inc.tl}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sp-t2 hover:bg-sp-elevated"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="h-5 px-2 rounded-full text-[10px] font-bold uppercase" style={{ background: prio.bg, color: prio.text }}>{inc.prio}</span>
          <IncidentStatusBadge status={inc.status} />
        </div>

        <div className="flex flex-col gap-3 text-sm">
          {[
            { l: 'Parqueadero', v: inc.parking },
            { l: 'Espacio',     v: inc.space },
            { l: 'Placa',       v: inc.plate },
            { l: 'Reportado',   v: inc.by },
            { l: 'Fecha',       v: inc.when },
            { l: 'Asignado a',  v: inc.assigned ?? 'Sin asignar' },
          ].map(({ l, v }) => (
            <div key={l}>
              <div className="t-micro text-sp-t3 text-[10px] uppercase">{l}</div>
              <div className="mt-0.5 font-medium">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--sp-elevated)' }}>
          <div className="t-micro text-sp-t3 text-[10px] uppercase mb-1.5">Descripción</div>
          <p className="t-small leading-relaxed">{inc.desc}</p>
        </div>

        {inc.status !== 'resolved' && (
          <div className="flex flex-col gap-2 mt-4">
            <button
              className="h-9 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 text-sp-ink"
              style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
            >
              <Check size={14} /> Marcar como resuelto
            </button>
            <button
              className="h-9 rounded-xl text-[13px] font-medium"
              style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
            >
              Asignar vigilante
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export function IncidentesClient() {
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState<IncidentStatus | 'todos'>('todos')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = MOCK_INCIDENTS.filter((i) => {
    const matchSearch = i.tl.toLowerCase().includes(search.toLowerCase()) ||
                        i.parking.toLowerCase().includes(search.toLowerCase()) ||
                        i.plate.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'todos' || i.status === status
    return matchSearch && matchStatus
  })

  const selectedInc = MOCK_INCIDENTS.find((i) => i.id === selected) ?? null

  const counts = {
    open:     MOCK_INCIDENTS.filter((i) => i.status === 'open').length,
    review:   MOCK_INCIDENTS.filter((i) => i.status === 'review').length,
    resolved: MOCK_INCIDENTS.filter((i) => i.status === 'resolved').length,
  }

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-5">
        <h1 className="t-h1">Incidentes</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Abiertos',   value: counts.open,     color: 'var(--sp-red)',      bg: 'var(--sp-red-bg,#fff0f0)' },
          { label: 'En revisión',value: counts.review,   color: 'var(--sp-yellow)',   bg: 'var(--sp-yellow-bg,#fffbe8)' },
          { label: 'Resueltos',  value: counts.resolved, color: 'var(--sp-green-tx)', bg: 'var(--sp-green-bg)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="rounded-xl px-4 py-3" style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border-card)', boxShadow: 'var(--sp-sh-card)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} style={{ color }} />
              <span className="t-micro text-sp-t3 text-[10px] uppercase">{label}</span>
            </div>
            <div className="tnum text-[24px] font-bold mt-1" style={{ fontFamily: 'var(--sp-display)', color }}>{value}</div>
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
            placeholder="Buscar incidente, placa..."
            className="flex-1 bg-transparent border-none outline-none text-[13px]"
          />
        </div>
        {(['todos', 'open', 'review', 'resolved'] as const).map((s) => {
          const labels = { todos: 'Todos', open: 'Abierto', review: 'En revisión', resolved: 'Resuelto' }
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
      </div>

      {/* Content */}
      <div className={`grid gap-4 ${selectedInc ? 'grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((inc) => (
              <IncidentCard
                key={inc.id}
                inc={inc}
                onSelect={() => setSelected(inc.id === selected ? null : inc.id)}
              />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-sp-t3 t-small">No se encontraron incidentes</div>
          )}
        </div>

        <AnimatePresence>
          {selectedInc && (
            <DetailPanel inc={selectedInc} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
