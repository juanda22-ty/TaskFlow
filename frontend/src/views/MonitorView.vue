<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRequestStore } from '../store/requestStore'
import BaseButton from '../components/Buttons/BaseButton.vue'
import StatCard from '../components/StatCard.vue'
import monitorService from '../services/monitorService'

const store = useRequestStore()

const SERVICE_LIST = [
  { key: 'express', label: 'Express' },
  { key: 'mongo', label: 'MongoDB' },
  { key: 'redis', label: 'Redis' },
  { key: 'worker', label: 'Worker' }
]

const statuses = ref({})
const errorMessage = ref('')
let intervalId = null

async function loadMonitor() {
  errorMessage.value = ''

  try {
    statuses.value = await monitorService.getStatus()
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.message || 'No se pudo obtener el estado del sistema'
  }
}

onMounted(() => {
  store.fetchRequests()
  store.fetchStats()
  loadMonitor()
  intervalId = setInterval(() => {
    loadMonitor()
    store.fetchRequests()
    store.fetchStats()
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <section class="monitor">
    <header class="monitor__header">
      <div>
        <h2>Monitor</h2>
        <p>Estado en tiempo real de los servicios y del procesamiento.</p>
      </div>
      <BaseButton variant="ghost" @click="loadMonitor">Actualizar</BaseButton>
    </header>

    <div v-if="errorMessage" class="alert alert--error">{{ errorMessage }}</div>

    <section class="monitor__services">
      <div v-for="s in SERVICE_LIST" :key="s.key" class="service-card">
        <span class="service-card__name">{{ s.label }}</span>
        <span
          v-if="statuses[s.key] === true"
          class="service-card__status service-card__status--up"
        >
          ✓ Disponible
        </span>
        <span
          v-else-if="statuses[s.key] === false"
          class="service-card__status service-card__status--down"
        >
          ✗ No disponible
        </span>
        <span v-else class="service-card__status service-card__status--unknown">
          Desconocido
        </span>
      </div>
    </section>

    <section>
      <h3>Procesamiento</h3>
      <div class="monitor__stats">
        <StatCard label="En cola" :value="store.counts['EN COLA']" tone="blue" />
        <StatCard label="Procesando" :value="store.counts.PROCESANDO" tone="purple" />
        <StatCard label="Respondidas" :value="store.counts.RESPONDIDA" tone="green" />
        <StatCard label="Errores" :value="store.counts.ERROR" tone="red" />
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.monitor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.monitor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  p {
    color: $color-text-muted;
  }
}

.monitor__services {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.service-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.service-card__name {
  font-weight: 600;
}

.service-card__status {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;

  &--up {
    color: $color-success;
  }
  &--down {
    color: $color-error;
  }
  &--unknown {
    color: $color-text-muted;
  }
}

.monitor__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.alert--error {
  background: $status-red-bg;
  color: $status-red-text;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
</style>
