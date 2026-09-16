<script setup>
defineProps({
  respuesta: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="response-panel">
    <h3 class="response-panel__title">Respuesta</h3>
    <p class="response-panel__text">{{ respuesta }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.response-panel {
  background: $color-surface;
  border: 1px solid $color-border;
  border-left: 4px solid $color-success;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.response-panel__title {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: $status-green-text;
}

.response-panel__text {
  color: $color-text;
}
</style>
