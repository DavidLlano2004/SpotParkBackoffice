'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Map, ClipboardList, MessageSquare,
  AlertTriangle, BarChart2, User, Settings, LogOut,
  ChevronLeft, Clock,
} from 'lucide-react'
import { cn } from '@utils/cn'
import { GUARD, CHAT_CHANNELS, GUARD_INCIDENTS } from '../data/mock'

const chatUnread = CHAT_CHANNELS.reduce((s, c) => s + c.unread, 0)
const openIncidents = GUARD_INCIDENTS.filter(i => i.status === 'open').length

const NAV_ITEMS = [
  { key: 'dashboard',  href: '/vigilante/dashboard',  icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { key: 'mapa',       href: '/vigilante/mapa',        icon: <Map size={18} />,             label: 'Mapa de espacios' },
  { key: 'registros',  href: '/vigilante/registros',   icon: <ClipboardList size={18} />,   label: 'Registros' },
  { key: 'chat',       href: '/vigilante/chat',        icon: <MessageSquare size={18} />,   label: 'Chat', badge: chatUnread },
  { key: 'incidentes', href: '/vigilante/incidentes',  icon: <AlertTriangle size={18} />,   label: 'Incidentes', badge: openIncidents },
  { key: 'heatmap',    href: '/vigilante/heatmap',     icon: <BarChart2 size={18} />,       label: 'Mapa de calor' },
]

const BOTTOM_ITEMS = [
  { key: 'perfil',  href: '/vigilante/perfil',  icon: <User size={18} />,     label: 'Mi perfil' },
  { key: 'ajustes', href: '/vigilante/ajustes', icon: <Settings size={18} />, label: 'Ajustes' },
]

function NavLink({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: number }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-3 w-full h-[42px] px-3 rounded-xl text-[13.5px] font-medium transition-colors duration-150',
        active ? 'text-white' : 'text-white/60 hover:text-white/80 hover:bg-white/5',
      )}
      style={active ? { background: 'rgba(198,242,78,0.12)' } : undefined}
    >
      {active && (
        <motion.span
          layoutId="vig-sidebar-active"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
          style={{ background: 'var(--sp-lime)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span style={{ color: active ? 'var(--sp-lime)' : undefined }}>{icon}</span>
      <span className={active ? 'font-semibold' : ''}>{label}</span>
      {(badge ?? 0) > 0 && (
        <span className="ml-auto min-w-[18px] h-[18px] rounded-full bg-sp-red text-white text-[10px] font-bold flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function VigilanteSidebar() {
  const router = useRouter()

  return (
    <aside
      className="w-[236px] shrink-0 flex flex-col h-screen"
      style={{ background: 'var(--sp-ink)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 p-[18px] shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
          style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
        >
          <span className="text-[20px] font-bold leading-none" style={{ color: 'var(--sp-ink)', fontFamily: 'var(--sp-display)' }}>P</span>
        </div>
        <div>
          <div className="text-white text-[15px] font-semibold" style={{ fontFamily: 'var(--sp-display)' }}>SpotPark</div>
          <div className="text-white/40 text-[10.5px] mt-0.5">Panel Vigilante</div>
        </div>
      </div>

      {/* Active shift banner */}
      <div
        className="mx-3 mt-3 p-3 rounded-xl"
        style={{ background: 'rgba(198,242,78,0.08)', border: '1px solid rgba(198,242,78,0.18)' }}
      >
        <div className="flex items-center gap-1.5 mb-1" style={{ color: 'rgba(198,242,78,0.7)' }}>
          <Clock size={11} />
          <span className="text-[10.5px] font-medium">Turno activo</span>
        </div>
        <div className="text-white text-[12.5px] font-semibold">{GUARD.shift}</div>
        <div className="text-white/40 text-[10.5px] mt-0.5 truncate">{GUARD.parking}</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 no-sb mt-1">
        <div className="text-[10px] font-medium uppercase tracking-widest px-3 mb-1.5 mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Operaciones
        </div>
        {NAV_ITEMS.map(({ key, ...item }) => (
          <NavLink key={key} {...item} />
        ))}

        <div className="text-[10px] font-medium uppercase tracking-widest px-3 mb-1.5 mt-4" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Cuenta
        </div>
        {BOTTOM_ITEMS.map(({ key, ...item }) => (
          <NavLink key={key} {...item} />
        ))}
      </nav>

      {/* Profile + back */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5 p-2 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
            style={{ background: 'var(--sp-lime)', color: 'var(--sp-ink)' }}
          >
            {GUARD.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[12.5px] font-semibold truncate">{GUARD.name}</div>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 mt-0.5"
              style={{ background: 'rgba(198,242,78,0.12)', color: 'rgba(198,242,78,0.8)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              Vigilante
            </span>
          </div>
          <button className="w-7 h-7 rounded-[9px] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-full h-7 rounded-[9px] flex items-center justify-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/60 transition-colors"
          style={{ border: '1px dashed rgba(255,255,255,0.16)' }}
        >
          <ChevronLeft size={12} />
          Volver al Panel Admin
        </button>
      </div>
    </aside>
  )
}
