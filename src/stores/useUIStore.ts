import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  globalSearch:     string
  notifCount:       number

  toggleSidebar:   () => void
  setGlobalSearch: (q: string) => void
  setNotifCount:   (n: number) => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  globalSearch:     '',
  notifCount:       3,

  toggleSidebar:   ()  => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setGlobalSearch: (q) => set({ globalSearch: q }),
  setNotifCount:   (n) => set({ notifCount: n }),
}))
