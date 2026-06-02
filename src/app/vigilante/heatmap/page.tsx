import type { Metadata } from 'next'
import { VigilanteHeatmap } from '@features/vigilante/components/VigilanteHeatmap'

export const metadata: Metadata = { title: 'Mapa de calor · Vigilante' }

export default function Page() {
  return <VigilanteHeatmap />
}
