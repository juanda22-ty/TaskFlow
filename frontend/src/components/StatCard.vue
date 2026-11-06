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
  border-radius: 1rem;
  padding: 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  box-shadow: 0 2px 8px rgba(24, 34, 67, 0.025);
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(24, 34, 67, 0.07);
  }

  &--yellow {
    border-left: 3px solid $tone-yellow;
  }
  &--blue {
    border-left: 3px solid $tone-blue;
  }
  &--purple {
    border-left: 3px solid $tone-purple;
  }
  &--green {
    border-left: 3px solid $tone-green;
  }
  &--red {
    border-left: 3px solid $tone-red;
  }
  &--default {
    border-left: 3px solid $tone-default;
  }
}

.stat-card__value {
  font-size: clamp(1.65rem, 2.5vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.stat-card__label {
  color: $color-text-muted;
  font-size: 0.9rem;
}
</style>
