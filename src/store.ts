import { writable } from 'svelte/store'

export interface Activity {
  id: number
  title: LanguageStrings
  description: LanguageStrings
  type: string[]
  age: string[]
  size: string[]
  area: string | null
  location: Location
  images: Images
  danish: boolean
  english: boolean
}

export interface Images {
  sm: string
  md: string
  lg: string
}

export interface LanguageStrings {
  da: string
  en: string
}

export interface ActivityTypes {
  da: KeyValue[]
  en: KeyValue[]
}

export interface ActivityLocations {
  da: KeyValue[]
  en: KeyValue[]
}

export interface ActivitySizes {
  da: KeyValue[]
  en: KeyValue[]
}

export interface KeyValue {
  key: string
  value: string
}

export interface Location {
  id: string
  lat: number
  lon: number
}

export interface AppState {
  lang: 'da' | 'en'
}

export const activities = writable<Activity[]>([])

export const activityTypes = writable<ActivityTypes>(null)

export const activityLocations = writable<ActivityLocations>(null)

export const activitySizes = writable<ActivitySizes>(null)

export const activityAges = writable<string[]>(null)

export const activityLanguages = writable<string[]>(null)

export const state = writable<AppState>({ lang: 'da' })