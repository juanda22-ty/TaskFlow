import { useFetch } from './useFetch'
import requestService from '../services/requestService'

export function useRequests() {
  const detail = useFetch(
    async (id) => {
      const { data } = await requestService.getRequestById(id)
      return data?.data ?? data
    },
    { errorMessage: 'No se pudo cargar la solicitud' }
  )

  const create = useFetch((payload) => requestService.createRequest(payload), {
    errorMessage: 'No se pudo registrar la solicitud'
  })

  return { detail, create }
}
