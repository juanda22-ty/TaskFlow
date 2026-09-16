<script setup>
import { ref } from 'vue'
import { useRequestStore } from '../store/requestStore'
import { useSocket } from '../composables/useSocket'
import Navbar from '../components/Navbar.vue'

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
      <nav class="layout__nav">
        <RouterLink to="/dashboard" @click="closeMenu">Dashboard</RouterLink>
        <RouterLink to="/solicitudes" @click="closeMenu">Solicitudes</RouterLink>
        <RouterLink to="/solicitudes/nueva" @click="closeMenu">Nueva solicitud</RouterLink>
        <RouterLink to="/monitor" @click="closeMenu">Monitor</RouterLink>
      </nav>
    </aside>

    <div class="layout__main">
      <Navbar @toggle-menu="menuOpen = true" />
      <main class="layout__content">
        <RouterView />
      </main>
    </div>
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
  background: $color-sidebar;
  color: $color-primary-contrast;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  z-index: 30;
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
  gap: 0.75rem;

  a {
    padding: 0.5rem 0.75rem;
    border-radius: 6px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.router-link-active {
      background: $color-primary;
    }
  }
}

.layout__main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__content {
  flex: 1;
  padding: 1rem;
  width: 100%;
}

@media (min-width: 768px) {
  .layout {
    display: flex;
  }

  .layout__sidebar {
    position: static;
    transform: none;
    width: 220px;
  }

  .layout__overlay {
    display: none;
  }

  .layout__main {
    flex: 1;
    min-width: 0;
  }

  .layout__content {
    padding: 2rem;
  }
}
</style>
