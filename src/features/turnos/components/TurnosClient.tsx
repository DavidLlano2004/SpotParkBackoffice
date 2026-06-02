'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Plus, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@utils/cn'
import { MOCK_WORKERS as WORKERS } from '@features/trabajadores/data/mock'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const COLORS = [
  { bg: '#E4F3E9', text: '#1F7A3D', border: '#B7E4C7' },
  { bg: '#E5EEFD', text: '#1D5FD6', border: '#BFCFEF' },
  { bg: '#FBEFD6', text: '#9A5B0E', border: '#EDD9A3' },
  { bg: '#FBE4E5', text: '#B4262B', border: '#EDB7B9' },
  { bg: '#EFF6DC', text: '#5E7F12', border: '#C9E29A' },
]

const SHIFTS = ['6:00 – 14:00', '14:00 – 22:00', '22:00 – 6:00']

const SAMPLE_SCHEDULE: Record<number, Record<number, { worker: string; shift: number; colorIdx: number }[]>> = {
  0: { 0: [{ worker: 'Carlos Torres', shift: 0, colorIdx: 0 }], 1: [{ worker: 'Juan Pérez', shift: 1, colorIdx: 1 }] },
  1: { 0: [{ worker: 'María García', shift: 0, colorIdx: 2 }], 2: [{ worker: 'Carlos Torres', shift: 2, colorIdx: 0 }] },
  2: { 1: [{ worker: 'Pedro López', shift: 1, colorIdx: 3 }] },
  3: { 0: [{ worker: 'Juan Pérez', shift: 0, colorIdx: 1 }], 1: [{ worker: 'María García', shift: 1, colorIdx: 2 }] },
  4: { 0: [{ worker: 'Carlos Torres', shift: 0, colorIdx: 0 }], 2: [{ worker: 'Pedro López', shift: 2, colorIdx: 3 }] },
  5: { 1: [{ worker: 'Juan Pérez', shift: 1, colorIdx: 1 }] },
  6: {},
}

const today = new Date()
const startOfWeek = new Date(today)
startOfWeek.setDate(today.getDate() - today.getDay() + 1)

function weekDates(offset = 0) {
  return DAYS.map((_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i + offset * 7)
    return d
  })
}

export function TurnosClient() {
  const [weekOffset, setWeekOffset] = useState(0)
  const dates = weekDates(weekOffset)

  const totalAssigned = Object.values(SAMPLE_SCHEDULE).flatMap(d => Object.values(d)).flat().length
  const activeShifts  = Object.values(SAMPLE_SCHEDULE)[0]
  const todaySlots    = Object.values(SAMPLE_SCHEDULE[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] ?? {})

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>Gestión de Turnos</h1>
          <p className="text-[13px] text-sp-t2 mt-1">Planifica y organiza los turnos del equipo</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 h-10 rounded-xl text-[13px] font-semibold hover:opacity-85 transition-opacity"
          style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
        >
          <Plus size={16} />
          Asignar turno
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Asignaciones semana', value: totalAssigned, icon: <Calendar size={18} />, color: '#3B82F6', bg: '#E5EEFD' },
          { label: 'Vigilantes activos', value: WORKERS.filter(w => w.status === 'active').length, icon: <Users size={18} />, color: '#3DA35D', bg: '#E4F3E9' },
          { label: 'Turno mañana (6–14h)', value: 3, icon: <Clock size={18} />, color: '#E0A211', bg: '#FBEFD6' },
          { label: 'Sin turno hoy', value: WORKERS.length - todaySlots.length, icon: <Users size={18} />, color: '#E5484D', bg: '#FBE4E5' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <div className="text-[11px] text-sp-t3">{c.label}</div>
              <div className="text-[20px] font-bold text-sp-t1">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
        {/* Calendar header */}
        <div className="px-5 py-4 flex items-center gap-4" style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
          <button onClick={() => setWeekOffset(o => o - 1)} className="w-8 h-8 rounded-xl flex items-center justify-center text-sp-t2 hover:bg-sp-bg transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13px] font-semibold text-sp-t1 flex-1 text-center">
            {dates[0].toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })} – {dates[6].toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setWeekOffset(o => o + 1)} className="w-8 h-8 rounded-xl flex items-center justify-center text-sp-t2 hover:bg-sp-bg transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[120px_repeat(7,1fr)] border-b border-sp-border-card">
          <div className="py-2.5 px-4 text-[11px] font-semibold text-sp-t3 uppercase tracking-wide">Turno</div>
          {dates.map((d, i) => {
            const isToday = d.toDateString() === new Date().toDateString()
            return (
              <div key={i} className={cn('py-2.5 px-2 text-center', isToday ? 'bg-sp-lime/10' : '')}>
                <div className="text-[10px] font-semibold text-sp-t3 uppercase">{DAYS[i]}</div>
                <div className={cn('text-[16px] font-bold mt-0.5', isToday ? 'text-sp-lime-deep' : 'text-sp-t1')}>{d.getDate()}</div>
              </div>
            )
          })}
        </div>

        {/* Shift rows */}
        {SHIFTS.map((shift, si) => (
          <div
            key={si}
            className="grid grid-cols-[120px_repeat(7,1fr)]"
            style={{ borderBottom: si < SHIFTS.length - 1 ? '1px solid var(--sp-border-card)' : undefined, minHeight: 80 }}
          >
            <div className="py-3 px-4 flex items-start">
              <div>
                <div className="text-[11px] font-semibold text-sp-t1">{['Mañana', 'Tarde', 'Noche'][si]}</div>
                <div className="text-[10px] text-sp-t3 mt-0.5">{shift}</div>
              </div>
            </div>
            {DAYS.map((_, di) => {
              const daySchedule = SAMPLE_SCHEDULE[di] ?? {}
              const assignments = daySchedule[si] ?? []
              const isToday = dates[di].toDateString() === new Date().toDateString()
              return (
                <div key={di} className={cn('py-2 px-2 space-y-1', isToday ? 'bg-sp-lime/5' : '')}>
                  {assignments.map((a, ai) => {
                    const c = COLORS[a.colorIdx]
                    return (
                      <motion.div
                        key={ai}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: di * 0.02 + ai * 0.05 }}
                        className="px-2 py-1 rounded-lg text-[10.5px] font-medium truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                        title={a.worker}
                      >
                        {a.worker.split(' ')[0]}
                      </motion.div>
                    )
                  })}
                  <button
                    className="w-full h-6 rounded-lg text-[10px] text-sp-t4 hover:text-sp-t2 hover:bg-sp-bg/80 transition-colors flex items-center justify-center gap-0.5"
                  >
                    <Plus size={10} /> Asignar
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Workers availability */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
          <span className="text-[14px] font-semibold text-sp-t1">Disponibilidad del equipo esta semana</span>
        </div>
        <div className="divide-y divide-sp-border/40">
          {WORKERS.slice(0, 6).map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 px-5 py-3"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: 'var(--sp-lime)', color: 'var(--sp-ink)' }}>
                {w.init}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-sp-t1">{w.name}</div>
                <div className="text-[11px] text-sp-t3">{w.role}</div>
              </div>
              <div className="flex gap-1">
                {DAYS.map((d, di) => {
                  const hasShift = Object.values(SAMPLE_SCHEDULE[di] ?? {}).flat().some(a => a.worker.split(' ')[0] === w.name.split(' ')[0])
                  return (
                    <div
                      key={d}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold"
                      style={{
                        background: hasShift ? 'var(--sp-ink)' : '#F3F4EF',
                        color: hasShift ? 'var(--sp-lime)' : 'var(--sp-t3)',
                      }}
                    >
                      {d[0]}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
