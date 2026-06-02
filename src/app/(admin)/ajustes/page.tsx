import type { Metadata } from 'next'
import { AjustesClient } from '@features/ajustes/components/AjustesClient'

export const metadata: Metadata = { title: 'Ajustes' }

export default function AjustesPage() {
  return <AjustesClient />
}
