'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, TrendingUp, AlertTriangle, DollarSign, Calendar } from 'lucide-react'
import { GUARD, SHIFT_HISTORY } from '../data/mock'
import type { ShiftType } from '@types-sp/vigilante.types'

const SHIFT_LABELS: Record<ShiftType, string> = {
  morning: 'Mañana', afternoon: 'Tarde', night: 'Noche',
}

const SHIFT_COLORS: Record<ShiftType, { bg: string; text: string }> = {
  morning:   { bg: '#EFF6DC', text: '#5E7F12' },
  afternoon: { bg: '#FBEFD6', text: '#9A5B0E' },
  night:     { bg: '#E5EEFD', text: '#1D5FD6' },
}

export function VigilantePerfil() {
  const totalEntries = SHIFT_HISTORY.reduce((s, h) => s + h.entries, 0)
  const totalRev     = SHIFT_HISTORY.reduce((s, h) => s + h.revenue, 0)
  const totalInc     = SHIFT_HISTORY.reduce((s, h) => s + h.incidents, 0)
  const avgEntries   = Math.round(totalEntries / SHIFT_HISTORY.length)

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>Mi perfil</h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
      >
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-[30px] font-bold shrink-0"
            style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)', fontFamily: 'var(--sp-display)' }}
          >
            {GUARD.initials}
          </div>
          <div className="flex-1">
            <div className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>{GUARD.name}</div>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mt-1"
              style={{ background: '#EFF6DC', color: '#5E7F12' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {GUARD.role}
            </span>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { icon: <Mail size={14} />,    value: GUARD.email },
                { icon: <Phone size={14} />,   value: GUARD.phone },
                { icon: <MapPin size={14} />,  value: GUARD.parking },
                { icon: <Clock size={14} />,   value: GUARD.shift },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-[12.5px] text-sp-t2">
                  <span className="text-sp-t3 shrink-0">{row.icon}</span>
                  <span className="truncate">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Entradas totales', value: totalEntries, icon: <TrendingUp size={18} />, color: '#3DA35D', bg: '#E4F3E9' },
          { label: 'Promedio / turno',  value: avgEntries,   icon: <Calendar size={18} />,   color: '#3B82F6', bg: '#E5EEFD' },
          { label: 'Incidentes',        value: totalInc,     icon: <AlertTriangle size={18} />, color: '#E0A211', bg: '#FBEFD6' },
          { label: 'Ingresos gestionados', value: `$${Math.round(totalRev / 1000)}k`, icon: <DollarSign size={18} />, color: '#C6F24E', bg: '#EFF6DC' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <div className="text-[11px] text-sp-t3">{c.label}</div>
              <div className="text-[18px] font-bold text-sp-t1">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Shift history */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
          <span className="text-[14px] font-semibold text-sp-t1">Historial de turnos recientes</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
              {['Fecha', 'Turno', 'Horario', 'Entradas', 'Salidas', 'Ingresos', 'Incidentes'].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-sp-t3 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sp-border/40">
            {SHIFT_HISTORY.map((sh, i) => {
              const sc = SHIFT_COLORS[sh.shift]
              return (
                <motion.tr
                  key={sh.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-sp-bg/50 transition-colors"
                >
                  <td className="px-5 py-3 text-[12.5px] text-sp-t1 font-medium">
                    {new Date(sh.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: sc.bg, color: sc.text }}>
                      {SHIFT_LABELS[sh.shift]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12.5px] text-sp-t2">{sh.start} – {sh.end}</td>
                  <td className="px-5 py-3 text-[12.5px] font-semibold text-sp-t1">{sh.entries}</td>
                  <td className="px-5 py-3 text-[12.5px] font-semibold text-sp-t1">{sh.exits}</td>
                  <td className="px-5 py-3 text-[12.5px] font-semibold text-sp-t1">${sh.revenue.toLocaleString('es-CO')}</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                      style={{ background: sh.incidents > 0 ? '#FBE4E5' : '#E4F3E9', color: sh.incidents > 0 ? '#B4262B' : '#1F7A3D' }}
                    >
                      {sh.incidents}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
