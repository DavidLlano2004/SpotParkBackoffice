import { VigilanteSidebar } from '@features/vigilante/components/VigilanteSidebar'
import { AuthGuard } from '@components/AuthGuard'

export default function VigilanteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--sp-bg)' }}>
        <VigilanteSidebar />
        <main className="flex-1 overflow-auto p-6 no-sb">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
