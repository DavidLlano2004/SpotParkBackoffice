import type { Metadata } from 'next'
import { TarifasClient } from '@features/tarifas/components/TarifasClient'

export const metadata: Metadata = { title: 'Tarifas' }

export default function TarifasPage() {
  return <TarifasClient />
}
