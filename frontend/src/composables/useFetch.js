import { ref } from 'vue'

export function useFetch(requestFn, options = {}) {
  const data = ref(options.initialData ?? null)
  const loading = ref(false)
  const error = ref('')

  async function execute(...args) {
    loading.value = true
    error.value = ''

    try {
      data.value = await requestFn(...args)
      return data.value
    } catch (err) {
      error.value =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        options.errorMessage ||
        'Ocurrió un error'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
