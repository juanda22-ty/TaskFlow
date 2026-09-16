<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRequestStore } from '../store/requestStore'
import BaseButton from '../components/Buttons/BaseButton.vue'
import RequestTable from '../components/Tables/RequestTable.vue'
import { CATEGORIES, STATUSES } from '../utils/constants'

const store = useRequestStore()

const search = ref('')
const filterStatus = ref('')
const filterCategory = ref('')

const filteredRequests = computed(() => {
  const term = search.value.trim().toLowerCase()

  return store.requests.filter((req) => {
    const matchesSearch =
      !term ||
      (req.titulo || '').toLowerCase().includes(term) ||
      (req.descripcion || '').toLowerCase().includes(term)

    const matchesStatus = !filterStatus.value || req.estado === filterStatus.value
    const matchesCategory = !filterCategory.value || req.categoria === filterCategory.value

    return matchesSearch && matchesStatus && matchesCategory
  })
})

onMounted(() => store.fetchRequests())
</script>

<template>
  <section class="requests">
    <header class="requests__header">
      <div>
        <h2>Solicitudes</h2>
        <p>Listado de solicitudes registradas en el sistema.</p>
      </div>
      <BaseButton to="/solicitudes/nueva" variant="primary">Nueva solicitud</BaseButton>
    </header>

    <div v-if="store.error" class="alert alert--error">{{ store.error }}</div>

    <div class="requests__filters">
      <input v-model="search" type="search" placeholder="Buscar por título o descripción" />
      <select v-model="filterStatus">
        <option value="">Todos los estados</option>
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="filterCategory">
        <option value="">Todas las categorías</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <p v-if="store.loading" class="requests__state">Cargando solicitudes...</p>

    <p v-else-if="!store.requests.length" class="requests__state">
      No hay solicitudes registradas.
    </p>

    <template v-else>
      <RequestTable :requests="filteredRequests" />

      <p v-if="!filteredRequests.length" class="requests__state">
        No hay resultados para los filtros seleccionados.
      </p>
    </template>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.requests {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.requests__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  p {
    color: $color-text-muted;
  }
}

.requests__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  input,
  select {
    padding: 0.6rem 0.75rem;
    border: 1px solid $color-border-strong;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
  }

  input {
    flex: 1;
    min-width: 200px;
  }
}

.requests__state {
  color: $color-text-muted;
  padding: 1rem 0;
}

.alert--error {
  background: $status-red-bg;
  color: $status-red-text;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

@media (max-width: 640px) {
  .requests__header {
    flex-wrap: wrap;
  }
}
</style>
