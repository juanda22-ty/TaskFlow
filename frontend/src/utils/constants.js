export const CATEGORIES = ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización']

// Valores canónicos de prioridad acordados con el backend: "Baja", "Media", "Alta".
export const PRIORITIES = ['Baja', 'Media', 'Alta']

export function normalizePriority(value) {
  if (!value) return value

  const v = String(value)
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
}

export const STATUSES = ['PENDIENTE', 'EN COLA', 'PROCESANDO', 'RESPONDIDA', 'ERROR']

export const STATUS_COLORS = {
  PENDIENTE: 'yellow',
  'EN COLA': 'blue',
  PROCESANDO: 'purple',
  RESPONDIDA: 'green',
  ERROR: 'red'
}
