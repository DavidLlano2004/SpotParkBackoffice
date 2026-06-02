'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell } from 'lucide-react'
import { useAuthStore } from '@stores/useAuthStore'
import { useUIStore } from '@stores/useUIStore'

const ROUTE_LABELS: Record<string, string> = {
  '/':             'Dashboard',
  '/reportes':     'Reportes',
  '/parqueaderos': 'Parqueaderos',
  '/espacios':     'Espacios',
  '/tarifas':      'Tarifas',
  '/trabajadores': 'Trabajadores',
  '/turnos':       'Turnos',
  '/usuarios':     'Usuarios app',
  '/incidentes':   'Incidentes',
  '/empresas':     'Empresas',
  '/facturacion':  'Facturación',
  '/ajustes':      'Ajustes',
}

function buildBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return [{ label: 'Dashboard' }]
  const crumbs: { label: string; href?: string }[] = []
  let path = ''
  for (let i = 0; i < parts.length; i++) {
    path += '/' + parts[i]
    const label = ROUTE_LABELS[path] ?? (parts[i].length > 10 ? parts[i].slice(0, 8) + '…' : parts[i])
    crumbs.push(i < parts.length - 1 ? { label, href: path } : { label })
  }
  return crumbs
}

export function TopBar() {
  const pathname     = usePathname()
  const { user }     = useAuthStore()
  const notifCount   = useUIStore((s) => s.notifCount)
  const crumbs       = buildBreadcrumbs(pathname)

  return (
    <header
      className="h-14 shrink-0 flex items-center px-6 gap-4"
      style={{ borderBottom: '1px solid var(--sp-border)', background: 'var(--sp-bg)' }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 min-w-0 flex-1">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-sp-t4 text-sm">/</span>}
            {c.href ? (
              <Link
                href={c.href}
                className="text-[13.5px] font-medium text-sp-t2 hover:text-sp-t1 transition-colors whitespace-nowrap"
              >
                {c.label}
              </Link>
            ) : (
              <span className="text-[13.5px] font-semibold text-sp-t1 whitespace-nowrap">
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {/* Search */}
        <div
          className="flex items-center gap-2 h-9 px-3 rounded-[11px] w-60"
          style={{
            background:  'var(--sp-surface)',
            border:      '1px solid var(--sp-border)',
            boxShadow:   'var(--sp-sh-card)',
          }}
        >
          <Search size={16} className="text-sp-t3 shrink-0" />
          <input
            placeholder="Buscar parqueadero, trabajador…"
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-sp-t1 placeholder:text-sp-t3"
          />
          <span
            className="text-[11px] text-sp-t3 font-semibold rounded px-1 py-0.5"
            style={{ border: '1px solid var(--sp-border)' }}
          >
            ⌘K
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-[11px] flex items-center justify-center text-sp-t2 hover:text-sp-t1 transition-colors"
          style={{
            border:    '1px solid var(--sp-border)',
            background: 'var(--sp-surface)',
            boxShadow: 'var(--sp-sh-card)',
          }}
        >
          <Bell size={17} />
          {notifCount > 0 && (
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: 'var(--sp-red)', border: '1.5px solid var(--sp-surface)' }}
            />
          )}
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold"
          style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
        >
          {user?.init ?? 'NS'}
        </div>
      </div>
    </header>
  )
}
