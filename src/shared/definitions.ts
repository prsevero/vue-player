export type Artist = {
  name: string
}

export type Song = {
  album?: string
  albumId?: number
  artist: Artist
  cover: string
  credits: string
  id: number
  name: string
  src: string
}

export type Album = {
  artist: string
  cover: string
  id: number
  name: string
  songs: Song[]
}

export enum PlayerStatus {
  PAUSED = 'paused',
  PLAYING = 'playing',
  STOPPED = 'stopped'
}

export type CustomError = {
  error: Error | unknown
  name: string
}
