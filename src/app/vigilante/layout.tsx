import { VigilanteSidebar } from '@features/vigilante/components/VigilanteSidebar'

export default function VigilanteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--sp-bg)' }}>
      <VigilanteSidebar />
      <main className="flex-1 overflow-auto p-6 no-sb">
        {children}
      </main>
    </div>
  )
}
