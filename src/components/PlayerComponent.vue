<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { PlayerStatus } from '@/shared/definitions'
import { formatSecondsToMinuteAndSeconds } from '@/shared/utils'
import { usePlayerStore } from '@/stores/player'

import IconForward from '@/components/icons/IconForward.vue'
import IconFullScreen from '@/components/icons/IconFullScreen.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconQuitFullScreen from '@/components/icons/IconQuitFullScreen.vue'
import IconRewind from '@/components/icons/IconRewind.vue'
import IconStop from '@/components/icons/IconStop.vue'

const playerStore = usePlayerStore()
const audio = new Audio()

const currentTime = ref('')
const totalTime = ref('')

// Progress
let mouseDownOnSlider = false
let timeChange: number = 0
const progress = ref(0)
/// Handle change in the track slider progress
const handleChange = (e: Event) => {
  if (!audio) return
  const value = parseFloat((e.target as HTMLInputElement).value)
  const pct = value / 100
  timeChange = (audio.duration || 0) * pct
  progress.value = value
  currentTime.value = formatSecondsToMinuteAndSeconds(timeChange)
}
/// Prevents track progress to be updated by the song being played when user is moving the slider
const handleMousedown = () => (mouseDownOnSlider = true)
const handleMouseup = () => {
  if (!audio) return
  mouseDownOnSlider = false
  audio.currentTime = timeChange
  timeChange = 0
}


// Actions
const handlePlayOrPause = () => {
  if (audio.paused) {
    audio.play()
    playerStore.setStatus(PlayerStatus.PLAYING)
    return
  }
  audio.pause()
  playerStore.setStatus(PlayerStatus.PAUSED)
}

const handlePrev = async () => {
  if (!playerStore.current) return
  progress.value = 0
  const seconds = Math.floor(audio.currentTime % 60)

  // If the song played more than 3 seconds, we just back to the start
  if (seconds > 3 || (playerStore.playlist && playerStore.playlist.length < 2))
    return (audio.currentTime = 0)

  await nextTick()
  playerStore.onPrev()
}

const handleNext = async (onEnded?: boolean) => {
  if (!playerStore.current) return
  progress.value = 0
  // If the song ended and we just have one song in the playlist, repeat it
  if (onEnded && playerStore.playlist && playerStore.playlist.length < 2) {
    audio.currentTime = 0
    audio.play()
    return
  }
  await nextTick()
  playerStore.onNext()
}

const handleStop = () => {
  audio.pause()
  audio.currentTime = 0
  playerStore.setPlaylistAlbum(null)
}

// Sets album to the current one being played (when click in the info on the player)
const handleAlbum = () => {
  playerStore.setAlbum(playerStore.playlistAlbum)
}

// Handle full screen button click
const handleFullScreen = () => {
  if (playerStore.current?.albumId === playerStore.album?.id) {
    return playerStore.setAlbum(null)
  }
  handleAlbum()
}


// Audio API
/// Updates current and total time when audio is loaded
audio.addEventListener('loadeddata', () => {
  currentTime.value = formatSecondsToMinuteAndSeconds(audio.currentTime)
  totalTime.value = formatSecondsToMinuteAndSeconds(audio.duration)
})
/// Updates current and slider progress values when audio is being played
audio.addEventListener('timeupdate', () => {
  if (mouseDownOnSlider || !audio?.duration) return
  currentTime.value = formatSecondsToMinuteAndSeconds(audio.currentTime)
  progress.value = (audio.currentTime / audio.duration) * 100
})
/// When audio ends, call the next handler
audio.addEventListener('ended', () => handleNext(true))


// Playing listener
watch(
  () => playerStore.current,
  () => {
    if (!playerStore.current) return
    progress.value = 0
    audio.src = playerStore.current.src
    audio.play()
  }
)
watch(
  () => playerStore.status,
  () => {
    playerStore.status === PlayerStatus.PLAYING ? audio.play() : audio.pause()
  }
)
</script>

