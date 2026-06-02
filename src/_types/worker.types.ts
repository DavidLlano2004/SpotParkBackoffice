export type WorkerRole   = 'Vigilante' | 'Supervisor' | 'Administrador'
export type WorkerStatus = 'active' | 'inactive' | 'shift' | 'suspended'

export interface Worker {
  id:        string
  name:      string
  init:      string
  role:      WorkerRole
  cc:        string
  phone:     string
  email:     string
  parkings:  string[]
  status:    WorkerStatus
  last:      string
  shifts:    number
  entries:   number
  incidents: number
}

export interface ShiftSlot {
  workerId:   string
  workerName: string
  workerInit: string
  parkingId:  string
  parkingName: string
  day:        number
  hour:       number
  type:       'morning' | 'afternoon' | 'night' | 'custom'
}

export interface CreateWorkerDto {
  name:     string
  cc:       string
  email:    string
  phone:    string
  role:     WorkerRole
  parkings: string[]
  status:   WorkerStatus
  password: string
  sendCredentials: boolean
}
