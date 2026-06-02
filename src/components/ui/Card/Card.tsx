import { cn } from '@utils/cn'

interface CardProps {
  children:  React.ReactNode
  className?: string
  style?:     React.CSSProperties
  padding?:   'none' | 'sm' | 'md' | 'lg'
  onClick?:   () => void
}

const PAD_CLASSES = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-5',
}

export function Card({ children, className, style, padding = 'md', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-sp-surface rounded-[18px]',
        PAD_CLASSES[padding],
        onClick && 'cursor-pointer transition-shadow hover:shadow-md',
        className,
      )}
      style={{
        boxShadow: 'var(--sp-sh-card)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title:     string
  right?:    React.ReactNode
  className?: string
}

export function CardHeader({ title, right, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center gap-2 mb-4', className)}>
      <span className="t-h3 text-[15px]">{title}</span>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  )
}
