export const QUERY_KEYS = {
  parkings:       ['parkings'] as const,
  parking:        (id: string) => ['parkings', id] as const,
  parkingStats:   (id: string) => ['parkings', id, 'stats'] as const,
  parkingSpaces:  (id: string) => ['parkings', id, 'spaces'] as const,

  workers:        ['workers'] as const,
  worker:         (id: string) => ['workers', id] as const,

  users:          ['users'] as const,
  user:           (id: string) => ['users', id] as const,

  reports:        ['reports'] as const,
  revenueChart:   (range: string) => ['reports', 'revenue', range] as const,
  occupancyChart: (range: string) => ['reports', 'occupancy', range] as const,

  tarifas:        (parkingId: string) => ['tarifas', parkingId] as const,

  incidents:      ['incidents'] as const,
  incident:       (id: string) => ['incidents', id] as const,

  companies:      ['companies'] as const,
  company:        (id: string) => ['companies', id] as const,

  aiInsight:      (parkingId: string) => ['ai', 'insight', parkingId] as const,
  aiScore:        (parkingId: string) => ['ai', 'score', parkingId] as const,
} as const
