import api from '../plugins/axios'

/**
 * Contrato acordado con el backend para el monitor:
 *
 * GET /api/status
 *
 * Respuesta esperada:
 * {
 *   "data": {
 *     "services": {
 *       "express": true,
 *       "mongo": true,
 *       "redis": true,
 *       "worker": true
 *     }
 *   }
 * }
 *
 * Cada servicio acepta:
 *  - boolean (true/false)
 *  - string ("up", "ok", "online", "disponible", "connected" -> true)
 *  - objeto con una propiedad { status | estado | available | ok }
 *
 * El método getStatus() devuelve un objeto normalizado:
 * { express, mongo, redis, worker } con valores true, false o null.
 */

function normalizeStatus(value) {
  if (value == null) return null
  if (typeof value === 'boolean') return value

  if (typeof value === 'object') {
    value = value.status ?? value.estado ?? value.available ?? value.ok
    if (value == null) return null
  }

  const v = String(value).toLowerCase()
  if (['up', 'ok', 'online', 'disponible', 'connected', 'true', '1'].includes(v)) {
    return true
  }
  if (['down', 'offline', 'no disponible', 'error', 'disconnected', 'false', '0'].includes(v)) {
    return false
  }
  return null
}

export default {
  async getStatus() {
    const { data } = await api.get('/status')
    const info = data?.data ?? data
    const services = info?.services ?? info

    return {
      express: normalizeStatus(services.express),
      mongo: normalizeStatus(services.mongo),
      redis: normalizeStatus(services.redis),
      worker: normalizeStatus(services.worker)
    }
  }
}
