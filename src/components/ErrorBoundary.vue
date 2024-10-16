<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

type CustomError = {
  error: Error | unknown
  name: string
}

const error = ref(false)
const errorMessage = ref('')

onErrorCaptured((callback: CustomError | unknown): boolean | void => {
  error.value = true
  errorMessage.value = 'Unknown error.'
  const cb = callback as CustomError
  if (cb.error && cb.name) {
    if (cb.name === 'API_ERROR') errorMessage.value = 'There was an error calling the API.'
  }
  return false
})
</script>

<template>
  <div v-if="error" :class="$style.error">{{ errorMessage }}</div>
  <template v-else><slot></slot></template>
</template>

<style module>
.error {
  color: var(--color-error);
  padding: 15px;
  text-align: center;
}
</style>
