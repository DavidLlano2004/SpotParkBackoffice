import type { Metadata } from 'next'
import { VigilanteIncidentes } from '@features/vigilante/components/VigilanteIncidentes'

export const metadata: Metadata = { title: 'Incidentes · Vigilante' }

export default function Page() {
  return <VigilanteIncidentes />
}
