'use client'

import { useAuthStore } from '@stores/useAuthStore'
import { canAccess, isSuperAdmin } from '@utils/rolePermissions'
import type { AdminRole } from '@types-sp/api.types'

export function useRoleGuard() {
  const role = useAuthStore((s) => s.role)

  return {
    role,
    isSuperAdmin: isSuperAdmin(role),
    canAccess: (key: Parameters<typeof canAccess>[0]) => canAccess(key, role),
    isAllowed: (requiredRoles: AdminRole[]) => requiredRoles.includes(role),
  }
}
