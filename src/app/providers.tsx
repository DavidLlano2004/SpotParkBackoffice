'use client'

import { HeroUIProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--sp-surface)',
              border: '1px solid var(--sp-border-card)',
              color: 'var(--sp-t1)',
              fontFamily: 'var(--sp-font)',
              fontSize: '13px',
            },
          }}
        />
      </HeroUIProvider>
    </QueryClientProvider>
  )
}
