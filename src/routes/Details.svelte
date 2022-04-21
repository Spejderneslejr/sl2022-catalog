<script type="ts">
  import { getContext } from 'svelte'
  import { link } from 'svelte-spa-router'
  export let params: { id?: string } = {}
  import { activities, activitySizes, activityTypes } from '../store'
  import type { Activity } from '../store'
  import ActivityMap from '../lib/ActivityMap.svelte'

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
</script>

<div class="flex flex-col">
  {#if activity}
    <a use:link={'/'}>
      <button class="btn btn-outline btn-xs mb-4 hover:fill-white">
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
    </a>

    <div class="mb-4 border-t-4 border-dashed border-gray-400" />
    <div class="flex flex-col gap-x-10 gap-y-10 sm:flex-row sm:gap-y-0">
      <div class="w-full sm:w-1/3">
        <img class="object-cover" src={activity.images.md} alt={activity.title[lang]} />

        <div class="flex flex-row justify-end gap-x-4 pt-4">
          {#if activity.patch} <div>{activity.patch}</div>{/if}
          {#if activity.friendship_award} <div>FRIENDSHIP AWARD</div> {/if}

          <button class="btn btn-info btn-md">{strings.signup}</button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2">
        <h1 class="mb-2 text-lg font-bold">{activity.title[lang]}</h1>

        <div class="flex">
          <span>{strings.age}:</span><span class="">
            {#each activity.age as age}
              <span class="ml-3 border-2 border-dotted border-sl-yellow px-1">{age}</span>
            {/each}
          </span>
        </div>

        <div class="flex">
          <span>{strings.location}:</span><span class="">
            {#if activity.location.id === 'lejren'}
              <span class="ml-3 border-2 border-dotted border-gray-400 px-1">
                {#if lang === 'da'}
                  Lejren, aktivitetsområde {activity.area[lang]}
                {:else}
                  The Camp, activity area {activity.area[lang]}
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
            <span>{strings.activity_type}:</span><span class="">
              {#each types as type}
                <span class="ml-3 border-2 border-dotted border-sl-turquis px-1">{type}</span>
              {/each}
            </span>
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

        <div class="prose mb-2 max-w-xl">{@html activity.description[lang]}</div>
      </div>
    </div>
    <div class="mt-4">
      <ActivityMap {activity} />
    </div>
  {:else}
    <p class="loading">loading...</p>
  {/if}
</div>
