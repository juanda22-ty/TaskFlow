import { onMounted, onUnmounted } from 'vue'
import { socket, connectSocket } from '../plugins/socket'

export function useSocket(eventHandlers = {}) {
  const entries = Object.entries(eventHandlers)

  onMounted(() => {
    connectSocket()

    for (const [event, handler] of entries) {
      socket.on(event, handler)
    }
  })

  onUnmounted(() => {
    for (const [event, handler] of entries) {
      socket.off(event, handler)
    }
  })

  return { socket }
}
