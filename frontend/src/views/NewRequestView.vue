<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RequestForm from '../components/RequestForm.vue'
import { useRequests } from '../composables/useRequests'

const router = useRouter()

const { create } = useRequests()
const submitting = create.loading

const requestForm = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

async function handleSubmit(payload) {
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await create.execute(payload)
    successMessage.value = 'Solicitud registrada correctamente'
    requestForm.value?.reset()
  } catch {
    errorMessage.value = create.error.value
  }
}

function handleCancel() {
  router.push('/solicitudes')
}
</script>

<template>
  <section class="new-request">
    <header class="new-request__header">
      <h2>Nueva solicitud</h2>
      <p>Registre una solicitud para que sea procesada por el sistema.</p>
    </header>

    <div v-if="successMessage" class="alert alert--success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert--error">{{ errorMessage }}</div>

    <RequestForm
      ref="requestForm"
      :submitting="submitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.new-request {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.new-request__header {
  h2 {
    margin-bottom: 0.25rem;
  }

  p {
    color: $color-text-muted;
  }
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.alert--success {
  background: $status-green-bg;
  color: $status-green-text;
}

.alert--error {
  background: $status-red-bg;
  color: $status-red-text;
}
</style>
