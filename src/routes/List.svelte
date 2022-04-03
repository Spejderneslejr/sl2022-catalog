<script lang="ts">
  import { beforeUpdate } from 'svelte'
  import Fuse from 'fuse.js'
  import {
    activities,
    state,
    activityTypes,
    activityAges,
    activitySizes,
    activityLanguages,
    activityLocations,
  } from '../store'
  import type { Activity } from '../store'
  import ListItem from '../lib/ListItem.svelte'

  interface SearchResult {
    score: number
    item: Activity
  }

  const options = {
    includeScore: true,
    threshold: 0.4,
    keys: ['title.da'],
  }

  let query = ''
  let fuse = null
  let result: null | SearchResult[] = null

  activities.subscribe((value) => {
    fuse = new Fuse(value, options)
  })

  let filtered: Activity[]
  let typeSelected: string[] = []
  let ageSelected: string[] = []
  let sizeSelected: string[] = []
  let languageSelected: string[] = []
  let locationSelected: string[] = []

  beforeUpdate(() => {
    if (result) {
      filtered = result.map((hit) => hit.item)
    } else {
      filtered = $activities
    }

    if (typeSelected.length > 0) {
      filtered = filtered.filter((item) =>
        item.type.some((x) => typeSelected.includes(x) || x === 'any')
      )
    }

    if (locationSelected.length > 0) {
      filtered = filtered.filter((item) => locationSelected.includes(item.location.id))
    }

    if (ageSelected.length > 0) {
      filtered = filtered.filter((item) =>
        item.age.some((x) => ageSelected.includes(x) || x === 'Alle')
      )
    }

    if (sizeSelected.length > 0) {
      filtered = filtered.filter((item) =>
        item.size.some((x) => sizeSelected.includes(x) || x === 'Alle')
      )
    }

    if (languageSelected.length > 0) {
      filtered = filtered.filter(
        (item) =>
          (languageSelected.includes('danish') && item.danish) ||
          (languageSelected.includes('english') && item.english)
      )
    }
  })
</script>

<h1 class="mb-2 text-lg">Aktiviteter</h1>
<div class="mb-4 border-t-4 border-dashed border-gray-400" />

<div class="flex flex-col gap-y-4">
  <div class="flex flex-col gap-y-4 md:flex-row md:items-end md:gap-y-0 md:gap-x-4">
    <input
      type="search"
      bind:value={query}
      on:input={() => {
        if (query) {
          result = fuse.search(query)
        } else {
          result = null
        }
      }}
      class="w-64 border-2 border-dashed border-gray-400 p-3 outline-none focus:border-blue-500"
      placeholder="Søg efter aktivitet"
    />

    {#if $activityLocations}
      <div class="">
        <div class="text-gray-400">Sted</div>
        <div class="flex flex-row gap-x-1 border-2 border-dashed border-gray-400 p-3 md:gap-x-2 justify-between">
          {#each $activityLocations[$state.lang] as option}
            <label class="flex cursor-pointer gap-x-2">
              <input
                bind:group={locationSelected}
                value={option.key}
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text select-none">{option.value}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  {#if $activityTypes}
    <div class="">
      <div class="text-gray-400">Aktivitetstype</div>
      <div
        class="grid grid-cols-2 gap-y-2 border-2 border-dashed border-sl-turquis p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {#each $activityTypes[$state.lang] as option}
          <label class="flex cursor-pointer gap-x-2">
            <input bind:group={typeSelected} value={option.key} type="checkbox" class="checkbox" />
            <span class="label-text select-none">{option.value}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <div class="flex flex-col gap-y-4 md:flex-row md:gap-y-0 md:gap-x-4">
    {#if $activityAges}
      <div class="md:w-1/2">
        <div class="text-gray-400">Alder</div>
        <div
          class="flex flex-row justify-between border-2 border-dashed border-sl-yellow px-1 py-3 md:px-3"
        >
          {#each $activityAges as option}
            <label class="flex cursor-pointer gap-x-1 md:gap-x-2">
              <input bind:group={ageSelected} value={option} type="checkbox" class="checkbox" />
              <span class="label-text select-none whitespace-nowrap">{option}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    <div class="flex w-full flex-col gap-x-4 gap-y-4 sm:flex-row md:w-1/2">
      {#if $activitySizes}
        <div class="sm:w-1/2">
          <div class="text-gray-400">Egnet til</div>
          <div class="flex flex-row justify-between border-2 border-dashed border-sl-flamingo p-3">
            {#each $activitySizes[$state.lang] as option}
              <label class="flex cursor-pointer gap-x-2">
                <input
                  bind:group={sizeSelected}
                  value={option.key}
                  type="checkbox"
                  class="checkbox"
                />
                <span class="label-text select-none whitespace-nowrap">{option.value}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}

      {#if $activityLanguages}
        <div class="sm:w-1/2">
          <div class="text-gray-400">Foregår på</div>
          <div class="flex flex-row justify-between border-2 border-dashed border-gray-400 p-3">
            {#each $activityLanguages[$state.lang] as option}
              <label class="flex cursor-pointer gap-x-2">
                <input
                  bind:group={languageSelected}
                  value={option.key}
                  type="checkbox"
                  class="checkbox"
                />
                <span class="label-text select-none whitespace-nowrap">{option.value}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<section class="my-10">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each filtered as activity}
      <ListItem {...activity} {activityTypes} {activityAges} lang={$state.lang} id={activity.id} />
    {/each}
  </div>
</section>
