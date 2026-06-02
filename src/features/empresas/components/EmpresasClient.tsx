'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Building2, Lock } from 'lucide-react'
import { Card } from '@components/ui/Card'
import { MOCK_COMPANIES } from '@features/empresas/data/mock'
import { formatCOPk } from '@utils/formatCurrency'
import { useRoleGuard } from '@hooks/useRoleGuard'

export function EmpresasClient() {
  const { isSuperAdmin } = useRoleGuard()
  const [search, setSearch] = useState('')

  const filtered = MOCK_COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nit.includes(search)
  )

  const totals = {
    total:   MOCK_COMPANIES.length,
    active:  MOCK_COMPANIES.filter((c) => c.status === 'active').length,
    billing: MOCK_COMPANIES.reduce((s, c) => s + c.billing, 0),
    parkings:MOCK_COMPANIES.reduce((s, c) => s + c.parkings, 0),
  }

  if (!isSuperAdmin) {
    return (
      <div className="max-w-[600px] mx-auto py-20 text-center flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--sp-elevated)' }}>
          <Lock size={22} className="text-sp-t3" />
        </div>
        <h2 className="font-semibold text-[18px]">Acceso restringido</h2>
        <p className="t-small text-sp-t2">Esta sección es exclusiva para Super Administradores de SpotPark.</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-5">
        <h1 className="t-h1">Empresas</h1>
        <button
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13.5px] font-semibold text-sp-ink"
          style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
        >
          <Plus size={17} /> Agregar empresa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Empresas',         value: totals.total },
          { label: 'Activas',          value: totals.active },
          { label: 'Parqueaderos',     value: totals.parkings },
          { label: 'Facturación total',value: formatCOPk(totals.billing) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl px-4 py-2.5" style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border-card)', boxShadow: 'var(--sp-sh-card)' }}>
            <div className="t-micro upper text-sp-t3 text-[10px]">{label}</div>
            <div className="tnum text-[19px] font-bold mt-0.5" style={{ fontFamily: 'var(--sp-display)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 h-9 px-3 rounded-xl mb-5 max-w-xs"
        style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-sh-card)' }}
      >
        <Search size={15} className="text-sp-t3 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar empresa o NIT..."
          className="flex-1 bg-transparent border-none outline-none text-[13px]"
        />
      </div>

      {/* Table */}
      <Card padding="none">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--sp-separator)' }}>
              {['Empresa', 'NIT', 'Contacto', 'Parqueaderos', 'Empleados', 'Facturación', 'Estado', ''].map((h) => (
                <th key={h} className="t-micro upper text-sp-t3 text-[11px] text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-sp-elevated/40 transition-colors"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--sp-separator)' : 'none' }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--sp-elevated)' }}>
                      <Building2 size={14} className="text-sp-t2" />
                    </div>
                    <span className="font-semibold text-[13.5px]">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 tnum t-small text-sp-t2">{c.nit}</td>
                <td className="px-4 py-3 t-small text-sp-t2">{c.contact}</td>
                <td className="px-4 py-3 tnum">{c.parkings}</td>
                <td className="px-4 py-3 tnum">{c.employees}</td>
                <td className="px-4 py-3 tnum font-semibold">{formatCOPk(c.billing)}</td>
                <td className="px-4 py-3">
                  <span
                    className="h-5 px-2 rounded-full text-[10px] font-bold uppercase inline-flex items-center"
                    style={{
                      background: c.status === 'active' ? 'var(--sp-lime-bg)' : 'var(--sp-elevated)',
                      color:      c.status === 'active' ? 'var(--sp-lime-deep)' : 'var(--sp-t3)',
                    }}
                  >
                    {c.status === 'active' ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="h-8 px-3 rounded-lg text-[12px] font-semibold transition-all hover:bg-sp-elevated"
                    style={{ border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
                  >
                    Ver
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sp-t3 t-small">No se encontraron empresas</div>
        )}
      </Card>
    </div>
  )
}
