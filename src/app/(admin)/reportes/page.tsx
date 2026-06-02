import type { Metadata } from 'next'
import { ReportesClient } from '@features/reportes/components/ReportesClient'

export const metadata: Metadata = { title: 'Reportes' }

export default function ReportesPage() {
  return <ReportesClient />
}
