'use client'

import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@utils/cn'

interface AIInsightCardProps {
  message:   string
  className?: string
  delay?:    number
}

export function AIInsightCard({ message, className, delay = 0.4 }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-4',
        'border-l-[3px]',
        className,
      )}
      style={{
        background:   'var(--sp-lime-bg)',
        borderColor:  'var(--sp-lime-tint)',
        borderLeftColor: 'var(--sp-lime)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={15} style={{ color: 'var(--sp-lime-deep)' }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--sp-lime-deep)' }}>
          SpotPark AI
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--sp-t2)' }}>
        {message}
      </p>
    </motion.div>
  )
}
