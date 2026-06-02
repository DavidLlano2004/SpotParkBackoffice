export interface RevenuePoint {
  label: string
  value: number
}

export interface VehicleSplit {
  label: string
  value: number
  color: string
}

export interface HourPoint {
  hour:  number
  value: number
}

export interface ReportTotals {
  rev:           number
  reservas:      number
  cap:           number
  occ:           number
  active:        number
  workersActive: number
  onShift:       number
  openIncidents: number
}
