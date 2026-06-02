export interface ApiResponse<T> {
  data:    T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data:       T[]
  total:      number
  page:       number
  pageSize:   number
  totalPages: number
}

export type AdminRole = 'super' | 'parking'

export interface AuthUser {
  id:       string
  name:     string
  init:     string
  email:    string
  phone:    string
  role:     AdminRole
  parkings: string[]
}

export interface IncidentPriority { l: string; cls: string }

export type IncidentStatus = 'open' | 'review' | 'resolved'
export type IncidentType   = 'damage' | 'billing' | 'space' | 'service'

export interface Incident {
  id:       string
  type:     IncidentType
  tl:       string
  parking:  string
  space:    string
  plate:    string
  by:       string
  when:     string
  prio:     'alta' | 'media' | 'baja'
  status:   IncidentStatus
  assigned: string | null
  ai:       string | null
  desc:     string
}

export interface ActivityItem {
  id:      string
  kind:    'entry' | 'exit' | 'reservation' | 'incident' | 'worker'
  text:    string
  parking: string
  ago:     string
}
