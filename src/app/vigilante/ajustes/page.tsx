import type { Metadata } from 'next'
import { VigilanteAjustes } from '@features/vigilante/components/VigilanteAjustes'

export const metadata: Metadata = { title: 'Ajustes · Vigilante' }

export default function Page() {
  return <VigilanteAjustes />
}
