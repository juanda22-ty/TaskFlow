<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useRequestStore } from '../store/requestStore'
import BaseButton from '../components/Buttons/BaseButton.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/Status/StatusBadge.vue'
import { formatDate } from '../utils/formatDate'

const store = useRequestStore()

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
  store.fetchRequests()
  store.fetchStats()
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
  gap: 1.75rem;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  p {
    color: $color-text-muted;
    margin-top: 0.4rem;
  }
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.dashboard__recent {
  padding: 1.35rem;
  border: 1px solid $color-border;
  border-radius: 1rem;
  background: $color-surface;
  box-shadow: 0 3px 12px rgba(24, 34, 67, 0.035);

  h3 {
    margin-bottom: 1.1rem;
    font-size: 1.05rem;
  }
}

.dashboard__empty {
  color: $color-text-muted;
  padding: 1.25rem 0;
  text-align: center;
}

.recent-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.recent-list__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fcfcfe;
  border: 1px solid $color-border;
  border-radius: 0.8rem;
  padding: 0.85rem 0.9rem;
  transition: border-color 0.16s ease, transform 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: $color-border-strong;
  }
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
  font-weight: 650;
  font-size: 0.88rem;

  &:hover {
    color: $color-primary-dark;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

.alert--error {
  background: $status-red-bg;
  color: $status-red-text;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
</style>
