import type { Company } from '@types-sp/user.types'

export const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'Grupo Inmobiliario Caldas',  nit: '900.112.334-1', contact: 'maria.l@gic.co',    parkings: 3, employees: 12, billing: 34_000_000, status: 'active'   },
  { id: 'c2', name: 'CC Fundadores S.A.',         nit: '800.567.221-0', contact: 'admin@fundadores.co', parkings: 1, employees: 8,  billing: 14_200_000, status: 'active'   },
  { id: 'c3', name: 'Hospital Santa Sofía E.S.E.', nit: '890.001.111-7', contact: 'tf@hsscaldas.gov.co',parkings: 1, employees: 5,  billing: 6_100_000,  status: 'active'   },
  { id: 'c4', name: 'Terminal Manizales',          nit: '800.331.055-4', contact: 'ops@terminalman.co', parkings: 1, employees: 6,  billing: 9_800_000,  status: 'active'   },
  { id: 'c5', name: 'Inversiones Pereira Ltda.',   nit: '901.556.778-2', contact: 'contac@invper.co',   parkings: 0, employees: 2,  billing: 0,          status: 'inactive' },
]
