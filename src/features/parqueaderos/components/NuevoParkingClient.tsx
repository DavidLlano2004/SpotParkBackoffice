'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, MapPin, Clock, Shield, Zap, Wifi, Car, Bike, Settings, Users } from 'lucide-react'
import { Card } from '@components/ui/Card'
import { toast } from 'sonner'

const STEPS = ['Datos básicos', 'Ubicación', 'Servicios', 'Tarifas']

const step1Schema = z.object({
  name:        z.string().min(3, 'Mínimo 3 caracteres'),
  phone:       z.string().min(7, 'Teléfono inválido'),
  email:       z.string().email('Email inválido'),
  description: z.string().optional(),
  status:      z.enum(['active', 'inactive', 'maintenance']),
})

const step2Schema = z.object({
  addr:     z.string().min(5, 'Dirección requerida'),
  city:     z.string().min(2, 'Ciudad requerida'),
  schedule: z.string().min(3, 'Horario requerido'),
})

type Step1 = z.infer<typeof step1Schema>
type Step2 = z.infer<typeof step2Schema>

const SERVICES = [
  { id: 'vigilancia', label: 'Vigilancia 24/7', icon: <Shield size={16} /> },
  { id: 'cctv',       label: 'CCTV',            icon: <Shield size={16} /> },
  { id: 'techado',    label: 'Techado',          icon: <Car size={16} />    },
  { id: 'factura',    label: 'Factura electrónica', icon: <Settings size={16} /> },
  { id: 'accesible',  label: 'Accesible',        icon: <Users size={16} /> },
  { id: 'carga',      label: 'Carga eléctrica',  icon: <Zap size={16} />   },
  { id: 'wifi',       label: 'Wi-Fi',            icon: <Wifi size={16} />  },
  { id: 'lavado',     label: 'Lavado',           icon: <Car size={16} />   },
  { id: 'valet',      label: 'Valet',            icon: <Car size={16} />   },
  { id: 'baño',       label: 'Baño',             icon: <Bike size={16} />  },
]

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block t-micro uppercase text-sp-t3 text-[10px] mb-1">{children}</label>
}

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className="w-full h-10 px-3 rounded-xl text-[13px] outline-none transition-all"
        style={{
          background: 'var(--sp-elevated)',
          border: `1px solid ${error ? 'var(--sp-red)' : 'var(--sp-border)'}`,
          color: 'var(--sp-t1)',
        }}
      />
      {error && <p className="mt-1 text-[11px]" style={{ color: 'var(--sp-red)' }}>{error}</p>}
    </div>
  )
}

function Step1Form({ onNext }: { onNext: (v: Step1) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: { status: 'active' },
  })
  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FieldLabel>Nombre del parqueadero *</FieldLabel>
          <Input {...register('name')} placeholder="Ej: Parqueadero Central" error={errors.name?.message} />
        </div>
        <div>
          <FieldLabel>Teléfono *</FieldLabel>
          <Input {...register('phone')} placeholder="310 000 0000" type="tel" error={errors.phone?.message} />
        </div>
        <div>
          <FieldLabel>Email *</FieldLabel>
          <Input {...register('email')} placeholder="info@parqueadero.co" type="email" error={errors.email?.message} />
        </div>
        <div className="col-span-2">
          <FieldLabel>Descripción</FieldLabel>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Descripción breve del parqueadero..."
            className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none transition-all resize-none"
            style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
          />
        </div>
        <div className="col-span-2">
          <FieldLabel>Estado inicial *</FieldLabel>
          <div className="flex gap-2">
            {([['active', 'Activo'], ['inactive', 'Inactivo'], ['maintenance', 'Mantenimiento']] as const).map(([v, l]) => (
              <label key={v} className="flex-1">
                <input type="radio" value={v} {...register('status')} className="sr-only" />
                <div
                  className="h-9 rounded-xl flex items-center justify-center text-[13px] font-medium cursor-pointer transition-all border"
                  style={{ border: '1px solid var(--sp-border)', background: 'var(--sp-elevated)' }}
                >
                  {l}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="h-10 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center justify-center gap-2 mt-2"
        style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
      >
        Continuar <ArrowRight size={15} />
      </button>
    </form>
  )
}

function Step2Form({ onNext, onBack }: { onNext: (v: Step2) => void; onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: { schedule: 'Lun–Dom · 6:00 AM – 10:00 PM' },
  })
  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
      <div>
        <FieldLabel>Dirección *</FieldLabel>
        <Input {...register('addr')} placeholder="Calle 65 #26-10" error={errors.addr?.message}
          style={{ background: 'var(--sp-elevated)', border: `1px solid ${errors.addr ? 'var(--sp-red)' : 'var(--sp-border)'}` }}
        />
      </div>
      <div>
        <FieldLabel>Ciudad *</FieldLabel>
        <Input {...register('city')} placeholder="Manizales" error={errors.city?.message} />
      </div>
      <div>
        <FieldLabel>Horario *</FieldLabel>
        <Input {...register('schedule')} placeholder="Lun–Dom · 6:00 AM – 10:00 PM" error={errors.schedule?.message} />
      </div>
      <div
        className="p-3 rounded-xl flex items-center gap-2 t-small text-sp-t2"
        style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)' }}
      >
        <MapPin size={14} className="text-sp-t3 shrink-0" />
        <span>Integración con mapa disponible próximamente</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={onBack}
          className="h-10 px-4 rounded-xl text-[13px] font-medium flex items-center gap-2"
          style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
        >
          <ArrowLeft size={14} /> Atrás
        </button>
        <button type="submit"
          className="flex-1 h-10 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center justify-center gap-2"
          style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
        >
          Continuar <ArrowRight size={15} />
        </button>
      </div>
    </form>
  )
}

