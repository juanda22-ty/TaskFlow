<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import StatusBadge from '../components/Status/StatusBadge.vue'
import ResponsePanel from '../components/ResponsePanel.vue'
import { useSocket } from '../composables/useSocket'
import { useRequests } from '../composables/useRequests'
import { formatDate } from '../utils/formatDate'
import { normalizePriority } from '../utils/constants'

const route = useRoute()

const { detail } = useRequests()
const request = detail.data
const loading = detail.loading
const errorMessage = detail.error

async function loadRequest() {
  request.value = null

  try {
    await detail.execute(route.params.id)
  } catch (err) {
    if (err?.response?.status === 404) {
      errorMessage.value = 'La solicitud no existe'
    }
  }
}

function onStatusUpdate(payload) {
  const id = payload?._id ?? payload?.id ?? payload?.solicitudId
  if (!id || id === route.params.id) {
    loadRequest()
  }
}

const waitingMessage = computed(() => {
  switch (request.value?.estado) {
    case 'PENDIENTE':
      return 'La solicitud está pendiente y aún no ha sido enviada a la cola.'
    case 'EN COLA':
      return 'La solicitud está en cola, esperando ser procesada por el Worker.'
    case 'PROCESANDO':
      return 'La solicitud se está procesando en este momento.'
    default:
      return ''
  }
})

useSocket({
  'solicitud-procesando': onStatusUpdate,
  'solicitud-respondida': onStatusUpdate,
  'solicitud-error': onStatusUpdate
})

watch(() => route.params.id, loadRequest)
onMounted(loadRequest)
</script>

<template>
  <section class="detail">
    <nav class="detail__back">
      <RouterLink to="/solicitudes">← Volver al listado</RouterLink>
    </nav>

    <p v-if="loading" class="detail__state">Cargando solicitud...</p>

    <div v-else-if="errorMessage" class="alert alert--error">{{ errorMessage }}</div>

    <template v-else-if="request">
      <header class="detail__header">
        <div>
          <h2>Solicitud #{{ request._id ?? request.id }}</h2>
          <p class="detail__created">
            Creada el {{ formatDate(request.fechaCreacion) }}
          </p>
        </div>
        <StatusBadge :status="request.estado" />
      </header>

      <div class="card">
        <div class="card__grid">
          <div class="card__item">
            <span class="card__label">Título</span>
            <span class="card__value">{{ request.titulo }}</span>
          </div>
          <div class="card__item">
            <span class="card__label">Categoría</span>
            <span class="card__value">{{ request.categoria }}</span>
          </div>
          <div class="card__item">
            <span class="card__label">Prioridad</span>
            <span class="card__value">{{ normalizePriority(request.prioridad) }}</span>
          </div>
          <div class="card__item">
            <span class="card__label">Procesada</span>
            <span class="card__value">
              {{ formatDate(request.fechaProcesamiento) }}
            </span>
          </div>
        </div>

        <div class="card__item">
          <span class="card__label">Descripción</span>
          <p class="card__value">{{ request.descripcion }}</p>
        </div>
      </div>

      <ResponsePanel v-if="request.respuesta" :respuesta="request.respuesta" />

      <div v-else-if="request.estado === 'ERROR'" class="alert alert--error">
        <strong>Error al procesar la solicitud.</strong>
        <p>{{ request.mensajeError || 'No fue posible procesar esta solicitud.' }}</p>
      </div>

      <div v-else class="card card--waiting">
        <h3>Estado</h3>
        <p>{{ waitingMessage }}</p>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
}

.detail__back {
  a {
    color: $color-primary;
    font-weight: 500;
  }
}

.detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.detail__created {
  color: $color-text-muted;
  margin-top: 0.25rem;
}

.detail__state {
  color: $color-text-muted;
}

.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.card__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card__label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: $color-text-muted;
}

.card__value {
  font-weight: 500;
}

.card--waiting {
  border-left: 4px solid $tone-blue;

  h3 {
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    color: $tone-blue;
  }
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.alert--error {
  background: $status-red-bg;
  color: $status-red-text;

  p {
    margin-top: 0.25rem;
  }
}
</style>