<template>
  <div
    :class="{
      [$style.wrapper]: true,
      [$style['wrapper--active']]: playerStore.current
    }"
  >
    <template v-if="playerStore.current">
      <!-- Current and total time -->
      <div :class="$style.time">
        <p>{{ currentTime }}</p>
        <p>{{ totalTime }}</p>
      </div>

      <!-- Progress slider track -->
      <input
        @input="handleChange"
        @mousedown="handleMousedown"
        @mouseup="handleMouseup"
        @touchstart="handleMousedown"
        @touchend="handleMouseup"
        :class="$style.progress"
        type="range"
        :value="progress"
      />

      <!-- Info about current song -->
      <button @click="handleAlbum" :class="$style.info">
        <img :alt="`Cover for ${playerStore.current.name}`" :src="playerStore.current.cover" />
        <span>
          <h4 :class="$style['info__song']">{{ playerStore.current.name }}</h4>
          <p :class="$style['info__artist']">{{ playerStore.current.artist }}</p>
        </span>
      </button>

      <!-- Action buttons -->
      <div :class="$style.actions">
        <button @click="handlePrev" :class="$style.button" type="button">
          <IconRewind />
        </button>
        <button @click="handlePlayOrPause" :class="$style.button" type="button">
          <IconPause v-if="playerStore.status === PlayerStatus.PLAYING" />
          <IconPlay v-else />
        </button>
        <button
          @click="() => handleNext()"
          :class="$style.button"
          :disabled="playerStore.playlist && playerStore.playlist.length < 2 ? true : false"
          type="button"
        >
          <IconForward />
        </button>
        <button @click="handleStop" :class="$style.button" type="button">
          <IconStop />
        </button>
        <button @click="handleFullScreen" :class="$style.button" type="button">
          <IconQuitFullScreen v-if="playerStore.album?.id === playerStore.current.albumId" />
          <IconFullScreen v-else />
        </button>
      </div>
    </template>
  </div>
</template>

<style module lang="scss">
@import '@/assets/_variables';

.wrapper {
  align-items: center;
  background: var(--color-secondary);
  border-radius: 5px;
  bottom: -100px;
  box-shadow: 0 4px 8px #000;
  display: grid;
  gap: 15px 10px;
  grid-template-areas:
    'time'
    'progress'
    'actions'
    'info';
  left: 5px;
  padding: 15px;
  position: fixed;
  right: 5px;
  z-index: 10;

  /* Responsive */
  @media all and (min-width: $min-width-xxs) {
    grid-template-areas:
      'time time'
      'progress progress'
      'info actions';
  }
  @media all and (min-width: $min-width-md) {
    grid-template-areas:
      'info progress actions'
      'info time actions';
    grid-template-columns: 33.33333%;
  }
}

.wrapper--active {
  bottom: 5px;
  transition: bottom 0.44s ease-in-out;

  + div,
  ~ main {
    padding-bottom: 200px;
  }
}

.time {
  color: var(--color-white);
  display: flex;
  font-size: 13px;
  grid-area: time;
  justify-content: space-between;
  line-height: 1;
}

.progress {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
  grid-area: progress;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    background-color: var(--color-white);
    border-radius: 8px;
    height: 8px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--color-primary);
    border-radius: 8px;
    height: 16px;
    margin-top: -4px;
    transition: transform 0.22s ease-in-out;
    width: 16px;
  }

  &:focus::-webkit-slider-thumb {
    transform: scale(1.2);
  }

  &::-moz-range-track {
    background-color: var(--color-white);
    border-radius: 0.5rem;
    height: 0.5rem;
  }

  &::-moz-range-thumb {
    background-color: var(--color-primary);
    border: none;
    border-radius: 0.5rem;
    height: 16px;
    transition: transform 0.22s ease-in-out;
    width: 16px;
  }

  &:focus::-moz-range-thumb {
    transform: scale(1.2);
  }
}

.info {
  background: 0;
  border: 0;
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  font: inherit;
  gap: 8px;
  grid-area: info;
  max-height: 200px;
  overflow: hidden;
  padding: 0;
  text-align: left;
  transition: all 0.55s ease-in-out;
  word-break: break-all;

  img {
    border-radius: 4px;
    max-height: 40px;
    max-width: 40px;
  }

  h4,
  p {
    line-height: 1.3;
    margin: 0;
  }

  h4 {
    font-size: 16px;
    font-weight: 700;
  }
}

.actions {
  display: flex;
  gap: 3px;
  grid-area: actions;
  justify-content: center;
  @media all and (min-width: $min-width-xxs) {
    justify-content: flex-end;
  }
}

.button {
  background: 0;
  border: 0;
  cursor: pointer;
  display: flex;
  padding: 0;

  svg {
    border-radius: 50%;
    height: 40px;
    transition: background 0.22s ease-in-out;
    width: 40px;

    path {
      fill: var(--color-white);
    }
  }

  &[disabled] {
    pointer-events: none;

    svg path {
      fill: var(--color-gray);
    }
  }

  &:hover svg {
    background: var(--color-primary);
  }
}
</style>
