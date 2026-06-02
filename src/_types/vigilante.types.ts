import type { VehicleType, SpaceStatus } from './parking.types'

export type PayMethod = 'cash' | 'card' | 'qr' | 'app'
export type ShiftType = 'morning' | 'afternoon' | 'night'
export type AlertType = 'long_stay' | 'orphan_entry' | 'late_reservation'
export type IncidentStatus = 'open' | 'in_review' | 'resolved'
export type IncidentPriority = 'low' | 'medium' | 'high'

export interface GuardProfile {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  role: string
  shift: string
  parking: string
  zones: string[]
  shiftStart: string
  shiftEnd: string
}

export interface GuardZone {
  id: string
  label: string
  vehicleType: VehicleType
  rows: number
  cols: number
  cells: SpaceStatus[][]
}

export interface VehicleRecord {
  id: string
  plate: string
  vehicleType: VehicleType
  zone: string
  space: string
  inTime: string
  outTime?: string
  durMin: number
  active: boolean
  amount: number
  payMethod: PayMethod
  guardIn: string
  guardOut?: string
}

export interface SuspiciousAlert {
  id: string
  plate: string
  zone: string
  space: string
  type: AlertType
  message: string
  since: string
}

export interface ChatMessage {
  id: string
  author: string
  initials: string
  content: string
  time: string
  isMine: boolean
}

export interface ChatChannel {
  id: string
  name: string
  type: 'channel' | 'dm'
  unread: number
  messages: ChatMessage[]
}

export interface GuardIncident {
  id: string
  type: string
  plate?: string
  zone: string
  space?: string
  description: string
  time: string
  status: IncidentStatus
  priority: IncidentPriority
}

export interface ShiftHistory {
  id: string
  date: string
  shift: ShiftType
  start: string
  end: string
  entries: number
  exits: number
  revenue: number
  incidents: number
}

export interface WeekHeatmapRow {
  day: string
  hours: number[]
}
