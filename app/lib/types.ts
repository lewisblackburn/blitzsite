export type NowPlayingSong = {
  album: string
  albumImageUrl: string
  artist: string
  isPlaying: boolean
  songUrl: string
  title: string
}

export interface TopArtist {
  external_urls: ExternalUrls
  followers: Followers
  genres: string[]
  href: string
  id: string
  images: Image[]
  name: string
  popularity: number
  type: "artist"
  uri: string
}

export interface TopTracks {
  items: TopTrack[]
}

export interface TopTrack {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIDS
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: null | string
  track_number: number
  type: "track"
  uri: string
}

export interface ExternalUrls {
  spotify: string
}

export interface Followers {
  href: null
  total: number
}

export interface Image {
  height: number
  url: string
  width: number
}

export interface Album {
  album_type: AlbumType
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: ReleaseDatePrecision
  total_tracks: number
  type: "album"
  uri: string
}

export enum AlbumType {
  Album = "ALBUM",
  Compilation = "COMPILATION",
  Single = "SINGLE",
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: "artist"
  uri: string
}

export interface Image {
  height: number
  url: string
  width: number
}

export enum ReleaseDatePrecision {
  Day = "day",
  Year = "year",
}

export interface ExternalIDS {
  isrc: string
}
