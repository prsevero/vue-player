import type { Album, Song } from '@/shared/definitions'
import { PlayerStatus } from '@/shared/definitions'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', () => {
  // Album selected / displayed in full screen
  const album = ref<Album | null>(null)
  // Current song being played
  const current = ref<Song | null>(null)
  // Index of the current song in the playlist
  const currentIndex = ref<number>(0)
  // Stores the album of the playlist
  const playlistAlbum = ref<Album | null>(null)
  // Stores the playlist itself
  const playlist = ref<Song[] | null>(null)
  // Status of the player (PlayerStatus in definitions.ts)
  const status = ref<PlayerStatus>(PlayerStatus.STOPPED)

  function onNext() {
    if (!playlist.value || playlist.value.length < 2) return

    const newIndex = currentIndex.value < playlist.value.length - 1 ? currentIndex.value + 1 : 0

    currentIndex.value = newIndex
    setCurrent(playlist.value[newIndex])
  }

  function onPrev() {
    if (!playlist.value || playlist.value.length < 2) return

    const newIndex = currentIndex.value > 0 ? currentIndex.value - 1 : playlist.value.length - 1

    currentIndex.value = newIndex
    setCurrent(playlist.value[newIndex])
  }

  function setAlbum(value: Album | null) {
    album.value = value
  }

  // Set current song being played and updates the index based in the playlist
  function setCurrent(song: Song | null) {
    current.value = song
    if (!song) return
    const index = playlist.value?.findIndex((value) => value.id === song.id)
    currentIndex.value = index || 0
    status.value = PlayerStatus.PLAYING
  }

  // When selects an album to play, or stops the player, update the needed variables
  function setPlaylistAlbum(album: Album | null) {
    if (album) {
      playlistAlbum.value = album
      playlist.value = album.songs
      setCurrent(album.songs[0])
      return
    }

    playlist.value = null
    setCurrent(null)
    setStatus(PlayerStatus.STOPPED)
  }

  function setStatus(value: PlayerStatus) {
    status.value = value
  }

  return {
    album,
    current,
    currentIndex,
    onNext,
    onPrev,
    playlist,
    playlistAlbum,
    setAlbum,
    setCurrent,
    setPlaylistAlbum,
    setStatus,
    status
  }
})
