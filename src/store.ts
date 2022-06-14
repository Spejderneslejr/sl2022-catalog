import type { Dayjs } from 'dayjs'
import { writable } from 'svelte/store'
import { persist, localStorage } from '@macfja/svelte-persistent-store'
export interface Activity {
  id: number
  identifier: number
  duration: number
  title: LanguageStrings
  summary: LanguageStrings
  description: LanguageStrings
  signup: boolean
  dropin: boolean
  ontime: boolean
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
  timeslots: Timeslot[]
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

export interface Timeslot {
  id?: number
  start: Dayjs
  end?: Dayjs
  cancelled: boolean
  capacity: number
  duration: number
  type: Type
  available?: number
}

export enum Type {
  DropIn = 'dropin',
  SignUp = 'signup',
  OnTime = 'ontime',
}

export interface Config {
  signup: boolean
  odoo: string
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

export const config = writable<Config>({ signup: false, odoo: '' })

const [html] = document.getElementsByTagName('html')
const lang = html.getAttribute('lang')

export const searchInitial = {
  query: '',
  typeSelected: [],
  ageSelected: [],
  sizeSelected: [],
  languageSelected: lang === 'en' ? ['english'] : [],
  locationSelected: [],
  enrolmentSelected: [],
  advanced: false,
}

export const search = persist(writable<Search>(searchInitial), localStorage(), 'search')
