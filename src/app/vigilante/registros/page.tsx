import type { Metadata } from 'next'
import { VigilanteRegistros } from '@features/vigilante/components/VigilanteRegistros'

export const metadata: Metadata = { title: 'Registros · Vigilante' }

export default function Page() {
  return <VigilanteRegistros />
}
