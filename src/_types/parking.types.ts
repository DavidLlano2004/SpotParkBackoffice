export type ParkingStatus = 'active' | 'inactive' | 'maintenance'
export type SpaceStatus   = 'free' | 'occupied' | 'reserved' | 'disabled' | 'maintenance'
export type VehicleType   = 'car' | 'moto' | 'bike' | 'suv'

export interface ParkingService {
  id: string
  label: string
}

export interface ParkingCapacitySplit {
  car:  number
  moto: number
  bike: number
}

export interface Parking {
  id:        string
  name:      string
  short:     string
  city:      string
  addr:      string
  status:    ParkingStatus
  cap:       number
  free:      number
  used:      number
  occ:       number
  schedule:  string
  score:     number
  rev:       number
  reservas:  number
  incidents: number
  coords:    string
  dynamic:   boolean
  trend:     number[]
  services:  string[]
  split:     ParkingCapacitySplit
  workers:   string[]
}

export interface ParkingZone {
  id:     string
  name:   string
  type:   VehicleType | 'mixed'
  spaces: ParkingSpace[]
}

export interface ParkingSpace {
  id:        string
  label:     string
  status:    SpaceStatus
  type:      VehicleType
  plate?:    string
  entryTime?: string
  reservedUntil?: string
}

export interface Tarifa {
  hour:    number
  day:     number
  min:     string
  grace:   string
  dynamic: boolean
  peak?:   number
  valley?: number
}

export interface ParkingTarifas {
  car:  Tarifa
  moto: Tarifa
  bike: Tarifa
  suv:  Tarifa
}

export interface CreateParkingDto {
  name:        string
  phone:       string
  email:       string
  description: string
  status:      ParkingStatus
  addr:        string
  city:        string
  coords?:     { lat: number; lng: number }
  schedule:    string
  services:    string[]
  tarifas:     ParkingTarifas
}
