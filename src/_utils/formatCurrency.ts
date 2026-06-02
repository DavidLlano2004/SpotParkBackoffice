export function formatCOP(value: number): string {
  return '$' + Math.round(value).toLocaleString('es-CO')
}

export function formatCOPk(value: number): string {
  if (value >= 1_000_000) {
    const m = (value / 1_000_000).toFixed(1).replace('.0', '')
    return `$${m}M`
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`
  }
  return `$${value}`
}

export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}
