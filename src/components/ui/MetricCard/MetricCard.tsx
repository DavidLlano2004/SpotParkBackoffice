'use client'

import { useCountUp } from '@hooks/useCountUp'
import { Card } from '@components/ui/Card'
import { cn } from '@utils/cn'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  icon:       React.ReactNode
  iconBg?:    string
  label:      string
  value:      number | string
  prefix?:    string
  suffix?:    string
  sub?:       string
  subColor?:  string
  trend?:     string
  trendDir?:  'up' | 'down'
  ring?:      number
  warn?:      boolean
  delay?:     number
  className?: string
}

function OccupancyRing({ pct, size = 48, sw = 5 }: { pct: number; size?: number; sw?: number }) {
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const color = pct > 0.9 ? 'var(--sp-red)' : pct > 0.7 ? 'var(--sp-yellow)' : 'var(--sp-green)'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--sp-elevated)" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)' }}
      />
    </svg>
  )
}

export function MetricCard({
  icon, iconBg, label, value, prefix, suffix,
  sub, subColor, trend, trendDir, ring, warn, delay = 0, className,
}: MetricCardProps) {
  const numValue = typeof value === 'number' ? value : 0
  const animated = useCountUp(numValue)
  const displayed =
    typeof value === 'number'
      ? `${prefix ?? ''}${animated.toLocaleString('es-CO')}${suffix ?? ''}`
      : value

  return (
    <Card
      padding="none"
      className={cn('sp-rise-s p-4', warn && 'border border-sp-orange/30', className)}
      style={{ animationDelay: `${delay}s` } as React.CSSProperties}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
          style={{ background: iconBg ?? 'var(--sp-elevated)' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="t-micro upper text-sp-t3 text-[10px]">{label}</div>
          <div
            className="tnum font-bold text-[25px] leading-none mt-1 tracking-tight"
            style={{ fontFamily: 'var(--sp-display)' }}
          >
            {displayed}
          </div>
          {trend && (
            <div
              className={cn(
                'inline-flex items-center gap-1 mt-1.5 text-xs font-semibold',
                trendDir === 'down' ? 'text-sp-red' : 'text-sp-green-tx',
              )}
            >
              {trendDir === 'down'
                ? <TrendingDown size={13} />
                : <TrendingUp size={13} />}
              {trend}
            </div>
          )}
          {sub && (
            <div className="mt-1.5 text-xs font-medium" style={{ color: subColor ?? 'var(--sp-t3)' }}>
              {sub}
            </div>
          )}
        </div>
        {ring != null && <OccupancyRing pct={ring} />}
      </div>
    </Card>
  )
}
