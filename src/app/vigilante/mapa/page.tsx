import type { Metadata } from 'next'
import { VigilanteMapa } from '@features/vigilante/components/VigilanteMapa'

export const metadata: Metadata = { title: 'Mapa de espacios · Vigilante' }

export default function Page() {
  return <VigilanteMapa />
}
