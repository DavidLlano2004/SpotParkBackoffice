import type { Parking } from '@types-sp/parking.types'

export const MOCK_PARKINGS: Parking[] = [
  {
    id: 'p1', name: 'Universidad de Caldas', short: 'U. de Caldas',
    city: 'Manizales', addr: 'Calle 65 #26-10', status: 'active',
    cap: 50, free: 14, used: 36, occ: 0.72,
    schedule: 'Lun–Dom · 5:00 AM – 11:00 PM',
    score: 84, rev: 8_900_000, reservas: 312, incidents: 1,
    coords: '5.0573° N, 75.4920° W', dynamic: true,
    trend: [42, 48, 51, 55, 53, 60, 58],
    services: ['vigilancia', 'cctv', 'techado', 'factura', 'accesible'],
    split: { car: 30, moto: 15, bike: 5 },
    workers: ['Carlos Torres', 'Andrea Ríos', 'Diego Parra'],
  },
  {
    id: 'p2', name: 'Centro Comercial Fundadores', short: 'C.C. Fundadores',
    city: 'Manizales', addr: 'Carrera 23 #33-45', status: 'active',
    cap: 80, free: 9, used: 71, occ: 0.89,
    schedule: '24 horas',
    score: 91, rev: 14_200_000, reservas: 540, incidents: 0,
    coords: '5.0689° N, 75.5174° W', dynamic: true,
    trend: [70, 72, 68, 74, 78, 80, 79],
    services: ['vigilancia', 'cctv', 'techado', 'carga', 'lavado', 'factura', 'wifi'],
    split: { car: 52, moto: 20, bike: 8 },
    workers: ['Sofía Mora', 'Julián Gómez', 'Mónica Vega', 'Andrés Ruiz'],
  },
  {
    id: 'p3', name: 'Hospital Santa Sofía', short: 'Hosp. Santa Sofía',
    city: 'Manizales', addr: 'Calle 16 #18-22', status: 'active',
    cap: 40, free: 3, used: 37, occ: 0.925,
    schedule: '24 horas',
    score: 76, rev: 6_100_000, reservas: 198, incidents: 2,
    coords: '5.0640° N, 75.5090° W', dynamic: false,
    trend: [55, 58, 60, 62, 65, 63, 66],
    services: ['vigilancia', 'cctv', 'accesible', 'factura'],
    split: { car: 28, moto: 10, bike: 2 },
    workers: ['Laura Mejía', 'Pedro Sáenz'],
  },
  {
    id: 'p4', name: 'Terminal de Transportes', short: 'Terminal',
    city: 'Manizales', addr: 'Calle 19 #15-05', status: 'active',
    cap: 100, free: 31, used: 69, occ: 0.69,
    schedule: '24 horas',
    score: 68, rev: 9_800_000, reservas: 421, incidents: 0,
    coords: '5.0560° N, 75.4990° W', dynamic: false,
    trend: [40, 44, 42, 48, 46, 50, 49],
    services: ['vigilancia', 'cctv', 'factura', 'baño'],
    split: { car: 60, moto: 30, bike: 10 },
    workers: ['Ricardo Loaiza', 'Marcela Ríos'],
  },
  {
    id: 'p5', name: 'Cable Plaza', short: 'Cable Plaza',
    city: 'Manizales', addr: 'Carrera 23 #65-11', status: 'active',
    cap: 50, free: 7, used: 43, occ: 0.86,
    schedule: 'Lun–Dom · 8:00 AM – 10:00 PM',
    score: 88, rev: 11_000_000, reservas: 380, incidents: 0,
    coords: '5.0670° N, 75.5120° W', dynamic: true,
    trend: [60, 64, 66, 70, 72, 75, 74],
    services: ['vigilancia', 'cctv', 'techado', 'carga', 'valet', 'wifi', 'factura'],
    split: { car: 34, moto: 12, bike: 4 },
    workers: ['Tatiana Cruz', 'Felipe Arango'],
  },
  {
    id: 'p6', name: 'Parqueadero La Estación', short: 'La Estación',
    city: 'Pereira', addr: 'Calle 17 #8-30', status: 'maintenance',
    cap: 30, free: 30, used: 0, occ: 0,
    schedule: 'Lun–Sáb · 6:00 AM – 9:00 PM',
    score: 54, rev: 0, reservas: 0, incidents: 0,
    coords: '4.8133° N, 75.6961° W', dynamic: false,
    trend: [20, 18, 12, 8, 6, 4, 0],
    services: ['vigilancia'],
    split: { car: 20, moto: 8, bike: 2 },
    workers: [],
  },
]

export const MOCK_ACTIVITY = [
  { id: 'a1', kind: 'entry' as const,       text: 'Entrada registrada · Carro ABC-123',         parking: 'U. de Caldas',    ago: 'hace 1 min'  },
  { id: 'a2', kind: 'reservation' as const, text: 'Nueva reserva desde la app',                 parking: 'C.C. Fundadores', ago: 'hace 3 min'  },
  { id: 'a3', kind: 'exit' as const,        text: 'Salida registrada · Moto PQR-318 · $1.500',  parking: 'Terminal',        ago: 'hace 6 min'  },
  { id: 'a4', kind: 'incident' as const,    text: 'Incidente reportado · daño en vehículo',     parking: 'Hosp. Santa Sofía', ago: 'hace 12 min' },
  { id: 'a5', kind: 'entry' as const,       text: 'Entrada registrada · Carro KLM-880',         parking: 'Cable Plaza',     ago: 'hace 14 min' },
  { id: 'a6', kind: 'worker' as const,      text: 'Tatiana Cruz inició turno',                  parking: 'Cable Plaza',     ago: 'hace 22 min' },
  { id: 'a7', kind: 'exit' as const,        text: 'Salida registrada · Carro XYZ-774 · $9.000', parking: 'C.C. Fundadores', ago: 'hace 25 min' },
  { id: 'a8', kind: 'reservation' as const, text: 'Nueva reserva desde la app',                 parking: 'U. de Caldas',    ago: 'hace 31 min' },
]

export const MOCK_REVENUE_SERIES = [
  { label: 'Dic', value: 3_800_000 },
  { label: 'Ene', value: 4_100_000 },
  { label: 'Feb', value: 4_400_000 },
  { label: 'Mar', value: 4_700_000 },
  { label: 'Abr', value: 4_600_000 },
  { label: 'May', value: 5_200_000 },
]

export const MOCK_VEHICLE_SPLIT = [
  { label: 'Carros',      value: 224, color: 'var(--sp-lime-deep)' },
  { label: 'Motos',       value: 97,  color: 'var(--sp-green)'     },
  { label: 'Bicicletas',  value: 31,  color: 'var(--sp-blue)'      },
]

export const MOCK_PEAK_HOURS = Array.from({ length: 24 }, (_, h) => {
  const rush = (h >= 7 && h <= 9) || (h >= 17 && h <= 19)
  const mid  = h >= 10 && h <= 16
  const base = h < 6 || h > 21 ? 4 : rush ? 38 : mid ? 22 : 14
  return { hour: h, value: Math.max(2, base + ((h * 7) % 9) - 4) }
})
