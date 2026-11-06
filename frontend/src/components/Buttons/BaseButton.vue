<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'ghost', 'link'].includes(value)
  },
  to: {
    type: [String, Object],
    default: null
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const isLink = computed(() => props.to != null)
</script>

<template>
  <RouterLink
    v-if="isLink"
    :to="to"
    class="base-btn"
    :class="`base-btn--${variant}`"
  >
    <slot />
  </RouterLink>

  <button
    v-else
    :type="type"
    class="base-btn"
    :class="`base-btn--${variant}`"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.base-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.55rem;
  padding: 0.58rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.7rem;
  font-size: 0.9rem;
  font-weight: 650;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;

  &:not(:disabled):hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--primary {
    background: linear-gradient(135deg, $color-primary, $color-primary-dark);
    color: $color-primary-contrast;
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.18);

    &:not(:disabled):hover {
      box-shadow: 0 7px 16px rgba(79, 70, 229, 0.25);
    }
  }

  &--ghost {
    background: $color-surface;
    border-color: $color-border-strong;
    color: $color-text-strong;

    &:not(:disabled):hover {
      background: $color-border-soft;
    }
  }

  &--link {
    background: transparent;
    color: $color-primary;
    padding: 0;
    min-height: auto;
  }
}
</style>
