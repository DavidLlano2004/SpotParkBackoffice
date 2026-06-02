import type { AdminRole } from '@types-sp/api.types'

export const ROLE_LABELS: Record<AdminRole, string> = {
  super:   'Super Admin',
  parking: 'Administrador',
}

export const ROUTE_PERMISSIONS: Record<string, AdminRole[]> = {
  '/':                    ['super', 'parking'],
  '/parqueaderos':        ['super', 'parking'],
  '/parqueaderos/nuevo':  ['super', 'parking'],
  '/trabajadores':        ['super', 'parking'],
  '/trabajadores/nuevo':  ['super', 'parking'],
  '/usuarios':            ['super', 'parking'],
  '/reportes':            ['super', 'parking'],
  '/tarifas':             ['super', 'parking'],
  '/incidentes':          ['super', 'parking'],
  '/empresas':            ['super'],
  '/ajustes':             ['super', 'parking'],
}
