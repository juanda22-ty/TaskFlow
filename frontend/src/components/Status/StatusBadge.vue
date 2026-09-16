<script setup>
import { STATUS_COLORS } from '../../utils/constants'

defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span class="badge" :class="`badge--${STATUS_COLORS[status] || 'gray'}`">
    {{ status }}
  </span>
</template>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge--yellow {
  background: $status-yellow-bg;
  color: $status-yellow-text;
}

.badge--blue {
  background: $status-blue-bg;
  color: $status-blue-text;
}

.badge--purple {
  background: $status-purple-bg;
  color: $status-purple-text;
}

.badge--green {
  background: $status-green-bg;
  color: $status-green-text;
}

.badge--red {
  background: $status-red-bg;
  color: $status-red-text;
}

.badge--gray {
  background: $status-gray-bg;
  color: $status-gray-text;
}
</style>
