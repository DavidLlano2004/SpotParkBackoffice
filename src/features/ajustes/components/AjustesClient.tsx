'use client'

import { useState } from 'react'
import { Bell, Shield, Palette, Globe, Smartphone, Save } from 'lucide-react'
import { Card, CardHeader } from '@components/ui/Card'
import { useAuthStore } from '@stores/useAuthStore'
import { toast } from 'sonner'

type Section = 'perfil' | 'notificaciones' | 'seguridad' | 'apariencia'

const NAV: { k: Section; l: string; icon: React.ReactNode }[] = [
  { k: 'perfil',          l: 'Perfil',          icon: <Smartphone size={15} /> },
  { k: 'notificaciones',  l: 'Notificaciones',  icon: <Bell size={15} /> },
  { k: 'seguridad',       l: 'Seguridad',       icon: <Shield size={15} /> },
  { k: 'apariencia',      l: 'Apariencia',      icon: <Palette size={15} /> },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-all shrink-0"
      style={{ background: checked ? 'var(--sp-lime)' : 'var(--sp-elevated)', border: `1px solid ${checked ? 'var(--sp-lime)' : 'var(--sp-border)'}` }}
    >
      <span
        className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
        style={{ background: checked ? 'var(--sp-ink)' : 'var(--sp-t3)', left: checked ? 'calc(100% - 16px)' : '1px' }}
      />
    </button>
  )
}

function SettingRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5" style={{ borderBottom: '1px solid var(--sp-separator)' }}>
      <div>
        <div className="font-medium text-[13.5px]">{label}</div>
        <div className="t-micro text-sp-t3 mt-0.5">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block t-micro uppercase text-sp-t3 text-[10px] mb-1">{children}</label>
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-10 px-3 rounded-xl text-[13px] outline-none transition-all"
      style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
    />
  )
}

export function AjustesClient() {
  const { user } = useAuthStore()
  const [section, setSection] = useState<Section>('perfil')
  const [notifs, setNotifs] = useState({ incidents: true, entries: false, reports: true, weekly: true })
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  const handleSave = () => toast.success('Cambios guardados')

  return (
    <div className="max-w-[900px]">
      <h1 className="t-h1 mb-5">Ajustes</h1>

      <div className="grid grid-cols-[200px_1fr] gap-5">
        {/* Sidebar nav */}
        <div className="flex flex-col gap-1">
          {NAV.map(({ k, l, icon }) => (
            <button
              key={k}
              onClick={() => setSection(k)}
              className="flex items-center gap-2.5 h-9 px-3 rounded-xl text-[13px] font-medium text-left transition-all"
              style={{
                background: section === k ? 'var(--sp-ink)' : 'transparent',
                color:      section === k ? '#fff' : 'var(--sp-t2)',
              }}
            >
              {icon} {l}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {section === 'perfil' && (
            <Card padding="lg">
              <CardHeader title="Información del perfil" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2">
                  <FieldLabel>Nombre completo</FieldLabel>
                  <Input defaultValue={user?.name ?? 'Natalia Soto'} />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <Input defaultValue={user?.email ?? 'natalia@spotpark.co'} type="email" />
                </div>
                <div>
                  <FieldLabel>Teléfono</FieldLabel>
                  <Input defaultValue={user?.phone ?? '312 990 4456'} type="tel" />
                </div>
                <div className="col-span-2">
                  <FieldLabel>Rol</FieldLabel>
                  <div
                    className="h-10 px-3 rounded-xl text-[13px] flex items-center"
                    style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t3)' }}
                  >
                    {user?.role === 'super' ? 'Super Administrador' : 'Administrador de Parqueadero'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-4 h-10 px-5 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center gap-2"
                style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
              >
                <Save size={14} /> Guardar cambios
              </button>
            </Card>
          )}

          {section === 'notificaciones' && (
            <Card padding="lg">
              <CardHeader title="Notificaciones" />
              <div className="mt-2">
                <SettingRow label="Incidentes nuevos" desc="Recibe alertas cuando se reporte un incidente" checked={notifs.incidents} onChange={(v) => setNotifs((n) => ({ ...n, incidents: v }))} />
                <SettingRow label="Entradas y salidas" desc="Notificación en tiempo real de movimiento de vehículos" checked={notifs.entries} onChange={(v) => setNotifs((n) => ({ ...n, entries: v }))} />
                <SettingRow label="Reportes automáticos" desc="Reporte diario de métricas por correo" checked={notifs.reports} onChange={(v) => setNotifs((n) => ({ ...n, reports: v }))} />
                <SettingRow label="Resumen semanal" desc="Resumen de rendimiento cada lunes a las 8:00 AM" checked={notifs.weekly} onChange={(v) => setNotifs((n) => ({ ...n, weekly: v }))} />
              </div>
              <button onClick={handleSave} className="mt-4 h-10 px-5 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center gap-2" style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}>
                <Save size={14} /> Guardar
              </button>
            </Card>
          )}

          {section === 'seguridad' && (
            <Card padding="lg">
              <CardHeader title="Seguridad" />
              <div className="flex flex-col gap-4 mt-4">
                <div>
                  <FieldLabel>Contraseña actual</FieldLabel>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <FieldLabel>Nueva contraseña</FieldLabel>
                  <Input type="password" placeholder="Mínimo 8 caracteres" />
                </div>
                <div>
                  <FieldLabel>Confirmar nueva contraseña</FieldLabel>
                  <Input type="password" placeholder="Repite la contraseña" />
                </div>
                <div className="p-3 rounded-xl text-[12px]" style={{ background: 'var(--sp-elevated)', color: 'var(--sp-t2)' }}>
                  <Globe size={12} className="inline mr-1.5" />
                  Última sesión: <strong>Hoy, Manizales · Chrome</strong>
                </div>
              </div>
              <button onClick={handleSave} className="mt-4 h-10 px-5 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center gap-2" style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}>
                <Save size={14} /> Actualizar contraseña
              </button>
            </Card>
          )}

          {section === 'apariencia' && (
            <Card padding="lg">
              <CardHeader title="Apariencia" />
              <div className="mt-4">
                <FieldLabel>Tema</FieldLabel>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['light', 'dark', 'system'] as const).map((v) => {
                    const l = v === 'light' ? 'Claro' : v === 'dark' ? 'Oscuro' : 'Sistema'
                    return (
                    <button
                      key={v}
                      onClick={() => setTheme(v)}
                      className="h-24 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
                      style={{
                        background: theme === v ? 'var(--sp-lime-bg)' : 'var(--sp-elevated)',
                        border: `2px solid ${theme === v ? 'var(--sp-lime)' : 'var(--sp-border)'}`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg"
                        style={{ background: v === 'light' ? '#F3F4EF' : v === 'dark' ? '#0F1115' : 'linear-gradient(135deg, #F3F4EF 50%, #0F1115 50%)' }}
                      />
                      <span className="text-[12px] font-medium">{l}</span>
                    </button>
                  )})}

                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
