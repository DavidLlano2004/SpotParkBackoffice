'use client'

import { HEATMAP } from '../data/mock'

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12
  return `${h}${i < 12 ? 'a' : 'p'}`
})

function heatColor(pct: number): string {
  if (pct < 10) return '#EFF6DC'
  if (pct < 25) return '#C6F24E'
  if (pct < 45) return '#E0A211'
  if (pct < 65) return '#E8851E'
  return '#E5484D'
}

export function VigilanteHeatmap() {
  const maxPct = Math.max(...HEATMAP.flatMap(r => r.hours))

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>Mapa de calor</h1>
        <p className="text-[13px] text-sp-t2 mt-1">Ocupación semanal por hora — {HEATMAP[0].day} a {HEATMAP[HEATMAP.length - 1].day}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 overflow-x-auto" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
        {/* Hour labels */}
        <div className="flex mb-2 pl-12">
          {HOURS.map((h, i) => (
            <div key={i} className="flex-1 text-center text-[9px] text-sp-t3 font-medium min-w-[28px]">{h}</div>
          ))}
        </div>

        {/* Grid rows */}
        <div className="space-y-1.5">
          {HEATMAP.map(row => (
            <div key={row.day} className="flex items-center gap-0">
              <div className="w-12 shrink-0 text-[11px] font-medium text-sp-t2 pr-3 text-right">{row.day}</div>
              <div className="flex flex-1 gap-0.5">
                {row.hours.map((pct, h) => (
                  <div
                    key={h}
                    title={`${row.day} ${h}:00 — ${pct}%`}
                    className="flex-1 h-8 rounded-sm cursor-default transition-opacity hover:opacity-80 min-w-[28px]"
                    style={{ background: heatColor(pct) }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--sp-border-card)' }}>
          <span className="text-[11px] text-sp-t3 mr-1">Ocupación:</span>
          {[
            { label: '0-10%', color: '#EFF6DC' },
            { label: '10-25%', color: '#C6F24E' },
            { label: '25-45%', color: '#E0A211' },
            { label: '45-65%', color: '#E8851E' },
            { label: '65-100%', color: '#E5484D' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-sp-t2">
              <span className="w-5 h-4 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-sp-t3">Pico máximo: {maxPct}%</span>
        </div>
      </div>

      {/* Peak hours analysis */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Hora pico AM', value: '8:00 – 10:00',
            desc: 'Mayor ocupación matutina en días laborales',
            color: '#E5484D', bg: '#FBE4E5',
          },
          {
            label: 'Hora pico PM', value: '12:00 – 14:00',
            desc: 'Segundo pico del día, especialmente lunes y viernes',
            color: '#E0A211', bg: '#FBEFD6',
          },
          {
            label: 'Hora valle', value: '22:00 – 6:00',
            desc: 'Ocupación mínima, menos del 10% en promedio',
            color: '#3DA35D', bg: '#E4F3E9',
          },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
            <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: c.bg }}>
              <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />
            </div>
            <div className="text-[11px] text-sp-t3 mb-0.5">{c.label}</div>
            <div className="text-[15px] font-bold text-sp-t1">{c.value}</div>
            <div className="text-[11.5px] text-sp-t2 mt-1 leading-relaxed">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
