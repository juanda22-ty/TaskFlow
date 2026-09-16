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
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--primary {
    background: $color-primary;
    color: $color-primary-contrast;
  }

  &--ghost {
    background: transparent;
    border: 1px solid $color-border-strong;
    color: $color-text-strong;
  }

  &--link {
    background: transparent;
    color: $color-primary;
    padding: 0;
  }
}
</style>
