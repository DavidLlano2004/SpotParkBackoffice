import { cn } from '@utils/cn'
import type { ParkingStatus, WorkerStatus } from '@types-sp/index'
import type { IncidentStatus } from '@types-sp/api.types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'available' | 'few' | 'occupied' | 'reserved' | 'info' | 'neutral' | 'purple'
  dot?:     boolean
  className?: string
}

const VARIANT_STYLES: Record<NonNullable<BadgeProps['variant']>, string> = {
  available: 'bg-sp-green-bg text-sp-green-tx border-sp-green',
  few:       'bg-sp-yellow-bg text-sp-yellow-tx border-sp-yellow',
  occupied:  'bg-sp-red-bg text-sp-red-tx border-sp-red',
  reserved:  'bg-sp-blue-bg text-sp-blue-tx border-sp-blue',
  info:      'bg-sp-lime-bg text-sp-lime-deep border-sp-lime-tint',
  neutral:   'bg-sp-elevated text-sp-t2 border-transparent',
  purple:    'bg-purple-100 text-purple-700 border-purple-300',
}

export function Badge({ children, variant = 'neutral', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold border',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      )}
      {children}
    </span>
  )
}

export function ParkingStatusBadge({ status }: { status: ParkingStatus }) {
  const map: Record<ParkingStatus, { variant: BadgeProps['variant']; label: string }> = {
    active:      { variant: 'available', label: 'Activo' },
    inactive:    { variant: 'neutral',   label: 'Inactivo' },
    maintenance: { variant: 'few',       label: 'Mantenimiento' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

export function WorkerStatusBadge({ status }: { status: WorkerStatus }) {
  const map: Record<WorkerStatus, { variant: BadgeProps['variant']; label: string }> = {
    active:    { variant: 'available', label: 'Activo'     },
    shift:     { variant: 'available', label: 'En turno'   },
    inactive:  { variant: 'neutral',   label: 'Inactivo'   },
    suspended: { variant: 'occupied',  label: 'Suspendido' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const map: Record<IncidentStatus, { variant: BadgeProps['variant']; label: string }> = {
    open:     { variant: 'occupied',  label: 'Abierto'    },
    review:   { variant: 'few',       label: 'En revisión' },
    resolved: { variant: 'available', label: 'Resuelto'   },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}
