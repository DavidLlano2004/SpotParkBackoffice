import type { Metadata } from 'next'
import { WorkerDetailClient } from '@features/trabajadores/components/WorkerDetailClient'

export const metadata: Metadata = { title: 'Trabajador' }

export default async function WorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <WorkerDetailClient id={id} />
}
