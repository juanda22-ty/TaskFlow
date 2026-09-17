<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { io } from 'socket.io-client' // <-- Importar Socket.IO
import { useRequestStore } from '../store/requestStore'
import BaseButton from '../components/Buttons/BaseButton.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/Status/StatusBadge.vue'
import { formatDate } from '../utils/formatDate'

const store = useRequestStore()

// Conexión al backend (ajusta el puerto si es diferente)
const socket = io('http://localhost:3000')

const recentRequests = computed(() => {
  return [...store.requests]
    .sort((a, b) => {
      const da = new Date(a.fechaCreacion || 0)
      const db = new Date(b.fechaCreacion || 0)
      return db - da
    })
    .slice(0, 5)
})

onMounted(() => {
  // 1. Carga inicial vía REST API
  store.fetchRequests()
  store.fetchStats()

  // 2. Escuchar creación de nuevas solicitudes
  socket.on('solicitud-encolada', (nuevaSolicitud) => {
    // Si tu store tiene un método para agregar, úsalo. 
    // Si no, volvemos a pedir la lista para mantener la sincronía.
    store.fetchRequests() 
    store.fetchStats()
  })

  // 3. Escuchar cambios de estado desde el Worker
  const actualizarSolicitud = (solicitudActualizada) => {
    // Lo ideal es mutar el estado en Pinia directamente:
    // const index = store.requests.findIndex(s => s._id === solicitudActualizada._id)
    // if (index !== -1) store.requests[index] = solicitudActualizada
    
    // O si prefieres mantenerlo simple y seguro:
    store.fetchRequests()
  }

  socket.on('solicitud-procesando', actualizarSolicitud)
  socket.on('solicitud-respondida', actualizarSolicitud)
  socket.on('solicitud-error', actualizarSolicitud)

  // 4. Escuchar actualización de estadísticas
  socket.on('monitor-actualizado', () => {
    store.fetchStats()
  })
})

// Es vital desconectar el socket al salir de la vista para evitar fugas de memoria
onUnmounted(() => {
  socket.disconnect()
})
</script>

<template>
  <section class="dashboard">
    <header class="dashboard__header">
      <div>
        <h2>Dashboard</h2>
        <p>Resumen general del estado de las solicitudes.</p>
      </div>
      <BaseButton to="/solicitudes/nueva" variant="primary">Nueva solicitud</BaseButton>
    </header>

    <div v-if="store.error" class="alert alert--error">{{ store.error }}</div>

    <div class="dashboard__stats">
      <StatCard label="Total" :value="store.counts.total" tone="default" />
      <StatCard label="Pendientes" :value="store.counts.PENDIENTE" tone="yellow" />
      <StatCard label="En cola" :value="store.counts['EN COLA']" tone="blue" />
      <StatCard label="Procesando" :value="store.counts.PROCESANDO" tone="purple" />
      <StatCard label="Respondidas" :value="store.counts.RESPONDIDA" tone="green" />
      <StatCard label="Error" :value="store.counts.ERROR" tone="red" />
    </div>

    <section class="dashboard__recent">
      <h3>Solicitudes recientes</h3>

      <p v-if="!recentRequests.length" class="dashboard__empty">
        No hay solicitudes registradas todavía.
      </p>

      <ul v-else class="recent-list">
        <li v-for="req in recentRequests" :key="req._id ?? req.id" class="recent-list__item">
          <div class="recent-list__info">
            <span class="recent-list__title">{{ req.titulo }}</span>
            <span class="recent-list__meta">
              {{ req.categoria }} · {{ formatDate(req.fechaCreacion) }}
            </span>
          </div>
          <StatusBadge :status="req.estado" />
          <RouterLink :to="`/solicitudes/${req._id ?? req.id}`" class="recent-list__link">
            Ver
          </RouterLink>
        </li>
      </ul>
    </section>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  p {
    color: $color-text-muted;
  }
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.dashboard__recent {
  h3 {
    margin-bottom: 1rem;
  }
}

.dashboard__empty {
  color: $color-text-muted;
}

.recent-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recent-list__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 0.9rem 1rem;
}

.recent-list__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.recent-list__title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-list__meta {
  color: $color-text-muted;
  font-size: 0.85rem;
}

.recent-list__link {
  color: $color-primary;
  font-weight: 500;
}

.alert--error {
  background: $status-red-bg;
  color: $status-red-text;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
</style>
