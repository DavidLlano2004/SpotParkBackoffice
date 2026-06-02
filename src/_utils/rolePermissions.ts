import type { AdminRole } from '@types-sp/api.types'

type PermissionKey =
  | 'dashboard'
  | 'parqueaderos'
  | 'parqueaderos.create'
  | 'trabajadores'
  | 'trabajadores.create'
  | 'usuarios'
  | 'reportes'
  | 'tarifas'
  | 'incidentes'
  | 'empresas'
  | 'ajustes'

const PERMISSIONS: Record<PermissionKey, AdminRole[]> = {
  'dashboard':           ['super', 'parking'],
  'parqueaderos':        ['super', 'parking'],
  'parqueaderos.create': ['super', 'parking'],
  'trabajadores':        ['super', 'parking'],
  'trabajadores.create': ['super', 'parking'],
  'usuarios':            ['super', 'parking'],
  'reportes':            ['super', 'parking'],
  'tarifas':             ['super', 'parking'],
  'incidentes':          ['super', 'parking'],
  'empresas':            ['super'],
  'ajustes':             ['super', 'parking'],
}

export function canAccess(key: PermissionKey, role: AdminRole): boolean {
  return PERMISSIONS[key]?.includes(role) ?? false
}

export function isSuperAdmin(role: AdminRole): boolean {
  return role === 'super'
}
