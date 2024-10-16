<script setup lang="ts">
import { getIsDarkScheme } from '@/shared/utils'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import Main from '@/components/MainComponent.vue'
</script>

<template>
  <ErrorBoundary>
    <Suspense>
      <Main />

      <template #fallback>
        <div :class="$style.wrapper">
          <img v-if="getIsDarkScheme()" alt="loading" src="/logo-white.svg" />
          <img v-else alt="loading" src="/logo.svg" />
        </div>
      </template>
    </Suspense>
  </ErrorBoundary>
</template>

<style module lang="scss">
@import '@/assets/_variables';

.wrapper {
  align-items: center;
  background: var(--color-background-soft);
  display: flex;
  height: 100dvh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100dvw;

  img {
    animation: loading 3s ease-in-out infinite;
    max-height: 250px;
    max-width: 30%;

    @media all and (min-width: $min-width-xs) {
      max-height: 100px;
    }
  }
}

@keyframes loading {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
