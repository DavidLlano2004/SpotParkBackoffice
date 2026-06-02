'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Mail, MapPin, AlertTriangle, Calendar, TrendingUp } from 'lucide-react'
import { useWorker } from '@hooks/useWorkers'
import { Card, CardHeader } from '@components/ui/Card'
import { WorkerStatusBadge } from '@components/ui/Badge'
import { MOCK_PARKINGS } from '@features/parqueaderos/data/mock'
import { MOCK_INCIDENTS } from '@features/incidentes/data/mock'
import { IncidentStatusBadge } from '@components/ui/Badge'
import type { WorkerRole } from '@types-sp/worker.types'

const ROLE_COLORS: Record<WorkerRole, string> = {
  'Vigilante':    'var(--sp-blue)',
  'Supervisor':   'var(--sp-lime-deep)',
  'Administrador':'var(--sp-t1)',
}

const SCHEDULE_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS = ['6AM', '2PM', '10PM']

export function WorkerDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const { data: worker, isLoading } = useWorker(id)
  const [tab, setTab] = useState<'info' | 'turno' | 'incidentes'>('info')

  if (isLoading) {
    return (
      <div className="max-w-[1000px]">
        <div className="h-8 w-48 rounded-xl bg-sp-surface animate-pulse mb-5" />
        <div className="h-64 rounded-[18px] bg-sp-surface animate-pulse" />
      </div>
    )
  }

  if (!worker) {
    return <div className="max-w-[1000px] py-20 text-center text-sp-t3">Trabajador no encontrado.</div>
  }

  const assignedParkings = worker.parkings.map((pid) => MOCK_PARKINGS.find((p) => p.id === pid)).filter(Boolean)
  const workerIncidents  = MOCK_INCIDENTS.filter((i) => i.assigned === worker.name)

  const mockShifts: boolean[][] = SCHEDULE_DAYS.map((_, di) =>
    HOURS.map((_, hi) => (di * 3 + hi + id.charCodeAt(1)) % 5 !== 0)
  )

  return (
    <div className="max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-sp-elevated shrink-0"
          style={{ border: '1px solid var(--sp-border)' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-bold shrink-0"
          style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
        >
          {worker.init}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="t-h1">{worker.name}</h1>
            <WorkerStatusBadge status={worker.status} />
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[13px] font-semibold" style={{ color: ROLE_COLORS[worker.role] }}>{worker.role}</span>
            <span className="t-small text-sp-t3">CC {worker.cc}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-xl w-fit"
        style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)' }}
      >
        {[['info', 'Información'], ['turno', 'Horario'], ['incidentes', 'Incidentes']].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k as typeof tab)}
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

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        {tab === 'info' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Contact & stats */}
            <div className="col-span-2 flex flex-col gap-4">
              <Card padding="lg">
                <CardHeader title="Contacto" />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center gap-2 t-small">
                    <Phone size={13} className="text-sp-t3 shrink-0" />
                    <span>{worker.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 t-small">
                    <Mail size={13} className="text-sp-t3 shrink-0" />
                    <span>{worker.email}</span>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader title="Estadísticas" />
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { l: 'Turnos completados', v: String(worker.shifts), icon: <Calendar size={14} /> },
                    { l: 'Entradas registradas', v: String(worker.entries), icon: <TrendingUp size={14} /> },
                    { l: 'Incidentes', v: String(worker.incidents), icon: <AlertTriangle size={14} /> },
                  ].map(({ l, v, icon }) => (
                    <div key={l} className="rounded-xl p-3" style={{ background: 'var(--sp-elevated)' }}>
                      <div className="flex items-center gap-1.5 text-sp-t3 mb-1">{icon}<span className="t-micro text-[10px] uppercase">{l}</span></div>
                      <div className="tnum text-[22px] font-bold" style={{ fontFamily: 'var(--sp-display)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader title="Parqueaderos asignados" />
                <div className="flex flex-col gap-2 mt-2">
                  {assignedParkings.map((p) => p && (
                    <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--sp-elevated)' }}>
                      <MapPin size={14} className="text-sp-t3 shrink-0" />
                      <div>
                        <div className="font-medium text-[13.5px]">{p.name}</div>
                        <div className="t-micro text-sp-t3">{p.addr} · {p.city}</div>
                      </div>
                    </div>
                  ))}
                  {assignedParkings.length === 0 && (
                    <div className="t-small text-sp-t3 py-4 text-center">Sin parqueaderos asignados</div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <Card padding="lg">
                <CardHeader title="Estado" />
                <div className="flex flex-col gap-3 mt-2">
                  <div>
                    <div className="t-micro text-sp-t3 text-[10px] uppercase">Último turno</div>
                    <div className="t-small mt-0.5">{worker.last}</div>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <CardHeader title="Acciones" />
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    className="h-9 rounded-xl text-[13px] font-semibold transition-all hover:opacity-90"
                    style={{ background: 'var(--sp-lime)', color: 'var(--sp-ink)', boxShadow: 'var(--sp-sh-lime)' }}
                  >
                    Editar información
                  </button>
                  {worker.status === 'suspended' ? (
                    <button
                      className="h-9 rounded-xl text-[13px] font-medium"
                      style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-green-tx)' }}
                    >
                      Reactivar trabajador
                    </button>
                  ) : (
                    <button
                      className="h-9 rounded-xl text-[13px] font-medium"
                      style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-red)' }}
                    >
                      Suspender trabajador
                    </button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === 'turno' && (
          <Card padding="lg">
            <CardHeader title="Horario semanal" right={<span className="t-micro text-sp-t3">Semana actual</span>} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4 t-micro text-sp-t3 font-medium">Día</th>
                    {HOURS.map((h) => (
                      <th key={h} className="text-center py-2 px-3 t-micro text-sp-t3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE_DAYS.map((day, di) => (
                    <tr key={day} style={{ borderTop: '1px solid var(--sp-separator)' }}>
                      <td className="py-3 pr-4 font-medium">{day}</td>
                      {HOURS.map((_, hi) => (
                        <td key={hi} className="py-3 px-3 text-center">
                          <div
                            className="inline-flex w-8 h-8 rounded-xl items-center justify-center mx-auto text-[11px] font-bold"
                            style={{
                              background: mockShifts[di][hi] ? 'var(--sp-lime-bg)' : 'var(--sp-elevated)',
                              color:      mockShifts[di][hi] ? 'var(--sp-lime-deep)' : 'var(--sp-t4)',
                              border:     `1px solid ${mockShifts[di][hi] ? 'var(--sp-lime-tint)' : 'var(--sp-border)'}`,
                            }}
                          >
                            {mockShifts[di][hi] ? '✓' : '—'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'incidentes' && (
          <Card padding="lg">
            <CardHeader title="Incidentes asignados" right={<span className="t-micro text-sp-t3">{workerIncidents.length} incidentes</span>} />
            {workerIncidents.length === 0 ? (
              <div className="py-10 text-center text-sp-t3 t-small">Sin incidentes asignados</div>
            ) : (
              <div className="flex flex-col gap-3 mt-3">
                {workerIncidents.map((inc) => (
                  <div key={inc.id} className="rounded-xl p-4" style={{ background: 'var(--sp-elevated)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-[14px]">{inc.tl}</div>
                        <div className="t-micro text-sp-t3 mt-0.5">{inc.id} · {inc.parking} · {inc.when}</div>
                      </div>
                      <IncidentStatusBadge status={inc.status} />
                    </div>
                    <p className="t-small text-sp-t2 mt-2 leading-relaxed">{inc.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  )
}
