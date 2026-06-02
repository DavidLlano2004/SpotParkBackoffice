import type {
  GuardProfile, GuardZone, VehicleRecord, SuspiciousAlert,
  ChatChannel, GuardIncident, ShiftHistory, WeekHeatmapRow,
} from '@types-sp/vigilante.types'

export const GUARD: GuardProfile = {
  id: 'g-001',
  name: 'Carlos Torres',
  initials: 'CT',
  email: 'carlos@spotpark.co',
  phone: '+57 314 567 8901',
  role: 'Vigilante',
  shift: '6:00 AM – 2:00 PM',
  parking: 'Parqueadero Universidad de Caldas',
  zones: ['A', 'B', 'M', 'V'],
  shiftStart: '06:00',
  shiftEnd: '14:00',
}

export const ZONES: GuardZone[] = [
  {
    id: 'A', label: 'Zona A', vehicleType: 'car', rows: 3, cols: 8,
    cells: [
      ['occupied', 'occupied', 'reserved', 'free', 'free', 'occupied', 'free', 'free'],
      ['occupied', 'free', 'free', 'occupied', 'reserved', 'free', 'occupied', 'disabled'],
      ['free', 'occupied', 'occupied', 'free', 'free', 'occupied', 'free', 'occupied'],
    ],
  },
  {
    id: 'B', label: 'Zona B', vehicleType: 'car', rows: 3, cols: 8,
    cells: [
      ['occupied', 'reserved', 'free', 'occupied', 'occupied', 'free', 'reserved', 'free'],
      ['free', 'occupied', 'occupied', 'free', 'occupied', 'occupied', 'free', 'free'],
      ['occupied', 'free', 'reserved', 'occupied', 'free', 'free', 'occupied', 'disabled'],
    ],
  },
  {
    id: 'M', label: 'Zona M', vehicleType: 'moto', rows: 3, cols: 10,
    cells: [
      ['occupied', 'occupied', 'free', 'free', 'occupied', 'reserved', 'free', 'occupied', 'free', 'free'],
      ['free', 'occupied', 'occupied', 'occupied', 'free', 'free', 'occupied', 'free', 'reserved', 'occupied'],
      ['occupied', 'free', 'free', 'occupied', 'occupied', 'free', 'free', 'occupied', 'free', 'disabled'],
    ],
  },
  {
    id: 'V', label: 'Zona V', vehicleType: 'bike', rows: 2, cols: 10,
    cells: [
      ['occupied', 'free', 'occupied', 'free', 'free', 'occupied', 'reserved', 'free', 'occupied', 'free'],
      ['free', 'occupied', 'free', 'occupied', 'occupied', 'free', 'free', 'reserved', 'free', 'disabled'],
    ],
  },
]

