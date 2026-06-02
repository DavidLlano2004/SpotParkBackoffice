import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--sp-bg)' }}>
      <div
        className="w-20 h-20 rounded-[24px] flex items-center justify-center text-[40px] font-bold"
        style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border-card)', boxShadow: 'var(--sp-sh-card)', fontFamily: 'var(--sp-display)', color: 'var(--sp-ink)' }}
      >
        P
      </div>
      <div className="text-center">
        <h1 className="text-[64px] font-black leading-none" style={{ fontFamily: 'var(--sp-display)', color: 'var(--sp-lime)' }}>404</h1>
        <p className="text-[18px] font-semibold mt-1">Página no encontrada</p>
        <p className="t-small text-sp-t2 mt-1">El recurso que buscas no existe o fue movido.</p>
      </div>
      <Link
        href="/"
        className="h-10 px-5 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center"
        style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
