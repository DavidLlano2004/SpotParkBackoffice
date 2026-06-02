import type { Metadata } from 'next'
import { TrabajadoresClient } from '@features/trabajadores/components/TrabajadoresClient'

export const metadata: Metadata = { title: 'Trabajadores' }

export default function TrabajadoresPage() {
  return <TrabajadoresClient />
}
