<script setup lang="ts">
import type { Album as AlbumType } from '@/shared/definitions'
import { ref } from 'vue'

import { API_URL } from '@/shared/constants'
import Album from '@/components/AlbumComponent.vue'
import FullScreenAlbum from '@/components/FullScreenAlbumComponent.vue'
import Player from '@/components/PlayerComponent.vue'

const albums = ref<AlbumType[]>([])

try {
  const response = await fetch(API_URL)
  const data = await response.json()
  albums.value = data
} catch (error) {
  console.error(error)
  throw {
    error,
    name: 'API_ERROR'
  }
}
</script>

<template>
  <Player />
  <FullScreenAlbum />

  <main :class="$style.main">
    <Album v-for="album in albums" :key="album.id" :album="album" />
  </main>
</template>

<style module lang="scss">
@import '@/assets/_variables';

.main {
  display: grid;
  gap: 25px;
  grid-template-columns: 1fr;
  padding: 25px;

  /* Responsive */
  @media all and (min-width: $min-width-xxs) {
    display: grid;
    gap: 25px;
    grid-template-columns: 1fr 1fr;
  }

  @media all and (min-width: $min-width-xs) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media all and (min-width: $min-width-md) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
