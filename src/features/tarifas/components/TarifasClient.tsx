'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, Bike, Zap, Edit2, Check, X } from 'lucide-react'
import { Card, CardHeader } from '@components/ui/Card'
import { MOCK_PARKINGS } from '@features/parqueaderos/data/mock'
import { formatCOP } from '@utils/formatCurrency'
import type { VehicleType } from '@types-sp/parking.types'

type VehicleRow = {
  type:     VehicleType
  label:    string
  icon:     React.ReactNode
  hour:     number
  day:      number
  min:      string
  grace:    string
  dynamic?: boolean
}

const BASE_TARIFAS: VehicleRow[] = [
  { type: 'car',  label: 'Carro',      icon: <Car size={16} />,  hour: 3500, day: 35000, min: '30 min', grace: '10 min', dynamic: true  },
  { type: 'moto', label: 'Moto',       icon: <Bike size={16} />, hour: 2000, day: 20000, min: '30 min', grace: '10 min', dynamic: false },
  { type: 'bike', label: 'Bicicleta',  icon: <Bike size={16} />, hour: 1000, day: 8000,  min: '15 min', grace: '5 min',  dynamic: false },
  { type: 'suv',  label: 'SUV/Camión', icon: <Car size={16} />,  hour: 5000, day: 50000, min: '30 min', grace: '10 min', dynamic: true  },
]

