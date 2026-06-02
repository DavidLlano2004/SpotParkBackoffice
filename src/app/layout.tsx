import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: { template: '%s | SpotPark Admin', default: 'SpotPark Admin' },
  description: 'Panel administrativo de SpotPark — gestión de parqueaderos, trabajadores y reportes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--sp-bg)' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
