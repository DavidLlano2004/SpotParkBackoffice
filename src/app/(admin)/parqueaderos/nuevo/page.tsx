import type { Metadata } from 'next'
import { NuevoParkingClient } from '@features/parqueaderos/components/NuevoParkingClient'

export const metadata: Metadata = { title: 'Crear parqueadero' }

export default function NuevoParkingPage() {
  return <NuevoParkingClient />
}
