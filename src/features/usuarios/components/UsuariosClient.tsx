'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Crown, AlertTriangle } from 'lucide-react'
import { Card } from '@components/ui/Card'
import { Badge } from '@components/ui/Badge'
import { MOCK_USERS } from '@features/usuarios/data/mock'
import { formatCOPk } from '@utils/formatCurrency'
import { TIER_COLORS } from '@constants/colors'
import type { UserTier } from '@types-sp/user.types'

const TIER_ORDER: UserTier[] = ['Platinum', 'Gold', 'Silver', 'Bronze']

function TierBadge({ tier }: { tier: UserTier }) {
  const cfg = TIER_COLORS[tier]
  return (
    <span
      className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold uppercase"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Crown size={9} />{tier}
    </span>
  )
}

export function UsuariosClient() {
  const [search, setSearch]   = useState('')
  const [tier, setTier]       = useState('todos')
  const [status, setStatus]   = useState('todos')

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase()) ||
                        u.plates.some((p) => p.toLowerCase().includes(search.toLowerCase()))
    const matchTier   = tier === 'todos' || u.tier === tier
    const matchStatus = status === 'todos' || u.status === status
    return matchSearch && matchTier && matchStatus
  })

  const totals = {
    total:    MOCK_USERS.length,
    active:   MOCK_USERS.filter((u) => u.status === 'active').length,
    platinum: MOCK_USERS.filter((u) => u.tier === 'Platinum').length,
    suspended:MOCK_USERS.filter((u) => u.status === 'suspended').length,
  }

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-5">
        <h1 className="t-h1">Usuarios</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total usuarios', value: totals.total,     icon: <Users size={16} /> },
          { label: 'Activos',        value: totals.active,    icon: <Users size={16} /> },
          { label: 'Platinum',       value: totals.platinum,  icon: <Crown size={16} /> },
          { label: 'Suspendidos',    value: totals.suspended, icon: <AlertTriangle size={16} /> },
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
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div
          className="flex items-center gap-2 h-9 px-3 rounded-xl flex-1 max-w-xs"
          style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-sh-card)' }}
        >
          <Search size={15} className="text-sp-t3 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuario, placa..."
            className="flex-1 bg-transparent border-none outline-none text-[13px]"
          />
        </div>
        <div className="flex gap-1.5">
          {(['todos', ...TIER_ORDER] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className="h-9 px-3 rounded-xl text-[13px] font-medium transition-all"
              style={{
                background: tier === t ? 'var(--sp-ink)' : 'var(--sp-surface)',
                color:      tier === t ? '#fff' : 'var(--sp-t2)',
                border:     `1px solid ${tier === t ? 'var(--sp-ink)' : 'var(--sp-border)'}`,
              }}
            >
              {t === 'todos' ? 'Todos' : t}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(['todos', 'active', 'suspended', 'inactive'] as const).map((s) => {
            const labels = { todos: 'Estado', active: 'Activo', suspended: 'Suspendido', inactive: 'Inactivo' }
            return (
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
                {labels[s]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--sp-separator)' }}>
              {['Usuario', 'Tier', 'Estado', 'Reservas', 'Gasto total', 'Placas', 'Última visita'].map((h) => (
                <th key={h} className="t-micro upper text-sp-t3 text-[11px] text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const statusCfg: Record<string, { label: string; color: string }> = {
                active:    { label: 'Activo',     color: 'var(--sp-green-tx)' },
                inactive:  { label: 'Inactivo',   color: 'var(--sp-t3)' },
                suspended: { label: 'Suspendido', color: 'var(--sp-red)' },
              }
              const sc = statusCfg[u.status]
              return (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-sp-elevated/40 transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--sp-separator)' : 'none' }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                        style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
                      >
                        {u.init}
                      </div>
                      <div>
                        <div className="font-semibold text-[13.5px]">{u.name}</div>
                        <div className="t-micro text-sp-t3">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><TierBadge tier={u.tier} /></td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-semibold" style={{ color: sc.color }}>{sc.label}</span>
                  </td>
                  <td className="px-4 py-3 tnum">{u.reservas}</td>
                  <td className="px-4 py-3 tnum font-semibold">{formatCOPk(u.spent)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.plates.map((p) => (
                        <Badge key={p} variant="neutral">{p}</Badge>
                      ))}
                      {u.plates.length === 0 && <span className="t-micro text-sp-t4">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 t-small text-sp-t2">{u.last}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sp-t3 t-small">No se encontraron usuarios</div>
        )}
      </Card>
    </div>
  )
}
