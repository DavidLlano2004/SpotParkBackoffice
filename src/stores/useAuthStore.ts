import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminRole, AuthUser } from '@types-sp/api.types'

interface AuthState {
  user:    AuthUser | null
  token:   string | null
  isAuth:  boolean
  role:    AdminRole

  setUser:  (user: AuthUser, token: string) => void
  setRole:  (role: AdminRole) => void
  logout:   () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:   null,
      token:  null,
      isAuth: false,
      role:   'parking',

      setUser: (user, token) =>
        set({ user, token, isAuth: true, role: user.role }),

      setRole: (role) =>
        set((state) => ({
          role,
          user: state.user ? { ...state.user, role } : null,
        })),

      logout: () =>
        set({ user: null, token: null, isAuth: false }),
    }),
    {
      name:    'sp-auth',
      partialize: (s) => ({ user: s.user, token: s.token, isAuth: s.isAuth, role: s.role }),
    },
  ),
)
