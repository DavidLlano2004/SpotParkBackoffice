import type { Metadata } from 'next'
import { IncidentesClient } from '@features/incidentes/components/IncidentesClient'

export const metadata: Metadata = { title: 'Incidentes' }

export default function IncidentesPage() {
  return <IncidentesClient />
}
