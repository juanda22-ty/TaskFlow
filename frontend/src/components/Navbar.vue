<script setup>
import logo from '../assets/logo.svg'

defineEmits(['toggle-menu'])
</script>

<template>
  <header class="navbar">
    <div class="navbar__left">
      <button
        class="navbar__menu-btn"
        aria-label="Abrir menú"
        @click="$emit('toggle-menu')"
      >
        ☰
      </button>
      <img class="navbar__logo" :src="logo" alt="TaskFlow" />
      <span class="navbar__brand">TaskFlow</span>
    </div>

    <div class="navbar__user">
      <span class="navbar__avatar" aria-hidden="true">U</span>
      <span class="navbar__username">Usuario</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: $color-surface;
  border-bottom: 1px solid $color-border;
}

.navbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar__menu-btn {
  background: $color-primary;
  color: $color-primary-contrast;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.navbar__logo {
  width: 1.6rem;
  height: 1.6rem;
}

.navbar__brand {
  font-weight: 700;
  font-size: 1.15rem;
}

.navbar__user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $color-text-muted;
}

.navbar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: $color-primary;
  color: $color-primary-contrast;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .navbar__menu-btn {
    display: none;
  }
}
</style>
