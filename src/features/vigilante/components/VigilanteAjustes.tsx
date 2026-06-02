'use client'

import { useState } from 'react'
import { Bell, Volume2, RefreshCw, Eye, Smartphone, Shield } from 'lucide-react'

interface Toggle {
  id: string
  label: string
  desc: string
  icon: React.ReactNode
  enabled: boolean
}

const INITIAL_TOGGLES: Toggle[] = [
  { id: 'notif_entry', label: 'Notificar entradas', desc: 'Alertas al registrar entrada de vehículos', icon: <Bell size={16} />, enabled: true },
  { id: 'notif_exit', label: 'Notificar salidas', desc: 'Alertas al registrar salida de vehículos', icon: <Bell size={16} />, enabled: true },
  { id: 'sound', label: 'Sonidos del sistema', desc: 'Reproducir sonidos al completar acciones', icon: <Volume2 size={16} />, enabled: false },
  { id: 'autorefresh', label: 'Actualización automática', desc: 'Actualizar el mapa de espacios cada 30 segundos', icon: <RefreshCw size={16} />, enabled: true },
  { id: 'anomaly', label: 'Alertas de anomalías', desc: 'Mostrar banner cuando se detectan vehículos sospechosos', icon: <Eye size={16} />, enabled: true },
  { id: 'mobile', label: 'Vista móvil optimizada', desc: 'Usar diseño compacto en pantallas pequeñas', icon: <Smartphone size={16} />, enabled: false },
  { id: 'twofa', label: 'Verificación en acciones críticas', desc: 'Pedir confirmación antes de registrar salidas', icon: <Shield size={16} />, enabled: true },
]

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: enabled ? 'var(--sp-ink)' : '#E5E7EB' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: enabled ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  )
}

export function VigilanteAjustes() {
  const [toggles, setToggles] = useState<Toggle[]>(INITIAL_TOGGLES)

  const update = (id: string, val: boolean) =>
    setToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: val } : t))

  const sections = [
    { label: 'Notificaciones', ids: ['notif_entry', 'notif_exit', 'sound'] },
    { label: 'Comportamiento', ids: ['autorefresh', 'anomaly', 'mobile'] },
    { label: 'Seguridad', ids: ['twofa'] },
  ]

  return (
    <div className="max-w-[680px] mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-sp-t1" style={{ fontFamily: 'var(--sp-display)' }}>Ajustes</h1>
        <p className="text-[13px] text-sp-t2 mt-1">Personaliza tu experiencia en el panel de vigilante</p>
      </div>

      {sections.map(sec => {
        const items = toggles.filter(t => sec.ids.includes(t.id))
        return (
          <div key={sec.label} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--sp-border-card)', background: '#F9F9F7' }}>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-sp-t3">{sec.label}</span>
            </div>
            <div className="divide-y divide-sp-border/40">
              {items.map(t => (
                <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: t.enabled ? 'var(--sp-ink)' : '#F3F4EF', color: t.enabled ? 'var(--sp-lime)' : 'var(--sp-t3)' }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-sp-t1">{t.label}</div>
                    <div className="text-[11.5px] text-sp-t3 mt-0.5">{t.desc}</div>
                  </div>
                  <ToggleSwitch enabled={t.enabled} onChange={val => update(t.id, val)} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
