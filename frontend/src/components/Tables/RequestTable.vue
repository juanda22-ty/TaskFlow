<script setup>
import { RouterLink } from 'vue-router'
import StatusBadge from '../Status/StatusBadge.vue'
import { formatDate } from '../../utils/formatDate'
import { normalizePriority } from '../../utils/constants'

defineProps({
  requests: {
    type: Array,
    default: () => []
  }
})

function requestId(req) {
  return req._id ?? req.id
}
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Categoría</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in requests" :key="requestId(req)">
          <td class="table__id" data-label="ID">{{ requestId(req) }}</td>
          <td data-label="Título">{{ req.titulo }}</td>
          <td data-label="Categoría">{{ req.categoria }}</td>
          <td data-label="Prioridad">{{ normalizePriority(req.prioridad) }}</td>
          <td data-label="Estado"><StatusBadge :status="req.estado" /></td>
          <td data-label="Fecha">{{ formatDate(req.fechaCreacion) }}</td>
          <td class="table__action">
            <RouterLink :to="`/solicitudes/${requestId(req)}`" class="table__link">
              Ver detalle
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.table-wrapper {
  overflow-x: auto;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid $color-border;
  }

  th {
    background: $color-table-header;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: $color-text-muted;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.table__id {
  font-family: monospace;
  font-size: 0.85rem;
  color: $color-text-muted;
}

.table__link {
  background: transparent;
  color: $color-primary;
  padding: 0;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
}

@media (max-width: 640px) {
  .table-wrapper {
    border: none;
    background: transparent;
    overflow: visible;
  }

  .table thead {
    display: none;
  }

  .table,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
  }

  .table tr {
    margin-bottom: 1rem;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 8px;
    padding: 0.5rem 1rem;
  }

  .table td {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid $color-border-soft;
  }

  .table tr td:last-child {
    border-bottom: none;
  }

  .table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: $color-text-muted;
    flex-shrink: 0;
  }

  .table td.table__action {
    justify-content: flex-start;
  }

  .table td.table__action::before {
    content: none;
  }
}
</style>