export const VEHICLE_RECORDS: VehicleRecord[] = [
  { id: 'r-001', plate: 'ABC-123', vehicleType: 'car', zone: 'A', space: 'A-01', inTime: '06:15', durMin: 185, active: true, amount: 9200, payMethod: 'app', guardIn: 'CT' },
  { id: 'r-002', plate: 'XYZ-789', vehicleType: 'car', zone: 'A', space: 'A-02', inTime: '06:22', durMin: 178, active: true, amount: 8900, payMethod: 'cash', guardIn: 'CT' },
  { id: 'r-003', plate: 'MNO-456', vehicleType: 'moto', zone: 'M', space: 'M-03', inTime: '06:30', outTime: '08:45', durMin: 135, active: false, amount: 4500, payMethod: 'card', guardIn: 'CT', guardOut: 'CT' },
  { id: 'r-004', plate: 'DEF-321', vehicleType: 'car', zone: 'B', space: 'B-05', inTime: '07:00', outTime: '09:30', durMin: 150, active: false, amount: 7500, payMethod: 'qr', guardIn: 'CT', guardOut: 'CT' },
  { id: 'r-005', plate: 'GHI-654', vehicleType: 'bike', zone: 'V', space: 'V-02', inTime: '07:10', durMin: 160, active: true, amount: 3200, payMethod: 'cash', guardIn: 'CT' },
  { id: 'r-006', plate: 'JKL-987', vehicleType: 'car', zone: 'A', space: 'A-06', inTime: '07:25', outTime: '11:00', durMin: 215, active: false, amount: 10700, payMethod: 'app', guardIn: 'CT', guardOut: 'CT' },
  { id: 'r-007', plate: 'PQR-147', vehicleType: 'moto', zone: 'M', space: 'M-07', inTime: '07:40', durMin: 148, active: true, amount: 4900, payMethod: 'cash', guardIn: 'CT' },
  { id: 'r-008', plate: 'STU-258', vehicleType: 'car', zone: 'B', space: 'B-03', inTime: '07:55', outTime: '10:15', durMin: 140, active: false, amount: 7000, payMethod: 'card', guardIn: 'CT', guardOut: 'CT' },
  { id: 'r-009', plate: 'VWX-369', vehicleType: 'car', zone: 'A', space: 'A-04', inTime: '08:10', durMin: 130, active: true, amount: 6500, payMethod: 'qr', guardIn: 'CT' },
  { id: 'r-010', plate: 'YZA-741', vehicleType: 'bike', zone: 'V', space: 'V-05', inTime: '08:20', outTime: '09:50', durMin: 90, active: false, amount: 1800, payMethod: 'cash', guardIn: 'CT', guardOut: 'CT' },
  { id: 'r-011', plate: 'BCD-852', vehicleType: 'car', zone: 'B', space: 'B-01', inTime: '08:35', durMin: 115, active: true, amount: 5750, payMethod: 'app', guardIn: 'CT' },
  { id: 'r-012', plate: 'EFG-963', vehicleType: 'moto', zone: 'M', space: 'M-11', inTime: '08:50', outTime: '10:30', durMin: 100, active: false, amount: 3300, payMethod: 'cash', guardIn: 'CT', guardOut: 'CT' },
]

export const ALERTS: SuspiciousAlert[] = [
  { id: 'a-001', plate: 'ZZZ-999', zone: 'A', space: 'A-07', type: 'long_stay', message: 'Vehículo lleva más de 8 horas sin salida registrada', since: '05:30' },
  { id: 'a-002', plate: 'WWW-111', zone: 'B', space: 'B-08', type: 'orphan_entry', message: 'Entrada registrada sin salida anterior del mismo espacio', since: '07:45' },
  { id: 'a-003', plate: 'QQQ-555', zone: 'M', space: 'M-12', type: 'late_reservation', message: 'Reserva expirada hace 45 minutos sin llegada', since: '08:00' },
]

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const seedHour = (h: number, dayIdx: number): number => {
  const base = h >= 7 && h <= 19 ? 45 : 8
  const peak = (h >= 8 && h <= 10) || (h >= 12 && h <= 14) ? 30 : 0
  const weekend = dayIdx >= 5 ? -18 : 0
  const noise = ((h * 7 + dayIdx * 13) % 25) - 12
  return Math.min(100, Math.max(0, base + peak + weekend + noise))
}

export const HEATMAP: WeekHeatmapRow[] = DAYS.map((day, di) => ({
  day,
  hours: Array.from({ length: 24 }, (_, h) => seedHour(h, di)),
}))

