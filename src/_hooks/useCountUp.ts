'use client'

import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 600): number {
  const [value, setValue]   = useState(0)
  const frameRef            = useRef<number>(0)
  const startTimeRef        = useRef<number | null>(null)
  const startValueRef       = useRef(0)

  useEffect(() => {
    startValueRef.current = 0
    startTimeRef.current  = null
    cancelAnimationFrame(frameRef.current)

    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(startValueRef.current + (target - startValueRef.current) * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return value
}
