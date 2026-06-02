export type UserTier   = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface AppUser {
  id:      string
  name:    string
  init:    string
  email:   string
  tier:    UserTier
  reservas: number
  last:    string
  spent:   number
  status:  UserStatus
  plates:  string[]
}

export interface Company {
  id:       string
  name:     string
  nit:      string
  contact:  string
  parkings: number
  employees: number
  billing:  number
  status:   'active' | 'inactive'
}
