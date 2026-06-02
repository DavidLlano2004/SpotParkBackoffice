export const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  Bronze:   { bg: '#FEF3C7', color: '#A06A3C' },
  Silver:   { bg: '#F1F5F9', color: '#8A9099' },
  Gold:     { bg: '#FEF9C3', color: '#C9A227' },
  Platinum: { bg: '#F0FFF4', color: '#0F1115' },
}

export const WORKER_ROLE_COLORS: Record<string, string> = {
  Vigilante:       'var(--sp-blue-tx)',
  Supervisor:      'var(--sp-lime-deep)',
  Administrador:   '#D97706',
}

export const STATUS_COLORS = {
  active:      { bg: 'var(--sp-green-bg)',  text: 'var(--sp-green-tx)',  border: 'var(--sp-green)'  },
  inactive:    { bg: 'var(--sp-elevated)',  text: 'var(--sp-t3)',        border: 'var(--sp-border)' },
  shift:       { bg: 'var(--sp-green-bg)',  text: 'var(--sp-green-tx)',  border: 'var(--sp-green)'  },
  suspended:   { bg: 'var(--sp-red-bg)',    text: 'var(--sp-red-tx)',    border: 'var(--sp-red)'    },
  maintenance: { bg: 'var(--sp-yellow-bg)', text: 'var(--sp-yellow-tx)', border: 'var(--sp-yellow)' },
} as const

export const INCIDENT_PRIORITY_COLORS = {
  alta:  { bg: 'var(--sp-red-bg)',    text: 'var(--sp-red-tx)',    border: 'var(--sp-red)'    },
  media: { bg: 'var(--sp-yellow-bg)', text: 'var(--sp-yellow-tx)', border: 'var(--sp-orange)' },
  baja:  { bg: 'var(--sp-blue-bg)',   text: 'var(--sp-blue-tx)',   border: 'var(--sp-blue)'   },
} as const

export const ACTIVITY_META = {
  entry:       { color: 'var(--sp-blue-tx)',    bg: 'var(--sp-blue-bg)'    },
  exit:        { color: 'var(--sp-green-tx)',   bg: 'var(--sp-green-bg)'   },
  reservation: { color: 'var(--sp-lime-deep)',  bg: 'var(--sp-lime-bg)'    },
  incident:    { color: 'var(--sp-orange)',     bg: 'var(--sp-yellow-bg)'  },
  worker:      { color: 'var(--sp-blue-tx)',    bg: 'var(--sp-blue-bg)'    },
} as const
