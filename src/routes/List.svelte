<script lang="ts">
  import { beforeUpdate } from 'svelte'
  import Fuse from 'fuse.js'
  import { getContext } from 'svelte'
  import {
    activities,
    activityTypes,
    activityAges,
    activitySizes,
    activityLanguages,
    activityLocations,
    search,
  } from '../store'
  import type { Activity } from '../store'
  import ListItem from '../lib/ListItem.svelte'

  interface SearchResult {
    score: number
    item: Activity
  }

  const lang: string = getContext('lang')
  const strings: Record<string, string> = getContext('strings')

  const options = {
    includeScore: true,
    threshold: 0.4,
    minMatchCharLength: 2,
    keys: ['title.' + lang, 'description.' + lang],
  }

  let query = ''
  let fuse = null
  let result: null | SearchResult[] = null
  let advanced: boolean = false

  let typeSelected: string[] = []
  let ageSelected: string[] = []
  let sizeSelected: string[] = []
  let languageSelected: string[] = []
  let locationSelected: string[] = []
  let enrolmentSelected: string[] = []

  search.subscribe((value) => {
    query = value.query
    typeSelected = value.typeSelected
    ageSelected = value.ageSelected
    sizeSelected = value.sizeSelected
    languageSelected = value.languageSelected
    locationSelected = value.locationSelected
    enrolmentSelected = value.enrolmentSelected
    advanced = value.advanced
  })

  activities.subscribe((value) => {
    fuse = new Fuse(value, options)
  })

  let filtered: Activity[]

  beforeUpdate(() => {
    if (query) {
      result = fuse.search(query)
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
        item.size.some((x) => sizeSelected.includes(x) || x === 'any')
      )
    }

    if (languageSelected.length > 0) {
      filtered = filtered.filter(
        (item) =>
          (languageSelected.includes('danish') && item.danish) ||
          (languageSelected.includes('english') && item.english)
      )
    }

    if (enrolmentSelected.length > 0) {
      filtered = filtered.filter(
        (item) =>
          (enrolmentSelected.includes('signup') && item.signup) ||
          (enrolmentSelected.includes('dropin') && item.dropin)
      )
    }
    
    // Slice used to copy the array as sort mutates the array
    filtered = filtered.slice().sort((a, b) => {
      let fa = a.title[lang].toLowerCase(),
        fb = b.title[lang].toLowerCase()
      if (fa < fb) {
        return -1
      }
      if (fa > fb) {
        return 1
      }
      return 0
    })

    search.set({
      query,
      typeSelected,
      ageSelected,
      sizeSelected,
      languageSelected,
      locationSelected,
      enrolmentSelected,
      advanced,
    })
  })
</script>

<div class="flex flex-col gap-y-4">
  <div class="flex flex-col gap-y-4 md:flex-row md:items-end md:gap-y-0 md:gap-x-4">
    <input
      type="search"
      style="-webkit-appearance: none"
      bind:value={query}
      class="w-64 border-2 border-dashed border-gray-400 p-3 outline-none focus:border-blue-500"
      placeholder={strings.search}
    />

    {#if $activityLocations}
      <div class="md:w-1/2">
        <div class="mb-1">{strings.location}</div>
        <div
          class="flex flex-row justify-between gap-x-1 border-2 border-dashed border-gray-400 p-3 md:gap-x-2"
        >
          {#each $activityLocations[lang] as option}
            <label class="flex cursor-pointer gap-x-2">
              <input
                bind:group={locationSelected}
                value={option.key}
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text select-none dark:text-white">{option.value}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    <div class="md:w-1/4">
      <div class="mb-1">{strings.enrolment}</div>
      <div
        class="flex flex-row justify-between gap-x-1 border-2 border-dashed border-gray-400 p-3 md:gap-x-2"
      >
        {#each ['signup', 'dropin'] as option}
          <label class="flex cursor-pointer gap-x-2">
            <input bind:group={enrolmentSelected} value={option} type="checkbox" class="checkbox" />
            <span class="label-text select-none dark:text-white">{strings[option]}</span>
          </label>
        {/each}
      </div>
    </div>
  </div>

  <div class="collapse collapse-arrow border border-base-300">
    <input type="checkbox" bind:checked={advanced} />
    <div class="collapse-title text-xl font-medium">
      {strings.advanced_filters}
    </div>
    <div class="collapse-content flex flex-col gap-y-2">
      {#if $activityTypes}
        <div class="">
          <div class="mb-1">{strings.activity_type}</div>
          <div
            class="grid grid-cols-2 gap-y-2 border-2 border-dashed border-sl-turquis p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {#each $activityTypes[lang] as option}
              <label class="flex cursor-pointer gap-x-2">
                <input
                  bind:group={typeSelected}
                  value={option.key}
                  type="checkbox"
                  class="checkbox"
                />
                <span class="label-text select-none dark:text-white">{option.value}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}

      <div class="flex flex-col gap-y-4 md:flex-row md:gap-y-0 md:gap-x-4">
        {#if $activityAges}
          <div class="md:w-1/2">
            <div class="mb-1">{strings.age}</div>
            <div
              class="flex flex-row justify-between border-2 border-dashed border-sl-yellow px-1 py-3 md:px-3"
            >
              {#each $activityAges as option}
                <label class="flex cursor-pointer gap-x-1 md:gap-x-2">
                  <input bind:group={ageSelected} value={option} type="checkbox" class="checkbox" />
                  <span class="label-text select-none whitespace-nowrap dark:text-white"
                    >{option}</span
                  >
                </label>
              {/each}
            </div>
          </div>
        {/if}

        <div class="flex w-full flex-col gap-x-4 gap-y-4 sm:flex-row md:w-1/2">
          {#if $activitySizes}
            <div class="sm:w-1/2">
              <div class="mb-1">{strings.targetgroup}</div>
              <div
                class="flex flex-row justify-between border-2 border-dashed border-sl-flamingo p-3"
              >
                {#each $activitySizes[lang] as option}
                  <label class="flex cursor-pointer gap-x-2">
                    <input
                      bind:group={sizeSelected}
                      value={option.key}
                      type="checkbox"
                      class="checkbox"
                    />
                    <span class="label-text select-none whitespace-nowrap dark:text-white"
                      >{option.value}</span
                    >
                  </label>
                {/each}
              </div>
            </div>
          {/if}

          {#if $activityLanguages}
            <div class="sm:w-1/2">
              <div class="mb-1">{strings.languagesupport}</div>
              <div class="flex flex-row justify-between border-2 border-dashed border-gray-400 p-3">
                {#each $activityLanguages[lang] as option}
                  <label class="flex cursor-pointer gap-x-2">
                    <input
                      bind:group={languageSelected}
                      value={option.key}
                      type="checkbox"
                      class="checkbox"
                    />
                    <span class="label-text select-none whitespace-nowrap dark:text-white"
                      >{option.value}</span
                    >
                  </label>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<section class="my-10">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each filtered as activity}
      <ListItem
        id={activity.id}
        dropin={activity.dropin}
        signup={activity.signup}
        {lang}
        title={activity.title}
        summary={activity.summary}
        image={activity.images.sm}
      />
    {/each}
  </div>
</section>
