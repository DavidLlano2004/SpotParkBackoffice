import type { Metadata } from 'next'
import { ParkingDetailClient } from '@features/parqueaderos/components/ParkingDetailClient'

export const metadata: Metadata = { title: 'Detalle Parqueadero' }

export default async function ParkingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ParkingDetailClient id={id} />
}
