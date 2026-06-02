import type { Metadata } from 'next'
import { VigilanteDashboard } from '@features/vigilante/components/VigilanteDashboard'

export const metadata: Metadata = { title: 'Dashboard · Vigilante' }

export default function Page() {
  return <VigilanteDashboard />
}
