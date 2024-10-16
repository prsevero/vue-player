<script setup lang="ts">
import type { Song } from '@/shared/definitions'
import { usePlayerStore } from '@/stores/player'
import IconClose from '@/components/icons/IconClose.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconPlaying from '@/components/icons/IconPlaying.vue'
const playerStore = usePlayerStore()

const handleClose = () => playerStore.setAlbum(null)
const handleSelect = (song: Song) => playerStore.setCurrent(song)
</script>

<template>
  <div :class="{ [$style.wrapper]: true, [$style['wrapper--active']]: playerStore.album }">
    <template v-if="playerStore.album">
      <div>
        <img :alt="`Cover for ${playerStore.album.name}`" :src="playerStore.album.cover" />
      </div>

      <h2 :class="$style.album">{{ playerStore.album.name }}</h2>
      <h4 :class="$style.artist">{{ playerStore.album.artist }}</h4>

      <p :class="$style['ul-title']">Title</p>
      <ul :class="$style.ul">
        <li v-for="song in playerStore.album.songs" :key="song.id">
          <button @click="handleSelect(song)" :class="$style.button" type="button">
            {{ song.name }}
            <IconPlaying
              v-if="song.id === playerStore.current?.id"
              :class="[$style.icon, $style['icon--playing']]"
            />
            <IconPlay v-else :class="[$style.icon, $style['icon--play']]" />
          </button>
        </li>
      </ul>

      <div v-if="playerStore.current?.albumId === playerStore.album.id" :class="$style.credits">
        <p>Credits</p>
        <p v-html="playerStore.current?.credits"></p>
      </div>

      <button @click="handleClose" :class="$style.close" type="button">
        <IconClose />
      </button>
    </template>
  </div>
</template>

<style module lang="scss">
@import '@/assets/variables';

.wrapper {
  background: var(--color-secondary);
  height: 100vh;
  left: 0;
  opacity: 0;
  overflow-y: auto;
  padding: 25px;
  position: fixed;
  right: 0;
  top: 90%;
  transform: scale(0.7);
  transition: all 0.33s ease-in-out;
  visibility: hidden;
  z-index: 5;

  &.wrapper--active {
    opacity: 1;
    top: 0;
    transform: scale(1);
    transition-duration: 0.66s;
    visibility: visible;
  }

  img {
    border-radius: 15px;
    max-height: 50vh;
    max-width: 100%;
  }
}

.album,
.artist {
  color: var(--color-white);
  line-height: 1.5;
  margin: 0;
}

.album {
  font-size: 22px;
  font-weight: 700;
}

.artist {
  font-size: 18px;
  font-weight: 500;
}

.ul-title {
  border-bottom: 1px solid var(--color-gray);
  color: var(--color-white);
  font-size: 14px;
  margin-top: 40px;
  padding: 0 0 5px 10px;
}

.ul {
  list-style: none;
  margin: 0 0 15px;
  padding: 0;

  li:not(:last-child) {
    border-bottom: 1px solid var(--color-gray);
  }
}

.button {
  align-items: center;
  background: 0;
  border: 0;
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  font-size: 16px;
  gap: 10px;
  justify-content: space-between;
  padding: 10px;
  transition: background 0.22s ease-in-out;
  width: 100%;

  &:hover {
    background: var(--color-black-soft);
  }
}

.icon {
  height: 20px;
  width: 20px;

  path {
    fill: var(--color-white);
  }
}

.credits {
  color: var(--color-white);
  font-size: 13px;
  line-height: 1.8;
  margin-top: 50px;
  p:first-child {
    font-weight: 700;
  }
  a {
    color: var(--color-white);
  }
}

.close {
  background: 0;
  border: 0;
  cursor: pointer;
  height: 40px;
  padding: 0;
  position: fixed;
  right: 4px;
  top: 4px;
  transition: transform 0.33s ease-in-out;
  width: 40px;
  z-index: 1;

  svg {
    max-height: 100%;
    max-width: 100%;
  }

  path {
    fill: var(--color-primary);
  }

  &:hover {
    transform: scale(1.2);
  }

  /* Responsive */
  @media all and (min-width: $min-width-xs) {
    right: 10px;
    top: 10px;
  }
}
</style>
