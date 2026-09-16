<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    default: 0
  },
  tone: {
    type: String,
    default: 'default'
  }
})
</script>

<template>
  <div class="stat-card" :class="`stat-card--${tone}`">
    <span class="stat-card__value">{{ value }}</span>
    <span class="stat-card__label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.stat-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &--yellow {
    border-top: 4px solid $tone-yellow;
  }
  &--blue {
    border-top: 4px solid $tone-blue;
  }
  &--purple {
    border-top: 4px solid $tone-purple;
  }
  &--green {
    border-top: 4px solid $tone-green;
  }
  &--red {
    border-top: 4px solid $tone-red;
  }
  &--default {
    border-top: 4px solid $tone-default;
  }
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 700;
}

.stat-card__label {
  color: $color-text-muted;
  font-size: 0.9rem;
}
</style>
