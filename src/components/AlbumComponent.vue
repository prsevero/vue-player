<script setup lang="ts">
import type { Album } from '@/shared/definitions'
import { PlayerStatus } from '@/shared/definitions'
import { usePlayerStore } from '@/stores/player'
import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from '@/components/icons/IconPlay.vue'

const playerStore = usePlayerStore()

const { album } = defineProps<{ album: Album }>()

// When clicking in the button, play or pause the song
const handlePlayOrPause = () => {
  if (album.id === playerStore.current?.albumId) {
    playerStore.setStatus(
      playerStore.status === PlayerStatus.PLAYING ? PlayerStatus.PAUSED : PlayerStatus.PLAYING
    )
    return
  }
  playerStore.setPlaylistAlbum(album)
}

// Show album details in full screen
const handleSelect = () => playerStore.setAlbum(album)
</script>

<template>
  <div @click="handleSelect" :class="$style.wrapper" role="button">
    <span :class="$style.cover">
      <img :alt="`Cover for ${album.name}`" :src="album.cover" />
      <button @click.stop="handlePlayOrPause" :class="[$style.icon, $style['icon--play']]">
        <IconPause
          v-if="
            album.id === playerStore.current?.albumId && playerStore.status === PlayerStatus.PLAYING
          "
        />
        <IconPlay v-else />
      </button>
    </span>
    {{ album.name }} • {{ album.artist }}
  </div>
</template>

<style module lang="scss">
@import '@/assets/_variables';

.wrapper {
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 700;
  gap: 10px;
  padding: 0;
}

.cover {
  display: flex;
  max-width: 230px;
  overflow: hidden;
  position: relative;

  img,
  &::after {
    border-radius: 10px;
  }

  img {
    max-width: 100%;
  }

  &::after {
    background: #000;
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0.2;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.33s ease-in-out;
  }
}

.icon {
  background: 0;
  border: 0;
  bottom: 10px;
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 10px;
  z-index: 1;

  svg {
    height: 75px;
    width: 75px;
  }
}

@media all and (min-width: $min-width-xs) {
  .icon {
    bottom: -10px;
    opacity: 0;
    transition: all 0.33s ease-in-out;
  }

  .cover::after {
    opacity: 0;
  }

  .cover:hover {
    &::after {
      opacity: 0.55;
    }

    .icon {
      bottom: 10px;
      opacity: 1;
    }
  }
}
</style>
