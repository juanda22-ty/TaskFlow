import { ref } from 'vue'

const notifications = ref([])
let nextId = 0

function notify(message, type = 'info', duration = 5000) {
  const notification = {
    id: ++nextId,
    message,
    type,
    timer: null
  }

  notifications.value.push(notification)
  notification.timer = setTimeout(() => dismiss(notification.id), duration)
}

function dismiss(id) {
  const notification = notifications.value.find((item) => item.id === id)
  if (notification?.timer) clearTimeout(notification.timer)
  notifications.value = notifications.value.filter((item) => item.id !== id)
}

export function useNotifications() {
  return {
    notifications,
    success: (message, duration) => notify(message, 'success', duration),
    error: (message, duration) => notify(message, 'error', duration),
    info: (message, duration) => notify(message, 'info', duration),
    dismiss
  }
}
