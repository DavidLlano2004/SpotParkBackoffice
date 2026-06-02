import type { Metadata } from 'next'
import { EmpresasClient } from '@features/empresas/components/EmpresasClient'

export const metadata: Metadata = { title: 'Empresas' }

export default function EmpresasPage() {
  return <EmpresasClient />
}
