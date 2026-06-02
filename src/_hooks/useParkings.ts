import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@constants/queryKeys'
import { MOCK_PARKINGS } from '@features/parqueaderos/data/mock'
import type { Parking } from '@types-sp/parking.types'

export function useParkings() {
  return useQuery({
    queryKey: QUERY_KEYS.parkings,
    queryFn:  async (): Promise<Parking[]> => {
      await new Promise((r) => setTimeout(r, 400))
      return MOCK_PARKINGS
    },
  })
}

export function useParking(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.parking(id),
    queryFn:  async (): Promise<Parking | undefined> => {
      await new Promise((r) => setTimeout(r, 300))
      return MOCK_PARKINGS.find((p) => p.id === id)
    },
    enabled: !!id,
  })
}

export function useToggleParkingStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await new Promise((r) => setTimeout(r, 600))
      return { id, status }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.parkings })
    },
  })
}
