import { Sidebar } from '@components/layout/Sidebar'
import { TopBar }  from '@components/layout/TopBar'
import { AuthGuard } from '@components/AuthGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--sp-bg)' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto p-6 no-sb">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
