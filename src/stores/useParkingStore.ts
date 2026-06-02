import { create } from 'zustand'
import type { Parking, ParkingSpace } from '@types-sp/parking.types'

interface ParkingState {
  selectedParking: Parking | null
  selectedSpace:   ParkingSpace | null
  activeTab:       string

  setSelectedParking: (p: Parking | null) => void
  setSelectedSpace:   (s: ParkingSpace | null) => void
  setActiveTab:       (tab: string) => void
}

export const useParkingStore = create<ParkingState>()((set) => ({
  selectedParking: null,
  selectedSpace:   null,
  activeTab:       'resumen',

  setSelectedParking: (p)   => set({ selectedParking: p, selectedSpace: null }),
  setSelectedSpace:   (s)   => set({ selectedSpace: s }),
  setActiveTab:       (tab) => set({ activeTab: tab }),
}))
