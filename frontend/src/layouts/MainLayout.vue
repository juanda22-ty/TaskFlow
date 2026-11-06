<script setup>
import { ref } from 'vue'
import { useRequestStore } from '../store/requestStore'
import { useSocket } from '../composables/useSocket'
import Navbar from '../components/Navbar.vue'
import ToastNotifications from '../components/ToastNotifications.vue'

const store = useRequestStore()
const menuOpen = ref(false)

const refresh = () => {
  store.fetchRequests()
  store.fetchStats()
}

useSocket({
  'solicitud-creada': refresh,
  'solicitud-encolada': refresh,
  'solicitud-procesando': refresh,
  'solicitud-respondida': refresh,
  'solicitud-error': refresh,
  'cola-actualizada': refresh,
  'monitor-actualizado': refresh
})

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div class="layout" :class="{ 'layout--open': menuOpen }">
    <div class="layout__overlay" @click="closeMenu"></div>

    <aside class="layout__sidebar">
      <RouterLink class="layout__brand" to="/dashboard" @click="closeMenu">
        <span class="layout__brand-mark" aria-hidden="true">T</span>
        <span>
          <strong>TaskFlow</strong>
          <small>Gestión de solicitudes</small>
        </span>
      </RouterLink>

      <p class="layout__nav-label">MENÚ PRINCIPAL</p>
      <nav class="layout__nav">
        <RouterLink to="/dashboard" @click="closeMenu">
          <span class="layout__nav-icon" aria-hidden="true">▦</span>
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/solicitudes" @click="closeMenu">
          <span class="layout__nav-icon" aria-hidden="true">≡</span>
          <span>Solicitudes</span>
        </RouterLink>
        <RouterLink to="/solicitudes/nueva" @click="closeMenu">
          <span class="layout__nav-icon" aria-hidden="true">＋</span>
          <span>Nueva solicitud</span>
        </RouterLink>
        <RouterLink to="/monitor" @click="closeMenu">
          <span class="layout__nav-icon" aria-hidden="true">◉</span>
          <span>Monitor</span>
        </RouterLink>
      </nav>

      <div class="layout__sidebar-footer">
        <span class="layout__sidebar-dot" aria-hidden="true"></span>
        <span>Panel de operaciones</span>
      </div>
    </aside>

    <div class="layout__main">
      <Navbar @toggle-menu="menuOpen = true" />
      <main class="layout__content">
        <RouterView />
      </main>
    </div>
    <ToastNotifications />
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.layout {
  min-height: 100vh;
}

.layout__sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  background:
    radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.2), transparent 55%),
    $color-sidebar;
  color: $color-primary-contrast;
  padding: 1.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  z-index: 30;
}

.layout__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
  margin-bottom: 2.25rem;

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 1.05rem;
    letter-spacing: -0.02em;
  }

  small {
    margin-top: 0.1rem;
    color: #a5abc5;
    font-size: 0.72rem;
  }
}

.layout__brand-mark {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  place-items: center;
  border-radius: 0.8rem;
  background: linear-gradient(145deg, #818cf8, #4f46e5);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
  font-weight: 800;
  font-size: 1.1rem;
}

.layout__nav-label {
  padding: 0 0.75rem;
  margin-bottom: 0.6rem;
  color: #8289a8;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.layout--open .layout__sidebar {
  transform: translateX(0);
}

.layout__overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 20;
}

.layout--open .layout__overlay {
  display: block;
}

.layout__nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-height: 2.8rem;
    padding: 0.65rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.75rem;
    color: #c4c9dc;
    font-size: 0.9rem;
    font-weight: 550;
    transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.07);
    }

    &.router-link-active {
      color: #ffffff;
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(165, 180, 252, 0.18);
    }
  }
}

.layout__nav-icon {
  width: 1.35rem;
  color: #a5b4fc;
  text-align: center;
  font-size: 1.15rem;
  line-height: 1;
}

.layout__sidebar-footer {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: auto;
  padding: 1rem 0.65rem 0.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #a5abc5;
  font-size: 0.76rem;
}

.layout__sidebar-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.12);
}

.layout__main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__content {
  flex: 1;
  padding: 1.25rem;
  width: 100%;
}

@media (min-width: 768px) {
  .layout {
    display: flex;
  }

  .layout__sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    transform: none;
    width: 252px;
    flex: 0 0 252px;
  }

  .layout__overlay {
    display: none;
  }

  .layout__main {
    flex: 1;
    min-width: 0;
  }

  .layout__content {
    padding: clamp(1.75rem, 3.5vw, 3rem);
    max-width: 1600px;
    margin: 0 auto;
  }
}

@media (max-width: 420px) {
  .layout__content {
    padding: 1rem;
  }
}
</style>
