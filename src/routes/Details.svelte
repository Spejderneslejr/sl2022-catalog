<script type="ts">
  import { getContext } from 'svelte'
  export let params: { id?: string } = {}
  import { config, activities, activitySizes, activityTypes } from '../store'
  import type { Activity } from '../store'
  import ActivityMap from '../lib/ActivityMap.svelte'
  import ShowDirections from '../lib/ShowDirections.svelte'
  import WeekProgram from '../lib/WeekProgram.svelte'

  let activity: Activity
  let sizes: string[] | Boolean
  let types: string[] | Boolean

  const lang: string = getContext('lang')
  const strings: Record<string, string> = getContext('strings')

  const unsubscribe = activities.subscribe((value) => {
    activity = value.find((item) => item.id.toString() === params.id)
  })

  $: sizes = getValues('size', lang, activity, $activitySizes)
  $: types = getValues('type', lang, activity, $activityTypes)

  function getValues(fieldName, lang, activity, allSizes) {
    if (!activity || !allSizes) {
      return false
    }
    let res = []
    for (const t of activity[fieldName]) {
      const found = allSizes[lang].find((item) => item.key === t)
      if (found) {
        res.push(found.value)
      }
    }
    return res.length > 0 ? res : false
  }

  const [html] = document.getElementsByClassName('paragraph--type--text')
  if (html) {
    html.style.display = 'none'
  }
</script>

<div class="flex flex-col">
  {#if activity}
    <button onclick="history.back()" class="btn btn-outline btn-sm mb-4 w-40 px-2 hover:fill-white">
      <svg
        height="12px"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="12px"
        y="12px"
        viewBox="0 0 477.175 477.175"
        style="enable-background:new 0 0 477.175 477.175;"
        xml:space="preserve"
      >
        <g>
          <path
            d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
         c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"
          />
        </g>
      </svg>
      <span class="ml-1">{strings.back}</span>
    </button>

    <div class="flex flex-col gap-x-10 gap-y-10 sm:flex-row sm:gap-y-0">
      <div class="w-full sm:w-1/3">
        <h1 class="mb-2 text-xl font-bold sm:hidden">{activity.title[lang]}</h1>
        <div class="relative">
          <img class="object-cover" src={activity.images.md ?? 'https://aktiviteter.sl22.dk/images/default.webp'} alt={activity.title[lang]} />
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
          {#if $config.signup}
            <button class="btn btn-info btn-md">{strings.signup}</button>
          {/if}
          {#if activity.location.id === 'a12'}
            <ShowDirections
              lat={activity.location.lat}
              lon={activity.location.lon}
              label={strings.directions}
            />
          {/if}
        </div>
      </div>

      <div class="flex flex-col gap-y-3">
        <h1 class="mb-2 hidden text-xl font-bold sm:block">{activity.title[lang]}</h1>

        <div class="flex">
          <span> {strings.identifier}:</span><span class="ml-3 font-bold"
            >{activity.identifier}
          </span>
        </div>

        <div class="flex">
          <span>{strings.age}:</span><span class="">
            {#each activity.age as age}
              <span class="ml-3 border-2 border-dotted border-sl-yellow px-1">{age}</span>
            {/each}
          </span>
        </div>

        <div class="flex">
          <span>{strings.enrolment}:</span>
          <span class="">
            {#if activity.signup}
              <span class="ml-3 border-2 border-dotted border-amber-400 px-1">
                {strings.signup}
              </span>
            {/if}
            {#if activity.dropin}
              {#if activity.ontime}
                <span class="ml-3 border-2 border-dotted border-emerald-400 px-1">
                  {strings.dropin} : {strings.ontime}
                </span>
              {:else}
                <span class="ml-3 border-2 border-dotted border-purple-400 px-1">
                  {strings.dropin}
                </span>
              {/if}
            {/if}
          </span>
        </div>

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
      </div>
    </div>

    {#if activity.timeslots}
      <WeekProgram timeslots={activity.timeslots} {strings} />
    {/if}
    <ActivityMap {activity} {strings} />
  {:else}
    <p class="loading">loading...</p>
  {/if}
</div>
