import type { AppUser } from '@types-sp/user.types'

export const MOCK_USERS: AppUser[] = [
  { id: 'u1',  name: 'Julián Martínez',       init: 'JM', email: 'julianm@gmail.com',     tier: 'Gold',     reservas: 48, last: 'Hoy 8:14 AM',     spent: 1_240_000, status: 'active',    plates: ['ZXC123'] },
  { id: 'u2',  name: 'Laura Mendoza',         init: 'LM', email: 'laura.m@outlook.com',   tier: 'Platinum', reservas: 96, last: 'Hoy 7:50 AM',     spent: 3_180_000, status: 'active',    plates: ['KLM880', 'ABC123'] },
  { id: 'u3',  name: 'Diego Ramírez',         init: 'DR', email: 'dramirez@gmail.com',    tier: 'Silver',   reservas: 22, last: 'Ayer 6:30 PM',    spent: 540_000,   status: 'active',    plates: ['PQR318'] },
  { id: 'u4',  name: 'Camila Ospina',         init: 'CO', email: 'camila.o@gmail.com',    tier: 'Gold',     reservas: 51, last: 'Hoy 9:02 AM',     spent: 1_390_000, status: 'active',    plates: ['FGH210'] },
  { id: 'u5',  name: 'Andrés Felipe Cárdenas',init: 'AC', email: 'afcardenas@hotmail.com',tier: 'Bronze',   reservas: 7,  last: 'Hace 3 días',     spent: 120_000,   status: 'active',    plates: ['JKL905'] },
  { id: 'u6',  name: 'Valentina Ríos',        init: 'VR', email: 'vale.rios@gmail.com',   tier: 'Silver',   reservas: 18, last: 'Hoy 10:11 AM',    spent: 470_000,   status: 'active',    plates: ['MNO442'] },
  { id: 'u7',  name: 'Santiago López',        init: 'SL', email: 'slopez@gmail.com',      tier: 'Bronze',   reservas: 3,  last: 'Hace 9 días',     spent: 38_000,    status: 'suspended', plates: ['TRS667'] },
  { id: 'u8',  name: 'Daniela Quintero',      init: 'DQ', email: 'dquintero@gmail.com',   tier: 'Gold',     reservas: 44, last: 'Ayer 4:20 PM',    spent: 1_080_000, status: 'active',    plates: ['BNX771'] },
  { id: 'u9',  name: 'Mateo Giraldo',         init: 'MG', email: 'mateog@gmail.com',      tier: 'Platinum', reservas: 88, last: 'Hoy 6:40 AM',     spent: 2_760_000, status: 'active',    plates: ['GHT559', 'WQE128'] },
  { id: 'u10', name: 'Isabela Cano',          init: 'IC', email: 'isa.cano@gmail.com',    tier: 'Bronze',   reservas: 0,  last: 'Hace 21 días',    spent: 0,         status: 'inactive',  plates: [] },
]
