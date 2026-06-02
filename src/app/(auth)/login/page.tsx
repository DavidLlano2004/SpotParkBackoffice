'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuthStore } from '@stores/useAuthStore'
import type { Metadata } from 'next'

const schema = z.object({
  email:    z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router   = useRouter()
  const setUser  = useAuthStore((s) => s.setUser)
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'natalia@spotpark.co', password: '••••••••' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 800))
    if (data.email === 'natalia@spotpark.co') {
      setUser(
        { id: 'admin-1', name: 'Natalia Soto', init: 'NS', email: data.email, phone: '312 990 4456', role: 'super', parkings: [] },
        'mock-token-xxx',
      )
      toast.success('Bienvenida, Natalia')
      router.push('/')
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div
      className="h-screen grid"
      style={{ gridTemplateColumns: '1.05fr 1fr', background: 'var(--sp-bg)' }}
    >
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center justify-center p-12 overflow-hidden"
        style={{ background: 'var(--sp-ink)' }}
      >
        <div className="absolute -top-16 -right-12 w-64 h-64 rounded-full" style={{ background: 'rgba(198,242,78,.10)' }} />
        <div className="absolute -bottom-14 -left-10 w-48 h-48 rounded-full" style={{ background: 'rgba(198,242,78,.06)' }} />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-[18px] flex items-center justify-center mb-4"
            style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
          >
            <span className="text-[34px] font-bold leading-none" style={{ color: 'var(--sp-ink)', fontFamily: 'var(--sp-display)' }}>P</span>
          </div>
          <h1 className="t-h1 text-white">SpotPark</h1>
          <p className="t-small mt-1" style={{ color: 'var(--sp-lime)' }}>Panel Administrativo</p>

          {/* Illustration */}
          <svg width="340" height="220" viewBox="0 0 340 220" className="mt-8">
            <rect width="340" height="220" rx="16" fill="#15171F" />
            {/* Metric cards */}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={20 + i * 104} y="20" width="92" height="58" rx="8" fill="#1C1F28" />
                <rect x={30 + i * 104} y="32" width="40" height="6" rx="3" fill="#283042" />
                <rect x={30 + i * 104} y="48" width={[60, 46, 54][i]} height="12" rx="3"
                  fill={['#C6F24E', '#3DA35D', '#3B82F6'][i]} />
              </g>
            ))}
            {/* Revenue chart line */}
            <polyline
              points="20,170 60,150 100,158 140,128 180,138 220,108 260,118 300,90 320,96"
              fill="none" stroke="#C6F24E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <line x1="20" y1="190" x2="320" y2="190" stroke="#283042" strokeWidth="1.5" />
          </svg>

          <p className="t-small text-center max-w-[280px] mt-6" style={{ color: 'rgba(255,255,255,.5)' }}>
            Gestiona todos tus parqueaderos desde un solo lugar.
          </p>
        </div>
      </motion.div>

      {/* Right panel */}
      <div className="flex flex-col justify-center p-12">
        <div className="max-w-[368px] mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="t-h1"
          >
            Bienvenida, Natalia
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="t-body mt-1.5 mb-8"
            style={{ color: 'var(--sp-t2)' }}
          >
            Ingresa a tu panel administrativo.
          </motion.p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl p-3 mb-4 text-sm"
              style={{ background: 'var(--sp-red-bg)', border: '1px solid var(--sp-red)', color: 'var(--sp-red-tx)' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="t-micro upper block mb-1.5" style={{ color: 'var(--sp-t3)' }}>Correo</label>
              <div
                className="flex items-center gap-2 h-11 px-3 rounded-xl"
                style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-sh-card)' }}
              >
                <Mail size={17} className="text-sp-t3 shrink-0" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="tu@spotpark.co"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: 'var(--sp-t1)' }}
                />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--sp-red)' }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="t-micro upper block mb-1.5" style={{ color: 'var(--sp-t3)' }}>Contraseña</label>
              <div
                className="flex items-center gap-2 h-11 px-3 rounded-xl"
                style={{ background: 'var(--sp-surface)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-sh-card)' }}
              >
                <Lock size={17} className="text-sp-t3 shrink-0" />
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: 'var(--sp-t1)' }}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="text-sp-t3 hover:text-sp-t2 transition-colors">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--sp-red)' }}>{errors.password.message}</p>}
              <div className="text-right mt-1.5">
                <button type="button" className="text-xs font-semibold" style={{ background: 'none', border: 'none', color: 'var(--sp-lime-deep)', cursor: 'pointer' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              type="submit"
              disabled={loading}
              className="h-14 rounded-[18px] text-[15px] font-semibold mt-2 transition-all active:scale-[0.97] disabled:opacity-60"
              style={{ background: 'var(--sp-lime)', color: 'var(--sp-ink)', boxShadow: 'var(--sp-sh-lime)', fontFamily: 'var(--sp-font)' }}
            >
              {loading ? 'Ingresando…' : 'Ingresar al panel'}
            </motion.button>
          </form>

          <p className="t-micro text-center mt-6" style={{ color: 'var(--sp-t4)' }}>
            SpotPark Admin · v2.4 · Manizales, Colombia
          </p>
        </div>
      </div>
    </div>
  )
}
