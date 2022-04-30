import { writable } from 'svelte/store'

export interface Activity {
  id: number
  title: LanguageStrings
  summary: LanguageStrings
  description: LanguageStrings
  signup: boolean
  dropin: boolean
  type: string[]
  age: string[]
  size: string[]
  area: string | null
  location: Location
  images: Images
  danish: boolean
  english: boolean
  friendship_award: boolean
  patch: string | null
}

export interface Images {
  sm: string
  md: string
  lg: string
  attribution: string
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

export interface Config {
  signup: boolean
}

export interface Search {
  query: string
  typeSelected: string[]
  ageSelected: string[]
  sizeSelected: string[]
  languageSelected: string[]
  locationSelected: string[]
  enrolmentSelected: string[]
  advanced: boolean
}

export const activities = writable<Activity[]>([])

export const activityTypes = writable<ActivityTypes>(null)

export const activityLocations = writable<ActivityLocations>(null)

export const activitySizes = writable<ActivitySizes>(null)

export const activityAges = writable<string[]>(null)

export const activityLanguages = writable<string[]>(null)

export const config = writable<Config>({ signup: false })

export const search = writable<Search>({
  query: '',
  typeSelected: [],
  ageSelected: [],
  sizeSelected: [],
  languageSelected: [],
  locationSelected: [],
  enrolmentSelected: [],
  advanced: false
})
