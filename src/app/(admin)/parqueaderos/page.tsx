import type { Metadata } from 'next'
import { ParqueaderosClient } from '@features/parqueaderos/components/ParqueaderosClient'

export const metadata: Metadata = { title: 'Parqueaderos' }

export default function ParqueaderosPage() {
  return <ParqueaderosClient />
}