function TarifaRow({ row, editing, onEdit, onSave, onCancel }: {
  row:       VehicleRow
  editing:   boolean
  onEdit:    () => void
  onSave:    () => void
  onCancel:  () => void
}) {
  const [hour, setHour] = useState(row.hour)
  const [day,  setDay]  = useState(row.day)

  return (
    <tr style={{ borderBottom: '1px solid var(--sp-separator)' }}>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--sp-elevated)' }}>{row.icon}</div>
          <span className="font-semibold text-[14px]">{row.label}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        {editing ? (
          <input type="number" value={hour} onChange={(e) => setHour(+e.target.value)}
            className="w-24 h-8 px-2 rounded-lg text-[13px] tnum outline-none"
            style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-lime)' }} />
        ) : (
          <span className="tnum font-semibold">{formatCOP(row.hour)}</span>
        )}
      </td>
      <td className="px-4 py-4">
        {editing ? (
          <input type="number" value={day} onChange={(e) => setDay(+e.target.value)}
            className="w-28 h-8 px-2 rounded-lg text-[13px] tnum outline-none"
            style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-lime)' }} />
        ) : (
          <span className="tnum font-semibold">{formatCOP(row.day)}</span>
        )}
      </td>
      <td className="px-4 py-4 t-small text-sp-t2">{row.min}</td>
      <td className="px-4 py-4 t-small text-sp-t2">{row.grace}</td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold uppercase`}
          style={{ background: row.dynamic ? 'var(--sp-lime-bg)' : 'var(--sp-elevated)', color: row.dynamic ? 'var(--sp-lime-deep)' : 'var(--sp-t3)' }}>
          {row.dynamic ? 'Activa' : 'Inactiva'}
        </span>
      </td>
      <td className="px-4 py-4">
        {editing ? (
          <div className="flex gap-1.5">
            <button onClick={onSave} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--sp-lime)', color: 'var(--sp-ink)' }}><Check size={12} /></button>
            <button onClick={onCancel} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t2)' }}><X size={12} /></button>
          </div>
        ) : (
          <button onClick={onEdit} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-sp-elevated"
            style={{ border: '1px solid var(--sp-border)', color: 'var(--sp-t2)' }}>
            <Edit2 size={12} />
          </button>
        )}
      </td>
    </tr>
  )
}

export function TarifasClient() {
  const [selectedParking, setSelectedParking] = useState('todos')
  const [editingRow, setEditingRow] = useState<VehicleType | null>(null)

  const activeParkings = MOCK_PARKINGS.filter((p) => p.status === 'active')

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-5">
        <h1 className="t-h1">Tarifas</h1>
      </div>

      {/* Parking selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setSelectedParking('todos')}
          className="h-9 px-4 rounded-xl text-[13px] font-medium transition-all"
          style={{
            background: selectedParking === 'todos' ? 'var(--sp-ink)' : 'var(--sp-surface)',
            color:      selectedParking === 'todos' ? '#fff' : 'var(--sp-t2)',
            border:     `1px solid ${selectedParking === 'todos' ? 'var(--sp-ink)' : 'var(--sp-border)'}`,
          }}
        >
          Todos
        </button>
        {activeParkings.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedParking(p.id)}
            className="h-9 px-4 rounded-xl text-[13px] font-medium transition-all"
            style={{
              background: selectedParking === p.id ? 'var(--sp-ink)' : 'var(--sp-surface)',
              color:      selectedParking === p.id ? '#fff' : 'var(--sp-t2)',
              border:     `1px solid ${selectedParking === p.id ? 'var(--sp-ink)' : 'var(--sp-border)'}`,
            }}
          >
            {p.short}
          </button>
        ))}
      </div>

      {/* Tarifas table */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card padding="none">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--sp-separator)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[15px]">
                  {selectedParking === 'todos' ? 'Tarifas globales' : activeParkings.find((p) => p.id === selectedParking)?.name}
                </h3>
                <p className="t-micro text-sp-t3 mt-0.5">
                  {selectedParking === 'todos' ? 'Se aplican a todos los parqueaderos sin configuración específica' : 'Configuración específica de este parqueadero'}
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-[12px] font-semibold"
                style={{ background: 'var(--sp-lime-bg)', color: 'var(--sp-lime-deep)', border: '1px solid var(--sp-lime-tint)' }}
              >
                <Zap size={11} /> Tarifas dinámicas disponibles
              </div>
            </div>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--sp-separator)' }}>
                {['Vehículo', 'Tarifa/hora', 'Tarifa/día', 'Mínimo', 'Gracia', 'Dinámica', ''].map((h) => (
                  <th key={h} className="t-micro upper text-sp-t3 text-[11px] text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BASE_TARIFAS.map((row) => (
                <TarifaRow
                  key={row.type}
                  row={row}
                  editing={editingRow === row.type}
                  onEdit={() => setEditingRow(row.type)}
                  onSave={() => setEditingRow(null)}
                  onCancel={() => setEditingRow(null)}
                />
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* Dynamic pricing info */}
      <div
        className="rounded-2xl p-5 mt-4 relative overflow-hidden"
        style={{ background: 'var(--sp-lime-bg)', border: '1px solid var(--sp-lime-tint)' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: 'var(--sp-lime)' }} />
        <div className="font-semibold text-[14px] mb-2" style={{ color: 'var(--sp-lime-deep)' }}>Sobre las tarifas dinámicas</div>
        <p className="t-small text-sp-t2 leading-relaxed">
          Las tarifas dinámicas ajustan el precio automáticamente según la demanda en tiempo real.
          Cuando la ocupación supera el 80%, la tarifa sube hasta el precio pico. Por debajo del 40%, baja al precio valle.
          Esto maximiza los ingresos y distribuye mejor el flujo de vehículos.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { l: 'Umbral alto (pico)',  v: '>80% ocupación', sub: 'Precio pico se aplica' },
            { l: 'Umbral bajo (valle)', v: '<40% ocupación', sub: 'Precio valle se aplica' },
            { l: 'Zona normal',         v: '40–80%',         sub: 'Precio estándar' },
          ].map(({ l, v, sub }) => (
            <div key={l} className="rounded-xl p-3" style={{ background: 'rgba(198,242,78,0.1)', border: '1px solid var(--sp-lime-tint)' }}>
              <div className="t-micro text-[10px] uppercase mb-1" style={{ color: 'var(--sp-lime-deep)' }}>{l}</div>
              <div className="font-semibold text-[14px]">{v}</div>
              <div className="t-micro text-sp-t3 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
