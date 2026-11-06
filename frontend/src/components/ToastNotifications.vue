<script setup>
import { useNotifications } from '../composables/useNotifications'

const { notifications, dismiss } = useNotifications()

const icons = {
  success: '✓',
  error: '!',
  info: 'i'
}
</script>

<template>
  <TransitionGroup
    v-if="notifications.length"
    name="toast"
    tag="div"
    class="toast-stack"
    aria-live="polite"
    aria-relevant="additions"
  >
    <article
      v-for="notification in notifications"
      :key="notification.id"
      class="toast"
      :class="`toast--${notification.type}`"
      :role="notification.type === 'error' ? 'alert' : 'status'"
    >
      <span class="toast__icon" aria-hidden="true">{{ icons[notification.type] }}</span>
      <p class="toast__message">{{ notification.message }}</p>
      <button
        class="toast__close"
        type="button"
        aria-label="Cerrar notificación"
        @click="dismiss(notification.id)"
      >
        ×
      </button>
    </article>
  </TransitionGroup>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.toast-stack {
  position: fixed;
  top: 5.25rem;
  right: 1.25rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: min(24rem, calc(100vw - 2rem));
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 0.85rem;
  border: 1px solid $color-border;
  border-left: 3px solid $color-primary;
  border-radius: 0.85rem;
  background: $color-surface;
  box-shadow: 0 14px 38px rgba(24, 34, 67, 0.16);
}

.toast--success {
  border-left-color: $color-success;

  .toast__icon {
    color: $status-green-text;
    background: $status-green-bg;
  }
}

.toast--error {
  border-left-color: $color-error;

  .toast__icon {
    color: $status-red-text;
    background: $status-red-bg;
  }
}

.toast--info .toast__icon {
  color: $color-primary-dark;
  background: $color-primary-soft;
}

.toast__icon {
  display: grid;
  flex: 0 0 1.8rem;
  width: 1.8rem;
  height: 1.8rem;
  place-items: center;
  border-radius: 50%;
  font-weight: 800;
}

.toast__message {
  flex: 1;
  color: $color-text-strong;
  font-size: 0.88rem;
  font-weight: 550;
}

.toast__close {
  display: grid;
  flex: 0 0 1.75rem;
  width: 1.75rem;
  height: 1.75rem;
  place-items: center;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: $color-text-muted;
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    background: $color-border-soft;
    color: $color-text;
  }
}

.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.toast-leave-active {
  position: absolute;
  right: 0;
  left: 0;
}

@media (max-width: 520px) {
  .toast-stack {
    top: auto;
    right: 1rem;
    bottom: 1rem;
  }
}
</style>
