import type { Metadata } from 'next'
import { VigilanteChat } from '@features/vigilante/components/VigilanteChat'

export const metadata: Metadata = { title: 'Chat · Vigilante' }

export default function Page() {
  return <VigilanteChat />
}
