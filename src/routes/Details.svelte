<script type="ts">
  import { getContext } from 'svelte'

  import Fa from 'svelte-fa'
  import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
  export let params: { id?: string } = {}
  import {
    activities,
    activitySizes,
    activityTypes,
    config,
    type ActivitySizes,
    type KeyValue,
  } from '../store'
  import type { Activity } from '../store'
  import ActivityMap from '../lib/ActivityMap.svelte'
  import ShowDirections from '../lib/ShowDirections.svelte'
  import WeekProgram from '../lib/WeekProgram.svelte'
  import Signup from '../lib/Signup.svelte'
  import TransportInfo from '../lib/TransportInfo.svelte'

  let activity: Activity
  let sizes: string[]
  let types: string[]

  const lang: string = getContext('lang')
  const strings: Record<string, string> = getContext('strings')

  activities.subscribe((value) => {
    activity = value.find((item) => item.id.toString() === params.id)
  })

  $: sizes = getValues('size', lang, activity, $activitySizes)
  $: types = getValues('type', lang, activity, $activityTypes)

  function getValues(fieldName: string, lang: string, activity: Activity, allSizes: ActivitySizes) {
    if (!activity || !allSizes) {
      return null
    }
    let res = []
    for (const t of activity[fieldName]) {
      const found = allSizes[lang].find((item: KeyValue) => item.key === t)
      if (found) {
        res.push(found.value)
      }
    }
    return res.length > 0 ? res : null
  }

  const [html] = document.getElementsByClassName(
    'paragraph--type--text'
  ) as HTMLCollectionOf<HTMLElement>
  if (html) {
    html.style.display = 'none'
  }

  const [download] = document.getElementsByClassName(
    'paragraph--type--download'
  ) as HTMLCollectionOf<HTMLElement>
  if (download) {
    download.style.display = 'none'
  }
</script>

<div class="flex flex-col">
  {#if activity}
    <button onclick="history.back()" class="btn btn-outline btn-sm mb-4 w-40 px-2 hover:fill-white">
      <Fa icon={faAngleLeft} />
      <span class="ml-1">{strings.back}</span>
    </button>

    <div class="flex flex-col gap-x-10 gap-y-10 sm:flex-row sm:gap-y-0">
      <div class="w-full sm:w-1/3">
        <h1 class="mb-2 text-xl font-bold sm:hidden">{activity.title[lang]}</h1>
        <div class="relative">
          <img
            class="object-cover"
            src={activity.images.md ?? 'https://aktiviteter.sl22.dk/images/default.webp'}
            alt={activity.title[lang]}
          />
          {#if activity.images.attribution}
            <div
              class="absolute bottom-2 right-2 rounded bg-white/30 py-1 px-2 text-xs text-white backdrop-blur-sm"
            >
              {activity.images.attribution}
            </div>
          {/if}
        </div>

        <div class="flex flex-row justify-end gap-x-4 pt-4">
          {#if activity.patch}
            <img
              class="w-32"
              alt="Mærke"
              src="https://aktiviteter.sl22.dk/images/{activity.patch}.webp"
            />{/if}
          {#if activity.friendship_award} <div>FRIENDSHIP AWARD</div> {/if}

          {#if activity.location.id === 'a12'}
            <ShowDirections
              lat={activity.location.lat}
              lon={activity.location.lon}
              label={strings.directions}
            />
          {/if}
          
          {#if $config.signup && activity.signup && activity.timeslots}
            <Signup identifier={activity.identifier} {lang} {strings} config={$config} />
          {/if}

        </div>
      </div>

      <div class="flex flex-col gap-y-3">
        <h1 class="mb-2 hidden text-xl font-bold sm:block">{activity.title[lang]}</h1>

        {#if activity.identifier}
          <div class="flex items-center">
            <span> {strings.identifier}:</span>
            <span class="ml-3 rounded-sm bg-slate-100 p-1 font-bold">
              {activity.identifier}
            </span>
          </div>
        {/if}

        {#if activity.age.length > 0}
          <div class="flex">
            <span>{strings.age}:</span>
            <span class="">
              {#each activity.age as age}
                <span class="ml-3 border-2 border-dotted border-sl-yellow px-1">{age}</span>
              {/each}
            </span>
          </div>
        {/if}

        {#if activity.signup || activity.dropin || activity.ontime}
          <div class="flex">
            <span>{strings.enrolment}:</span>
            <span class="">
              {#if activity.signup}
                <span class="ml-3 border-2 border-dotted border-amber-400 px-1">
                  {strings.signup}
                </span>
              {/if}
              {#if activity.dropin || activity.ontime}
                {#if activity.ontime}
                  <span class="ml-3 border-2 border-dotted border-emerald-400 px-1">
                    {strings.ontime}
                  </span>
                {:else}
                  <span class="ml-3 border-2 border-dotted border-purple-400 px-1">
                    {strings.dropin}
                  </span>
                {/if}
              {/if}
            </span>
          </div>
        {/if}

        <div class="flex">
          <span>{strings.location}:</span><span class="">
            {#if activity.location.id === 'lejren'}
              <span class="ml-3 border-2 border-dotted border-gray-400 px-1">
                {#if lang === 'da'}
                  Lejren{#if activity.area[lang]}, aktivitetsområde {activity.area[lang]}{/if}
                {:else}
                  The Camp{#if activity.area[lang]}, activity area {activity.area[lang]}{/if}
                {/if}
              </span>
            {:else}
              <span class="ml-3 border-2 border-dotted border-gray-400 px-1">
                {activity.area[lang]}
              </span>
            {/if}
          </span>
        </div>

        {#if types}
          <div class="flex">
            <span>{strings.activity_type}:</span>
            <div class="flex max-w-md flex-wrap gap-y-2">
              {#each types as type}
                <div class="ml-3 whitespace-nowrap border-2 border-dotted border-sl-turquis px-1">
                  {type}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if sizes}
          <div class="flex">
            <span>{strings.targetgroup}:</span><span class="">
              {#each sizes as size}
                <span class="ml-3 border-2 border-dotted border-sl-flamingo px-1">{size}</span>
              {/each}
            </span>
          </div>
        {/if}

        {#if activity.danish || activity.english}
          <div class="flex">
            <span>{strings.languagesupport}:</span><span class="">
              {#if activity.danish}
                <span class="ml-3 border-2 border-dotted border-gray-400 px-1">Dansk</span>
              {/if}
              {#if activity.english}
                <span class="ml-3 border-2 border-dotted border-gray-400 px-1">Engelsk</span>
              {/if}
            </span>
          </div>
        {/if}

        {#if activity.duration}
          <div class="flex">
            <span>{strings.duration}:</span>
            <span class="ml-3">{activity.duration} {strings.minutes}</span>
          </div>
        {/if}
        
        <div class="!prose my-2 max-w-xl">{@html activity.description[lang]}</div>

        {#if activity.location.id !== 'lejren'}
          <TransportInfo {strings} area={activity.location.id}/>
        {/if}
      </div>
    </div>

    {#if activity.timeslots?.length > 0}
      <WeekProgram
        identifier={activity.identifier}
        timeslots={activity.timeslots}
        {strings}
        config={$config}
      />
    {/if}

    <ActivityMap {activity} {strings} />
  {:else}
    <p class="loading">Henter aktiviteter...</p>
  {/if}
</div>