export const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'ch-001', name: 'general', type: 'channel', unread: 2,
    messages: [
      { id: 'm-001', author: 'Admin', initials: 'NS', content: 'Buenos días equipo. Recordar protocolo de seguridad ampliado hoy.', time: '05:58', isMine: false },
      { id: 'm-002', author: 'Carlos Torres', initials: 'CT', content: 'Buenos días, entendido.', time: '06:02', isMine: true },
      { id: 'm-003', author: 'Pedro López', initials: 'PL', content: 'Zona B tiene un vehículo sospechoso, ya lo reporté al sistema.', time: '07:30', isMine: false },
      { id: 'm-004', author: 'Carlos Torres', initials: 'CT', content: 'Copiado, estoy pendiente.', time: '07:32', isMine: true },
      { id: 'm-005', author: 'Admin', initials: 'NS', content: 'Hoy viene auditoría a las 10am, tener todo en orden.', time: '08:15', isMine: false },
    ],
  },
  {
    id: 'ch-002', name: 'entrega-turno', type: 'channel', unread: 0,
    messages: [
      { id: 'm-006', author: 'Juan Pérez', initials: 'JP', content: 'Turno nocturno sin novedades. Espacio A-07 con vehículo desde ayer.', time: '05:55', isMine: false },
      { id: 'm-007', author: 'Carlos Torres', initials: 'CT', content: 'Recibido, voy a revisarlo en apertura.', time: '06:00', isMine: true },
    ],
  },
  {
    id: 'dm-001', name: 'Natalia Soto', type: 'dm', unread: 1,
    messages: [
      { id: 'm-008', author: 'Natalia Soto', initials: 'NS', content: 'Carlos, hoy viene auditoría a las 10am. ¿Todo en orden?', time: '08:15', isMine: false },
      { id: 'm-009', author: 'Carlos Torres', initials: 'CT', content: 'Sí, lo tengo todo controlado.', time: '08:17', isMine: true },
      { id: 'm-010', author: 'Natalia Soto', initials: 'NS', content: 'Perfecto, gracias Carlos.', time: '08:18', isMine: false },
    ],
  },
  {
    id: 'dm-002', name: 'Pedro López', type: 'dm', unread: 0,
    messages: [
      { id: 'm-011', author: 'Pedro López', initials: 'PL', content: '¿Puedes revisitar zona B cuando tengas momento?', time: '07:55', isMine: false },
      { id: 'm-012', author: 'Carlos Torres', initials: 'CT', content: 'Ya voy.', time: '07:58', isMine: true },
    ],
  },
]

export const GUARD_INCIDENTS: GuardIncident[] = [
  { id: 'gi-001', type: 'Vehículo sospechoso', plate: 'ZZZ-999', zone: 'A', space: 'A-07', description: 'Vehículo lleva más de 8 horas sin salida. Placa no coincide con reservas activas. Se solicitó revisión.', time: '07:20', status: 'open', priority: 'high' },
  { id: 'gi-002', type: 'Daño en infraestructura', zone: 'B', description: 'Sensor del espacio B-12 no responde. Posible daño físico al dispositivo. Requiere mantenimiento.', time: '08:05', status: 'in_review', priority: 'medium' },
  { id: 'gi-003', type: 'Conflicto con usuario', plate: 'DEF-321', zone: 'A', space: 'A-03', description: 'Usuario argumenta haber pagado pero el sistema no registra salida. Se verificó manualmente y se liberó el espacio.', time: '09:30', status: 'resolved', priority: 'low' },
]

export const SHIFT_HISTORY: ShiftHistory[] = [
  { id: 'sh-001', date: '2026-06-02', shift: 'morning', start: '06:00', end: '14:00', entries: 47, exits: 39, revenue: 285000, incidents: 2 },
  { id: 'sh-002', date: '2026-06-01', shift: 'morning', start: '06:00', end: '14:00', entries: 52, exits: 50, revenue: 318000, incidents: 0 },
  { id: 'sh-003', date: '2026-05-31', shift: 'morning', start: '06:00', end: '14:00', entries: 38, exits: 38, revenue: 224000, incidents: 1 },
  { id: 'sh-004', date: '2026-05-30', shift: 'morning', start: '06:00', end: '14:00', entries: 61, exits: 59, revenue: 372000, incidents: 3 },
  { id: 'sh-005', date: '2026-05-29', shift: 'morning', start: '06:00', end: '14:00', entries: 44, exits: 44, revenue: 267000, incidents: 1 },
]
