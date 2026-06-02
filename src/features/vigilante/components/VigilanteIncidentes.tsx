'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Plus, X, MapPin, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@utils/cn'
import { GUARD_INCIDENTS } from '../data/mock'
import type { GuardIncident, IncidentPriority, IncidentStatus } from '@types-sp/vigilante.types'

const PRIORITY_CFG: Record<IncidentPriority, { bg: string; text: string; label: string }> = {
  high:   { bg: '#FBE4E5', text: '#B4262B', label: 'Alta' },
  medium: { bg: '#FBEFD6', text: '#9A5B0E', label: 'Media' },
  low:    { bg: '#E4F3E9', text: '#1F7A3D', label: 'Baja' },
}

const STATUS_CFG: Record<IncidentStatus, { bg: string; text: string; label: string }> = {
  open:      { bg: '#FBE4E5', text: '#B4262B', label: 'Abierto' },
  in_review: { bg: '#FBEFD6', text: '#9A5B0E', label: 'En revisión' },
  resolved:  { bg: '#E4F3E9', text: '#1F7A3D', label: 'Resuelto' },
}

export function VigilanteIncidentes() {
  const [incidents, setIncidents] = useState<GuardIncident[]>(GUARD_INCIDENTS)
  const [selected, setSelected] = useState<GuardIncident | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | IncidentStatus>('all')

  const [newForm, setNewForm] = useState({
    type: '', zone: '', space: '', plate: '', description: '', priority: 'medium' as IncidentPriority,
  })

  const filtered = incidents.filter(i => filterStatus === 'all' || i.status === filterStatus)

  const createIncident = () => {
    if (!newForm.type || !newForm.description) return
    const n: GuardIncident = {
      id: `gi-${Date.now()}`,
      type: newForm.type,
      zone: newForm.zone,
      space: newForm.space || undefined,
      plate: newForm.plate || undefined,
      description: newForm.description,
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      status: 'open',
      priority: newForm.priority,
    }
    setIncidents(p => [n, ...p])
    setNewForm({ type: '', zone: '', space: '', plate: '', description: '', priority: 'medium' })
    setShowNew(false)
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>Incidentes</h1>
          <p className="text-[13px] text-sp-t2 mt-1">Gestiona y reporta incidentes del turno</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 h-10 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-85"
          style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
        >
          <Plus size={16} />
          Nuevo incidente
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {(['open', 'in_review', 'resolved'] as IncidentStatus[]).map(s => {
          const cnt = incidents.filter(i => i.status === s).length
          const cfg = STATUS_CFG[s]
          return (
            <div key={s} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg, color: cfg.text }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="text-[12px] text-sp-t2">{cfg.label}</div>
                <div className="text-[22px] font-bold text-sp-t1 leading-none">{cnt}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 space-y-3">
          {/* Filter bar */}
          <div className="flex items-center gap-2">
            {([
              { k: 'all', l: 'Todos' },
              { k: 'open', l: 'Abiertos' },
              { k: 'in_review', l: 'En revisión' },
              { k: 'resolved', l: 'Resueltos' },
            ] as const).map(f => (
              <button
                key={f.k}
                onClick={() => setFilterStatus(f.k)}
                className={cn(
                  'px-3 h-8 rounded-xl text-[12px] font-medium transition-colors',
                  filterStatus === f.k ? 'bg-sp-ink text-white' : 'bg-white text-sp-t2 hover:text-sp-t1',
                )}
                style={filterStatus !== f.k ? { border: '1px solid var(--sp-border-card)' } : undefined}
              >
                {f.l}
              </button>
            ))}
          </div>

          {filtered.map((inc, i) => {
            const pri = PRIORITY_CFG[inc.priority]
            const sta = STATUS_CFG[inc.status]
            return (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(inc)}
                className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow flex items-start gap-4"
                style={{
                  boxShadow: selected?.id === inc.id ? '0 0 0 2px var(--sp-ink)' : 'var(--sp-sh-card)',
                  border: '1px solid var(--sp-border-card)',
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: pri.bg, color: pri.text }}>
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[13.5px] font-semibold text-sp-t1">{inc.type}</div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0" style={{ background: sta.bg, color: sta.text }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {sta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11.5px] text-sp-t3">
                    <span className="flex items-center gap-1"><MapPin size={11} /> Zona {inc.zone}{inc.space ? ` · ${inc.space}` : ''}</span>
                    {inc.plate && <span className="font-mono font-semibold">{inc.plate}</span>}
                    <span className="flex items-center gap-1 ml-auto"><Clock size={11} /> {inc.time}</span>
                  </div>
                  <p className="text-[12px] text-sp-t2 mt-1.5 line-clamp-2">{inc.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: pri.bg, color: pri.text }}>
                      Prioridad {pri.label}
                    </span>
                  </div>
                </div>
                <ChevronRight size={15} className="text-sp-t4 shrink-0 mt-1" />
              </motion.div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="w-[300px] shrink-0">
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="bg-white rounded-2xl overflow-hidden sticky top-0"
                style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
              >
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--sp-border-card)', background: PRIORITY_CFG[selected.priority].bg }}>
                  <span className="text-[13px] font-bold" style={{ color: PRIORITY_CFG[selected.priority].text }}>{selected.type}</span>
                  <button onClick={() => setSelected(null)} className="text-sp-t3 hover:text-sp-t1 transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl" style={{ background: '#F3F4EF' }}>
                      <div className="text-[10.5px] text-sp-t3">Estado</div>
                      <div className="text-[12.5px] font-semibold text-sp-t1 mt-0.5">{STATUS_CFG[selected.status].label}</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: '#F3F4EF' }}>
                      <div className="text-[10.5px] text-sp-t3">Hora</div>
                      <div className="text-[12.5px] font-semibold text-sp-t1 mt-0.5">{selected.time}</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: '#F3F4EF' }}>
                      <div className="text-[10.5px] text-sp-t3">Zona</div>
                      <div className="text-[12.5px] font-semibold text-sp-t1 mt-0.5">Zona {selected.zone}</div>
                    </div>
                    {selected.plate && (
                      <div className="p-3 rounded-xl" style={{ background: '#F3F4EF' }}>
                        <div className="text-[10.5px] text-sp-t3">Placa</div>
                        <div className="text-[12.5px] font-bold font-mono text-sp-t1 mt-0.5">{selected.plate}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-sp-t2 mb-2">Descripción</div>
                    <p className="text-[12.5px] text-sp-t1 leading-relaxed">{selected.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {selected.status !== 'resolved' && (
                      <button
                        onClick={() => setIncidents(prev => prev.map(i => i.id === selected.id ? { ...i, status: 'resolved' } : i))}
                        className="flex-1 h-9 rounded-xl text-[12px] font-semibold transition-colors"
                        style={{ background: '#E4F3E9', color: '#1F7A3D' }}
                      >
                        Marcar resuelto
                      </button>
                    )}
                    {selected.status === 'open' && (
                      <button
                        onClick={() => setIncidents(prev => prev.map(i => i.id === selected.id ? { ...i, status: 'in_review' } : i))}
                        className="flex-1 h-9 rounded-xl text-[12px] font-semibold transition-colors"
                        style={{ background: '#FBEFD6', color: '#9A5B0E' }}
                      >
                        En revisión
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New incident modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--sp-overlay)' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-[460px] overflow-hidden"
              style={{ boxShadow: 'var(--sp-sh-pop)' }}
            >
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
                <span className="text-[15px] font-semibold text-sp-t1">Reportar incidente</span>
                <button onClick={() => setShowNew(false)} className="text-sp-t3 hover:text-sp-t1"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Tipo de incidente', key: 'type', placeholder: 'Ej: Vehículo sospechoso' },
                  { label: 'Zona', key: 'zone', placeholder: 'A, B, M, V' },
                  { label: 'Espacio (opcional)', key: 'space', placeholder: 'Ej: A-07' },
                  { label: 'Placa (opcional)', key: 'plate', placeholder: 'ABC-123' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[11px] font-medium text-sp-t2 block mb-1">{f.label}</label>
                    <input
                      value={(newForm as Record<string, string>)[f.key]}
                      onChange={e => setNewForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full h-9 px-3 rounded-xl border border-sp-border text-[13px] text-sp-t1 bg-sp-bg focus:outline-none focus:border-sp-ink/30"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[11px] font-medium text-sp-t2 block mb-1">Prioridad</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as IncidentPriority[]).map(p => (
                      <button
                        key={p}
                        onClick={() => setNewForm(f => ({ ...f, priority: p }))}
                        className={cn('flex-1 h-8 rounded-xl text-[12px] font-medium transition-colors')}
                        style={{
                          background: newForm.priority === p ? PRIORITY_CFG[p].bg : '#F3F4EF',
                          color: newForm.priority === p ? PRIORITY_CFG[p].text : 'var(--sp-t2)',
                          border: newForm.priority === p ? `1.5px solid ${PRIORITY_CFG[p].text}30` : '1px solid transparent',
                        }}
                      >
                        {PRIORITY_CFG[p].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-sp-t2 block mb-1">Descripción</label>
                  <textarea
                    value={newForm.description}
                    onChange={e => setNewForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe el incidente en detalle..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-sp-border text-[13px] text-sp-t1 bg-sp-bg focus:outline-none focus:border-sp-ink/30 resize-none"
                  />
                </div>
                <button
                  onClick={createIncident}
                  disabled={!newForm.type || !newForm.description}
                  className="w-full h-10 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
                >
                  Reportar incidente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
