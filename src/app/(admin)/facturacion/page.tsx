import type { Metadata } from 'next'
import { FacturacionClient } from '@features/facturacion/components/FacturacionClient'

export const metadata: Metadata = { title: 'Facturación' }

export default function FacturacionPage() {
  return <FacturacionClient />
}
