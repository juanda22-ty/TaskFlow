<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineEmits(['toggle-menu'])

const route = useRoute()
const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Dashboard',
    requests: 'Solicitudes',
    'new-request': 'Nueva solicitud',
    'request-detail': 'Detalle de solicitud',
    monitor: 'Monitor del sistema'
  }

  return titles[route.name] || 'TaskFlow'
})
</script>

<template>
  <header class="navbar">
    <div class="navbar__left">
      <button
        class="navbar__menu-btn"
        aria-label="Abrir menú"
        @click="$emit('toggle-menu')"
      >
        <span aria-hidden="true">☰</span>
      </button>
      <div class="navbar__heading">
        <span class="navbar__eyebrow">ESPACIO DE TRABAJO</span>
        <span class="navbar__title">{{ pageTitle }}</span>
      </div>
    </div>

    <div class="navbar__user">
      <span class="navbar__user-copy">
        <span class="navbar__username">Usuario</span>
        <span class="navbar__user-role">Administrador</span>
      </span>
      <span class="navbar__avatar" aria-hidden="true">U</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.5rem;
  padding: 0.75rem clamp(1rem, 3vw, 2.5rem);
  background: rgba($color-surface, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid $color-border;
}

.navbar__left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar__menu-btn {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: $color-primary-soft;
  color: $color-primary;
  border: 1px solid #e0e7ff;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
}

.navbar__heading {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.navbar__eyebrow {
  color: $color-text-muted;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.11em;
}

.navbar__title {
  color: #172033;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.navbar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: $color-text-muted;
}

.navbar__user-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.25;
}

.navbar__username {
  color: $color-text-strong;
  font-size: 0.82rem;
  font-weight: 650;
}

.navbar__user-role {
  margin-top: 0.15rem;
  font-size: 0.7rem;
}

.navbar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 999px;
  background: linear-gradient(145deg, #818cf8, $color-primary-dark);
  color: $color-primary-contrast;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 3px 8px rgba(79, 70, 229, 0.2);
}

@media (min-width: 768px) {
  .navbar__menu-btn {
    display: none;
  }
}
</style>
