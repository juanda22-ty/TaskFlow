import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import requestService from '../services/requestService'

export const useRequestStore = defineStore('requests', () => {
  const requests = ref([])
  const stats = ref(null)
  const loading = ref(false)
  const error = ref('')

  const counts = computed(() => {
    if (stats.value) {
      return {
        total: stats.value.total ?? 0,
        PENDIENTE: stats.value.PENDIENTE ?? 0,
        'EN COLA': stats.value['EN COLA'] ?? 0,
        PROCESANDO: stats.value.PROCESANDO ?? 0,
        RESPONDIDA: stats.value.RESPONDIDA ?? 0,
        ERROR: stats.value.ERROR ?? 0
      }
    }

    const result = {
      total: requests.value.length,
      PENDIENTE: 0,
      'EN COLA': 0,
      PROCESANDO: 0,
      RESPONDIDA: 0,
      ERROR: 0
    }

    for (const req of requests.value) {
      if (req.estado in result) {
        result[req.estado] += 1
      }
    }

    return result
  })

  async function fetchRequests() {
    loading.value = true
    error.value = ''

    try {
      const { data } = await requestService.getRequests()
      requests.value = Array.isArray(data) ? data : data?.data ?? []
    } catch (err) {
      error.value =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'No se pudieron cargar las solicitudes'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const { data } = await requestService.getStats()
      stats.value = data?.data ?? data
    } catch {
      stats.value = null
    }
  }

  return { requests, stats, loading, error, counts, fetchRequests, fetchStats }
})
