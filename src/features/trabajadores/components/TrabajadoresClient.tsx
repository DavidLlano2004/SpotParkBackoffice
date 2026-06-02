'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, Users, Shield, UserCheck, AlertTriangle } from 'lucide-react'
import { useWorkers } from '@hooks/useWorkers'
import { Card } from '@components/ui/Card'
import { WorkerStatusBadge } from '@components/ui/Badge'
import { MOCK_PARKINGS } from '@features/parqueaderos/data/mock'
import type { WorkerRole, WorkerStatus } from '@types-sp/worker.types'

const STATUS_FILTER = ['todos', 'shift', 'active', 'inactive', 'suspended'] as const
const STATUS_LABELS: Record<string, string> = {
  todos: 'Todos', shift: 'En turno', active: 'Activo', inactive: 'Inactivo', suspended: 'Suspendido',
}

const ROLE_COLORS: Record<WorkerRole, string> = {
  'Vigilante':    'var(--sp-blue)',
  'Supervisor':   'var(--sp-lime-deep)',
  'Administrador':'var(--sp-t1)',
}

function workerParkingNames(parkingIds: string[]): string {
  return parkingIds
    .map((id) => MOCK_PARKINGS.find((p) => p.id === id)?.short ?? id)
    .join(', ')
}

export function TrabajadoresClient() {
  const { data: workers = [], isLoading } = useWorkers()
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('todos')

  const filtered = workers.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                        w.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'todos' || w.status === status
    return matchSearch && matchStatus
  })

  const totals = {
    total:     workers.length,
    shift:     workers.filter((w) => w.status === 'shift').length,
    suspended: workers.filter((w) => w.status === 'suspended').length,
    supervisors: workers.filter((w) => w.role === 'Supervisor').length,
  }

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="t-h1">Trabajadores</h1>
        <Link
          href="/trabajadores/nuevo"
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13.5px] font-semibold text-sp-ink"
          style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
        >
          <Plus size={17} /> Agregar trabajador
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total',       value: totals.total,       icon: <Users size={16} /> },
          { label: 'En turno',    value: totals.shift,       icon: <UserCheck size={16} /> },
          { label: 'Supervisores',value: totals.supervisors, icon: <Shield size={16} /> },
          { label: 'Suspendidos', value: totals.suspended,   icon: <AlertTriangle size={16} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border-card)', boxShadow: 'var(--sp-sh-card)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sp-t2" style={{ background: 'var(--sp-elevated)' }}>{icon}</div>
            <div>
              <div className="t-micro upper text-sp-t3 text-[10px]">{label}</div>
              <div className="tnum text-[19px] font-bold mt-0" style={{ fontFamily: 'var(--sp-display)' }}>{value}</div>
            </div>
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
            placeholder="Buscar trabajador..."
            className="flex-1 bg-transparent border-none outline-none text-[13px]"
          />
        </div>
        {STATUS_FILTER.map((s) => (
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
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-[18px] bg-sp-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <Card padding="none">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--sp-separator)' }}>
                {['Trabajador', 'Rol', 'Parqueadero(s)', 'Estado', 'Último turno', 'Turnos', 'Incidentes', ''].map((h) => (
                  <th key={h} className="t-micro upper text-sp-t3 text-[11px] text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((w, i) => (
                <motion.tr
                  key={w.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-sp-elevated/40 transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--sp-separator)' : 'none' }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                        style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
                      >
                        {w.init}
                      </div>
                      <div>
                        <div className="font-semibold text-[13.5px]">{w.name}</div>
                        <div className="t-micro text-sp-t3">{w.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-semibold" style={{ color: ROLE_COLORS[w.role] }}>{w.role}</span>
                  </td>
                  <td className="px-4 py-3 t-small text-sp-t2">{workerParkingNames(w.parkings)}</td>
                  <td className="px-4 py-3"><WorkerStatusBadge status={w.status} /></td>
                  <td className="px-4 py-3 t-small text-sp-t2">{w.last}</td>
                  <td className="px-4 py-3 tnum">{w.shifts}</td>
                  <td className="px-4 py-3">
                    {w.incidents > 0 ? (
                      <span className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: w.incidents >= 3 ? 'var(--sp-red)' : 'var(--sp-yellow)' }}>
                        <AlertTriangle size={12} /> {w.incidents}
                      </span>
                    ) : (
                      <span className="t-micro text-sp-t3">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/trabajadores/${w.id}`}
                      className="h-8 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-all hover:bg-sp-elevated"
                      style={{ border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
                    >
                      Ver
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sp-t3 t-small">No se encontraron trabajadores</div>
          )}
        </Card>
      )}
    </div>
  )
}
