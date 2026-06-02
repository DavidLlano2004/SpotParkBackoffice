import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@constants/queryKeys'
import { MOCK_WORKERS } from '@features/trabajadores/data/mock'
import type { Worker } from '@types-sp/worker.types'

export function useWorkers() {
  return useQuery({
    queryKey: QUERY_KEYS.workers,
    queryFn:  async (): Promise<Worker[]> => {
      await new Promise((r) => setTimeout(r, 400))
      return MOCK_WORKERS
    },
  })
}

export function useWorker(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.worker(id),
    queryFn:  async (): Promise<Worker | undefined> => {
      await new Promise((r) => setTimeout(r, 300))
      return MOCK_WORKERS.find((w) => w.id === id)
    },
    enabled: !!id,
  })
}
