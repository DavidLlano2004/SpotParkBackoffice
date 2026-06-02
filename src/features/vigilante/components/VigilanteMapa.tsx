'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Bike, Plus, Minus, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@utils/cn'
import { ZONES, VEHICLE_RECORDS } from '../data/mock'
import type { GuardZone } from '@types-sp/vigilante.types'
import type { SpaceStatus } from '@types-sp/parking.types'

const CELL_COLORS: Record<SpaceStatus, { bg: string; text: string; label: string }> = {
  free:        { bg: '#3DA35D',  text: '#fff',     label: 'Libre' },
  occupied:    { bg: '#E5484D',  text: '#fff',     label: 'Ocupado' },
  reserved:    { bg: '#E0A211',  text: '#fff',     label: 'Reservado' },
  disabled:    { bg: '#E5E7EB',  text: '#9AA0A6',  label: 'Bloqueado' },
  maintenance: { bg: '#9AA0A6',  text: '#fff',     label: 'Mant.' },
}

interface SelectedSpace {
  zone: GuardZone
  row: number
  col: number
  status: SpaceStatus
  spaceId: string
}

export function VigilanteMapa() {
  const [activeZone, setActiveZone] = useState(ZONES[0].id)
  const [selected, setSelected] = useState<SelectedSpace | null>(null)
  const [entryPlate, setEntryPlate] = useState('')
  const [mode, setMode] = useState<'entry' | 'exit' | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const zone = ZONES.find(z => z.id === activeZone)!
  const spaceLabel = (z: string, r: number, c: number) => `${z}-${String(r * zone.cols + c + 1).padStart(2, '0')}`

  const handleCell = (z: GuardZone, r: number, c: number, status: SpaceStatus) => {
    if (status === 'disabled' || status === 'maintenance') return
    setSelected({ zone: z, row: r, col: c, status, spaceId: spaceLabel(z.id, r, c) })
    setMode(status === 'free' ? 'entry' : 'exit')
    setConfirmed(false)
    setEntryPlate('')
  }

  const vehicleInSpace = selected
    ? VEHICLE_RECORDS.find(r => r.active && r.space === selected.spaceId)
    : null

  const handleConfirm = () => {
    setConfirmed(true)
    setTimeout(() => {
      setSelected(null)
      setMode(null)
      setConfirmed(false)
    }, 1800)
  }

  const zoneIcon = (vt: string) => vt === 'bike' ? <Bike size={13} /> : <Car size={13} />

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>Mapa de espacios</h1>
        <p className="text-[13px] text-sp-t2 mt-1">Selecciona un espacio para registrar entrada o salida</p>
      </div>

      <div className="flex gap-6">
        {/* Zone map */}
        <div className="flex-1">
          {/* Zone tabs */}
          <div className="flex gap-2 mb-5">
            {ZONES.map(z => {
              const total = z.rows * z.cols
              const occ = z.cells.flat().filter(c => c === 'occupied').length
              const active = z.id === activeZone
              return (
                <button
                  key={z.id}
                  onClick={() => { setActiveZone(z.id); setSelected(null) }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors',
                    active ? 'text-sp-t1 shadow-sm' : 'text-sp-t2 hover:bg-white',
                  )}
                  style={{
                    background: active ? '#fff' : 'transparent',
                    border: active ? '1px solid var(--sp-border)' : '1px solid transparent',
                  }}
                >
                  <span style={{ color: active ? 'var(--sp-lime-deep)' : undefined }}>{zoneIcon(z.vehicleType)}</span>
                  <span>{z.label}</span>
                  <span className={cn('text-[11px]', active ? 'text-sp-t2' : 'text-sp-t3')}>
                    {occ}/{total}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
            {/* Occupancy bar */}
            <div className="mb-5">
              {(() => {
                const total = zone.rows * zone.cols
                const occ = zone.cells.flat().filter(c => c === 'occupied').length
                const res = zone.cells.flat().filter(c => c === 'reserved').length
                return (
                  <div>
                    <div className="flex items-center justify-between text-[12px] text-sp-t2 mb-1.5">
                      <span className="font-medium">{zone.label} · {zone.vehicleType === 'car' ? 'Autos' : zone.vehicleType === 'moto' ? 'Motos' : 'Bicicletas'}</span>
                      <span>{occ} ocupados · {res} reservados · {total - occ - res} libres</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden flex" style={{ background: '#F3F4EF' }}>
                      <div className="h-full transition-all" style={{ width: `${(occ / total) * 100}%`, background: '#E5484D' }} />
                      <div className="h-full transition-all" style={{ width: `${(res / total) * 100}%`, background: '#E0A211' }} />
                    </div>
                  </div>
                )
              })()}
            </div>

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${zone.cols}, minmax(0, 1fr))` }}
            >
              {zone.cells.map((row, ri) =>
                row.map((cell, ci) => {
                  const id = spaceLabel(zone.id, ri, ci)
                  const c = CELL_COLORS[cell]
                  const isSel = selected?.spaceId === id
                  return (
                    <motion.button
                      key={id}
                      whileTap={cell !== 'disabled' ? { scale: 0.92 } : undefined}
                      onClick={() => handleCell(zone, ri, ci, cell)}
                      disabled={cell === 'disabled' || cell === 'maintenance'}
                      className={cn(
                        'h-12 rounded-xl flex flex-col items-center justify-center text-[9px] font-bold transition-all',
                        cell === 'disabled' ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-85',
                      )}
                      style={{
                        background: isSel ? 'var(--sp-ink)' : c.bg,
                        color: isSel ? 'var(--sp-lime)' : c.text,
                        opacity: cell === 'disabled' ? 0.4 : 1,
                        outline: isSel ? '2px solid var(--sp-lime)' : undefined,
                        outlineOffset: '2px',
                      }}
                    >
                      <span>{zone.id}{String(ri * zone.cols + ci + 1).padStart(2, '0')}</span>
                    </motion.button>
                  )
                })
              )}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-5 pt-4" style={{ borderTop: '1px solid var(--sp-border-card)' }}>
              {(['free', 'occupied', 'reserved', 'disabled'] as SpaceStatus[]).map(s => (
                <span key={s} className="flex items-center gap-1.5 text-[11.5px] text-sp-t2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: CELL_COLORS[s].bg, opacity: s === 'disabled' ? 0.4 : 1 }} />
                  {CELL_COLORS[s].label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-[280px] shrink-0">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-6 text-center"
                style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: '#F3F4EF' }}>
                  <Car size={22} className="text-sp-t3" />
                </div>
                <p className="text-[13px] text-sp-t2">Selecciona un espacio del mapa para registrar una operación</p>
              </motion.div>
            ) : confirmed ? (
              <motion.div
                key="confirmed"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-8 text-center"
                style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
              >
                <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: '#3DA35D' }} />
                <div className="text-[14px] font-semibold text-sp-t1">¡Registrado!</div>
                <div className="text-[12px] text-sp-t2 mt-1">
                  {mode === 'entry' ? 'Entrada' : 'Salida'} registrada exitosamente
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="panel"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}
              >
                {/* Panel header */}
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ background: mode === 'entry' ? '#E4F3E9' : '#FBE4E5', borderBottom: '1px solid var(--sp-border-card)' }}
                >
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: mode === 'entry' ? '#1F7A3D' : '#B4262B' }}>
                      {mode === 'entry' ? 'Registrar Entrada' : 'Registrar Salida'}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: mode === 'entry' ? '#1F7A3D' : '#B4262B', opacity: 0.7 }}>
                      Espacio {selected.spaceId}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-sp-t3 hover:text-sp-t1 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {mode === 'entry' ? (
                    <>
                      <div>
                        <label className="text-[11px] font-medium text-sp-t2 block mb-1">Placa del vehículo</label>
                        <input
                          value={entryPlate}
                          onChange={e => setEntryPlate(e.target.value.toUpperCase())}
                          placeholder="ABC-123"
                          maxLength={7}
                          className="w-full h-10 px-3 rounded-xl border border-sp-border text-[13px] font-mono font-bold text-sp-t1 uppercase bg-sp-bg focus:outline-none focus:border-sp-ink/30"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-sp-t2 block mb-1">Tipo de pago</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Efectivo', 'Tarjeta', 'App', 'QR']).map(p => (
                            <button key={p} className="h-9 rounded-xl border border-sp-border text-[12px] text-sp-t2 hover:border-sp-ink/30 hover:text-sp-t1 transition-colors">
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    vehicleInSpace ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl" style={{ background: '#F3F4EF' }}>
                          <div className="text-[12px] font-bold text-sp-t1 font-mono">{vehicleInSpace.plate}</div>
                          <div className="text-[11px] text-sp-t2 mt-0.5">Entrada: {vehicleInSpace.inTime}</div>
                          <div className="text-[11px] text-sp-t2">Duración: {vehicleInSpace.durMin} min</div>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: '#E4F3E9' }}>
                          <div className="text-[11px] text-sp-t2 font-medium">Total a cobrar</div>
                          <div className="text-[20px] font-bold" style={{ color: '#1F7A3D' }}>
                            ${vehicleInSpace.amount.toLocaleString('es-CO')}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl text-center" style={{ background: '#FBEFD6' }}>
                        <p className="text-[12px]" style={{ color: '#9A5B0E' }}>No hay registro de entrada en este espacio</p>
                      </div>
                    )
                  )}

                  <button
                    onClick={handleConfirm}
                    disabled={mode === 'entry' && !entryPlate}
                    className="w-full h-10 rounded-xl text-[13px] font-semibold transition-opacity disabled:opacity-40"
                    style={{ background: mode === 'entry' ? '#3DA35D' : '#E5484D', color: '#fff' }}
                  >
                    {mode === 'entry' ? 'Confirmar Entrada' : 'Confirmar Salida'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
