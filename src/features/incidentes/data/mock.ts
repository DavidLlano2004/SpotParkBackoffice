import type { Incident } from '@types-sp/api.types'

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2025-001', type: 'damage', tl: 'Daño en vehículo',
    parking: 'U. de Caldas', space: 'B2', plate: 'LMN733',
    by: 'App · Julián M.', when: 'Hoy 11:20 AM',
    prio: 'alta', status: 'review', assigned: 'Carlos Torres', ai: 'CT',
    desc: 'El usuario reporta un rayón en la puerta del conductor que no estaba al ingresar. Solicita revisión de cámaras.',
  },
  {
    id: 'INC-2025-002', type: 'billing', tl: 'Cobro incorrecto',
    parking: 'U. de Caldas', space: 'A7', plate: 'ZXC123',
    by: 'App · Laura M.', when: 'Hoy 9:05 AM',
    prio: 'media', status: 'open', assigned: null, ai: null,
    desc: 'Cobro de 4h cuando la estadía fue de 2h 30min. Revisar registro de entrada/salida.',
  },
  {
    id: 'INC-2025-003', type: 'space', tl: 'Demarcación',
    parking: 'C.C. Fundadores', space: 'M4', plate: 'KLM880',
    by: 'Vigilante', when: 'Ayer 6:40 PM',
    prio: 'baja', status: 'resolved', assigned: 'Sofía Mora', ai: 'SM',
    desc: 'Demarcación del espacio M4 borrosa, vehículos se parquean encima de la línea.',
  },
  {
    id: 'INC-2025-004', type: 'service', tl: 'Demora barrera',
    parking: 'Terminal', space: 'M19', plate: 'PQR318',
    by: 'App · Diego R.', when: 'Ayer 2:10 PM',
    prio: 'media', status: 'open', assigned: null, ai: null,
    desc: 'Usuario indica demora de 10 min en la apertura de la barrera de salida.',
  },
  {
    id: 'INC-2025-005', type: 'damage', tl: 'Daño en vehículo',
    parking: 'Hosp. Santa Sofía', space: 'A3', plate: 'GHT559',
    by: 'App · Mateo G.', when: 'Hace 2 días',
    prio: 'alta', status: 'review', assigned: 'Laura Mejía', ai: 'LM',
    desc: 'Espejo retrovisor doblado. Usuario solicita compensación.',
  },
  {
    id: 'INC-2025-006', type: 'billing', tl: 'Reembolso',
    parking: 'Cable Plaza', space: 'A11', plate: 'FGH210',
    by: 'App · Camila O.', when: 'Hace 3 días',
    prio: 'baja', status: 'resolved', assigned: 'Tatiana Cruz', ai: 'TC',
    desc: 'Doble cobro por error de la pasarela de pago. Se aplicó reembolso.',
  },
]
