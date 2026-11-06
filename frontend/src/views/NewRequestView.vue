<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RequestForm from '../components/RequestForm.vue'
import { useRequests } from '../composables/useRequests'
import { useNotifications } from '../composables/useNotifications'

const router = useRouter()
const notifications = useNotifications()

const { create } = useRequests()
const submitting = create.loading

const requestForm = ref(null)

async function handleSubmit(payload) {
  try {
    await create.execute(payload)
    notifications.success('Solicitud registrada correctamente')
    requestForm.value?.reset()
  } catch {
    notifications.error(create.error.value || 'No se pudo registrar la solicitud')
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
    margin-top: 0.4rem;
  }
}
</style>
