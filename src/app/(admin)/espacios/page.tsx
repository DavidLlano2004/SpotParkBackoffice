import type { Metadata } from 'next'
import { EspaciosClient } from '@features/espacios/components/EspaciosClient'

export const metadata: Metadata = { title: 'Espacios' }

export default function EspaciosPage() {
  return <EspaciosClient />
}
