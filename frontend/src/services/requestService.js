import api from '../plugins/axios'

export default {
  getRequests(params) {
    return api.get('/solicitudes', { params })
  },

  getStats() {
    return api.get('/estadisticas')
  },

  getRequestById(id) {
    return api.get(`/solicitudes/${id}`)
  },

  createRequest(payload) {
    return api.post('/solicitudes', payload)
  },

  updateRequest(id, payload) {
    return api.put(`/solicitudes/${id}`, payload)
  },

  deleteRequest(id) {
    return api.delete(`/solicitudes/${id}`)
  }
}
