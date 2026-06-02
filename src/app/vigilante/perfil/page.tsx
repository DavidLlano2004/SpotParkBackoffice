import type { Metadata } from 'next'
import { VigilantePerfil } from '@features/vigilante/components/VigilantePerfil'

export const metadata: Metadata = { title: 'Mi perfil · Vigilante' }

export default function Page() {
  return <VigilantePerfil />
}
