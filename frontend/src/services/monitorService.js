import api from '../plugins/axios'

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
    const { data } = await api.get('/monitor')
    const servicios = data?.servicios ?? data?.services ?? {}

    return {
      express: normalizeStatus(servicios.express),
      mongo: normalizeStatus(servicios.mongodb ?? servicios.mongo),
      redis: normalizeStatus(servicios.redis),
      worker: normalizeStatus(servicios.worker)
    }
  }
}