function Step3Form({ onNext, onBack }: { onNext: (services: string[]) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>(['vigilancia', 'cctv'])
  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {SERVICES.map(({ id, label, icon }) => {
          const active = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="h-12 px-3 rounded-xl flex items-center gap-2.5 text-[13px] font-medium transition-all"
              style={{
                background: active ? 'var(--sp-lime-bg)' : 'var(--sp-elevated)',
                border: `1px solid ${active ? 'var(--sp-lime-tint)' : 'var(--sp-border)'}`,
                color: active ? 'var(--sp-lime-deep)' : 'var(--sp-t2)',
              }}
            >
              {icon} {label}
              {active && <Check size={13} className="ml-auto" />}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={onBack}
          className="h-10 px-4 rounded-xl text-[13px] font-medium flex items-center gap-2"
          style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
        >
          <ArrowLeft size={14} /> Atrás
        </button>
        <button
          onClick={() => onNext(selected)}
          className="flex-1 h-10 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center justify-center gap-2"
          style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
        >
          Continuar <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

function Step4Form({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const vehicleTypes = [
    { k: 'car',  l: 'Carro',      defaultHour: 3500,  defaultDay: 35000 },
    { k: 'moto', l: 'Moto',       defaultHour: 2000,  defaultDay: 20000 },
    { k: 'bike', l: 'Bicicleta',  defaultHour: 1000,  defaultDay: 8000  },
    { k: 'suv',  l: 'SUV/Camión', defaultHour: 5000,  defaultDay: 50000 },
  ]
  return (
    <div className="flex flex-col gap-4">
      {vehicleTypes.map(({ k, l, defaultHour, defaultDay }) => (
        <div key={k} className="rounded-xl p-4" style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)' }}>
          <div className="font-semibold text-[14px] mb-3">{l}</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Tarifa/hora ($)</FieldLabel>
              <Input type="number" defaultValue={defaultHour} />
            </div>
            <div>
              <FieldLabel>Tarifa/día ($)</FieldLabel>
              <Input type="number" defaultValue={defaultDay} />
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={onBack}
          className="h-10 px-4 rounded-xl text-[13px] font-medium flex items-center gap-2"
          style={{ background: 'var(--sp-elevated)', border: '1px solid var(--sp-border)', color: 'var(--sp-t1)' }}
        >
          <ArrowLeft size={14} /> Atrás
        </button>
        <button onClick={onSubmit}
          className="flex-1 h-10 rounded-xl text-[13.5px] font-semibold text-sp-ink flex items-center justify-center gap-2"
          style={{ background: 'var(--sp-lime)', boxShadow: 'var(--sp-sh-lime)' }}
        >
          <Check size={15} /> Crear parqueadero
        </button>
      </div>
    </div>
  )
}

export function NuevoParkingClient() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const handleStep1 = (_v: Step1) => setStep(1)
  const handleStep2 = (_v: Step2) => setStep(2)
  const handleStep3 = (_services: string[]) => setStep(3)
  const handleSubmit = () => {
    toast.success('Parqueadero creado exitosamente')
    router.push('/parqueaderos')
  }

  return (
    <div className="max-w-[640px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => step === 0 ? router.back() : setStep((s) => s - 1)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-sp-elevated"
          style={{ border: '1px solid var(--sp-border)' }}
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="t-h1">Crear parqueadero</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-all"
              style={{
                background: i < step ? 'var(--sp-lime)' : i === step ? 'var(--sp-ink)' : 'var(--sp-elevated)',
                color: i <= step ? (i < step ? 'var(--sp-ink)' : '#fff') : 'var(--sp-t3)',
              }}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </div>
            <span className="text-[12px] font-medium truncate" style={{ color: i === step ? 'var(--sp-t1)' : 'var(--sp-t3)' }}>{s}</span>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px" style={{ background: i < step ? 'var(--sp-lime)' : 'var(--sp-separator)' }} />
            )}
          </div>
        ))}
      </div>

      <Card padding="lg">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
            {step === 0 && <Step1Form onNext={handleStep1} />}
            {step === 1 && <Step2Form onNext={handleStep2} onBack={() => setStep(0)} />}
            {step === 2 && <Step3Form onNext={handleStep3} onBack={() => setStep(1)} />}
            {step === 3 && <Step4Form onBack={() => setStep(2)} onSubmit={handleSubmit} />}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  )
}
