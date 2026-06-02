import type { Metadata } from 'next'
import { TurnosClient } from '@features/turnos/components/TurnosClient'

export const metadata: Metadata = { title: 'Turnos' }

export default function TurnosPage() {
  return <TurnosClient />
}
