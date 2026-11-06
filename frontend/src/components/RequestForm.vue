<script setup>
import { reactive } from 'vue'
import { CATEGORIES, PRIORITIES } from '../utils/constants'
import { validateRequest } from '../utils/validateRequest'
import BaseButton from './Buttons/BaseButton.vue'

defineProps({
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  titulo: '',
  descripcion: '',
  categoria: '',
  prioridad: ''
})

const errors = reactive({})

function clearError(field) {
  delete errors[field]
}

function onSubmit() {
  const { isValid, errors: validationErrors } = validateRequest(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, validationErrors)

  if (!isValid) return

  emit('submit', { ...form })
}

function reset() {
  form.titulo = ''
  form.descripcion = ''
  form.categoria = ''
  form.prioridad = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

defineExpose({ reset })
</script>

<template>
  <form class="request-form" @submit.prevent="onSubmit">
    <div class="field">
      <label for="titulo">Título</label>
      <input
        id="titulo"
        v-model="form.titulo"
        type="text"
        placeholder="Resumen de la solicitud"
        @input="clearError('titulo')"
      />
      <span v-if="errors.titulo" class="field__error">{{ errors.titulo }}</span>
    </div>

    <div class="field">
      <label for="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        v-model="form.descripcion"
        rows="5"
        placeholder="Detalle lo que necesita"
        @input="clearError('descripcion')"
      ></textarea>
      <span v-if="errors.descripcion" class="field__error">{{ errors.descripcion }}</span>
    </div>

    <div class="field">
      <label for="categoria">Categoría</label>
      <select id="categoria" v-model="form.categoria" @change="clearError('categoria')">
        <option value="" disabled>Seleccione una categoría</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <span v-if="errors.categoria" class="field__error">{{ errors.categoria }}</span>
    </div>

    <div class="field">
      <label for="prioridad">Prioridad</label>
      <select id="prioridad" v-model="form.prioridad" @change="clearError('prioridad')">
        <option value="" disabled>Seleccione una prioridad</option>
        <option v-for="p in PRIORITIES" :key="p" :value="p">{{ p }}</option>
      </select>
      <span v-if="errors.prioridad" class="field__error">{{ errors.prioridad }}</span>
    </div>

    <div class="request-form__actions">
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancelar</BaseButton>
      <BaseButton type="submit" variant="primary" :disabled="submitting">
        {{ submitting ? 'Enviando...' : 'Enviar' }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.request-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 640px;
  padding: clamp(1.15rem, 3vw, 1.75rem);
  border: 1px solid $color-border;
  border-radius: 1rem;
  background: $color-surface;
  box-shadow: 0 5px 20px rgba(24, 34, 67, 0.04);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-weight: 600;
    font-size: 0.88rem;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.72rem 0.85rem;
    border: 1px solid $color-border-strong;
    border-radius: 0.7rem;
    background: #fcfcfe;
    color: $color-text;
    font-size: 0.92rem;
    font-family: inherit;
    transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: $color-primary;
    background: $color-surface;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
  }

  textarea {
    resize: vertical;
    min-height: 8rem;
  }
}

.field__error {
  color: $color-error;
  font-size: 0.85rem;
}

.request-form__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
