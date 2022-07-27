<script lang="ts">
  import { beforeUpdate } from 'svelte'
  import Fuse from 'fuse.js'
  import { getContext } from 'svelte'
  import dayjs from 'dayjs'
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
  import ResetSearch from '../lib/ResetSearch.svelte'

  interface SearchResult {
    score: number
    item: Activity
  }

  const [html] = document.getElementsByClassName(
    'paragraph--type--text'
  ) as HTMLCollectionOf<HTMLElement>
  if (html) {
    html.style.display = 'block'
  }

  const [download] = document.getElementsByClassName(
    'paragraph--type--download'
  ) as HTMLCollectionOf<HTMLElement>
  if (download) {
    download.style.display = 'block'
  }

  const lang: string = getContext('lang')
  const strings: Record<string, string> = getContext('strings')

  const options = {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.16,
    minMatchCharLength: 2,
    keys: ['title.' + lang, 'description.' + lang, 'identifier'],
  }

  let query = ''
  let fuse = null
  let result: null | SearchResult[] = null
  let advanced: boolean = false
  let orderByStatus: boolean = true
  let orderByAvailability: boolean = true
  let onlyToday: boolean = false
  let inCamp: boolean = false

  let patches: boolean = false
  let patchSelected = 'p0'
  let friendshipAwardSelected = false

  let typeSelected: string[] = []
  let ageSelected: string[] = []
  let sizeSelected: string[] = []
  let languageSelected: string[] = []
  let locationSelected: string[] = []
  let enrolmentSelected: string[] = []
  let areaSelected: string = 'a0'

  search.subscribe((value) => {
    query = value.query
    typeSelected = value.typeSelected
    ageSelected = value.ageSelected
    sizeSelected = value.sizeSelected
    languageSelected = value.languageSelected
    locationSelected = value.locationSelected
    areaSelected = value.areaSelected ? value.areaSelected : 'a0'
    enrolmentSelected = value.enrolmentSelected
    advanced = value.advanced
    orderByStatus = value.orderByStatus
    orderByAvailability = value.orderByAvailability
    onlyToday = value.onlyToday
    patchSelected = value.patchSelected ? value.patchSelected : 'p0'
    friendshipAwardSelected = value.friendshipAwardSelected
    patches = value.patches
  })

  let total: number

  activities.subscribe((value) => {
    fuse = new Fuse(value, options)
    total = value.length
  })

  let filtered: Activity[]

  beforeUpdate(() => {

    inCamp = locationSelected.length === 1 && locationSelected.includes('lejren')

    if (query.length > 1) {
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

    if (inCamp && areaSelected !== 'a0') {
      filtered = filtered.filter((item) => item.area[lang] === strings[areaSelected])
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
          (enrolmentSelected.includes('without-signup') && (item.dropin || item.ontime))
      )
    }

    // Filter - only today
    if (onlyToday) {
      const now = dayjs()
      filtered = filtered.filter((item) =>
        item.timeslots?.find((ts) => ts.start.isSame(now, 'day'))
      )
    }

    // Filter - patches
    if (patchSelected !== 'p0') {
      filtered = filtered.filter((item) => item.patch === patchSelected)
    }

    // Filter - friendship award
    if (friendshipAwardSelected) {
      filtered = filtered.filter((item) => item.friendship_award && friendshipAwardSelected)
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

    // Sort by red/yellow/green status
    if (
      orderByStatus &&
      (enrolmentSelected.length !== 1 || enrolmentSelected.includes('without-signup'))
    ) {
      const order = {
        green: 1,
        yellow: 2,
        red: 3,
        null: 2,
      }
      filtered = filtered.slice().sort((a, b) => {
        if (order[a.dropinStatus] < order[b.dropinStatus]) {
          return -1
        }
        if (order[a.dropinStatus] > order[b.dropinStatus]) {
          return 1
        }
        return 0
      })
    }

    // Sort by availability
    if (
      orderByAvailability &&
      enrolmentSelected.length === 1 &&
      enrolmentSelected.includes('signup')
    ) {
      filtered = filtered.slice().sort((a, b) => {
        if (a.available > b.available) {
          return -1
        }
        if (a.available < b.available) {
          return 1
        }
        return 0
      })
    }

    search.set({
      query,
      typeSelected,
      ageSelected,
      sizeSelected,
      languageSelected,
      locationSelected,
      areaSelected,
      enrolmentSelected,
      advanced,
      orderByStatus,
      orderByAvailability,
      onlyToday,
      patchSelected,
      friendshipAwardSelected,
      patches,
    })
  })
</script>

<div class="flex flex-col gap-y-4">
  <div class="flex flex-col gap-y-4 md:flex-row md:items-end md:gap-y-0 md:gap-x-4">
    <input
      type="search"
      style="-webkit-appearance: none"
      bind:value={query}
      class="grow border-2 border-dashed border-gray-400 p-3 outline-none focus:border-blue-500"
      placeholder={strings.search}
    />

    {#if $activityLocations}
      <div>
        <div class="mb-1">{strings.location}</div>
        <div
          class="grid grid-cols-3 gap-y-2 border-2 border-dashed border-gray-400 p-3 md:flex md:flex-row md:gap-x-2"
        >
          {#each $activityLocations[lang] as option}
            {#if !inCamp || (inCamp && option.key === 'lejren')}
              <label class="flex cursor-pointer gap-x-2">
                <input
                  bind:group={locationSelected}
                  value={option.key}
                  type="checkbox"
                  class="checkbox"
                />
                <span class="label-text select-none ">{option.value}</span>
              </label>
            {/if}
          {/each}
          <div class="colspan-2">
            {#if inCamp}
              <select bind:value={areaSelected} class="select select-bordered px-4">
                {#each ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a15', 'a16', 'a17', 'a18', 'a19', 'a21', 'a22', 'a23'] as val}
                  <option value={val}>{strings[val]}</option>
                {/each}
              </select>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="">
      <div class="mb-1">{strings.enrolment}</div>
      <div
        class="flex flex-row justify-between gap-x-2 border-2 border-dashed border-gray-400 p-3 text-sm"
      >
        {#each ['signup', 'without-signup'] as option}
          <label class="flex cursor-pointer gap-x-2">
            <input bind:group={enrolmentSelected} value={option} type="checkbox" class="checkbox" />
            <span class="label-text select-none ">{strings[option]}</span>
          </label>
        {/each}
      </div>
    </div>
  </div>

  <div class="collapse-arrow collapse border border-base-300">
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
                <span class="label-text select-none ">{option.value}</span>
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
              class="grid grid-cols-3 gap-x-2 gap-y-2 border-2 border-dashed border-sl-yellow p-3 md:grid-cols-6"
            >
              {#each $activityAges as option}
                <label class="flex cursor-pointer gap-x-2">
                  <input bind:group={ageSelected} value={option} type="checkbox" class="checkbox" />
                  <span class="label-text select-none whitespace-nowrap ">{option}</span>
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
                    <span class="label-text select-none whitespace-nowrap ">{option.value}</span>
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
                    <span class="label-text select-none whitespace-nowrap ">{option.value}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div class="collapse-arrow collapse border border-base-300">
    <input type="checkbox" bind:checked={patches} />
    <div class="collapse-title text-lg font-medium">
      {strings.patches}
    </div>
    <div class="collapse-content flex flex-col gap-y-2">
      <div class="mb-1">{strings.patch}</div>
      <div
        class="grid grid-cols-2 gap-y-2 border-2 border-dashed border-gray-400 p-3 md:grid-cols-3"
      >
        {#each ['p0', 'p1', 'p2', 'p3', 'p4', 'p5'] as option}
          <label class="flex cursor-pointer gap-x-2">
            <input bind:group={patchSelected} value={option} type="radio" class="checkbox" />
            <span class="label-text select-none ">{strings[option]}</span>
          </label>
        {/each}
      </div>

      <div class="border-2 border-dashed border-gray-400 p-3">
        <label class="flex cursor-pointer gap-x-2">
          <input bind:checked={friendshipAwardSelected} type="checkbox" class="checkbox" />
          <span class="label-text select-none whitespace-nowrap ">{strings.fa}</span>
        </label>
      </div>
    </div>
  </div>

  <div class="flex flex-col justify-between gap-y-4 md:flex-row md:gap-y-0">
    {#if enrolmentSelected.length !== 1 || enrolmentSelected.includes('without-signup')}
      <div class="flex flex-row gap-8">
        <label class="flex cursor-pointer gap-x-2 md:ml-4">
          <input bind:checked={orderByStatus} type="checkbox" class="checkbox" />
          <span class="label-text select-none whitespace-nowrap ">{strings.sort_by_status}</span>
        </label>

        <label class="flex cursor-pointer gap-x-2 md:ml-4">
          <input bind:checked={onlyToday} type="checkbox" class="checkbox" />
          <span class="label-text select-none whitespace-nowrap ">{strings.only_today}</span>
        </label>
      </div>

      <div class="flex flex-row justify-between gap-x-4">
        <div class="bg-green-400 py-1 px-3 text-white">{strings.not_busy}</div>
        <div class="bg-yellow-400 py-1 px-3 text-white">{strings.medium_busy}</div>
        <div class="bg-red-400 py-1 px-3 text-white">{strings.very_busy}</div>
      </div>
    {/if}

    {#if enrolmentSelected.length === 1 && enrolmentSelected.includes('signup')}
      <div class="flex flex-row gap-8">
        <label class="flex cursor-pointer gap-x-2 md:ml-4">
          <input bind:checked={orderByAvailability} type="checkbox" class="checkbox" />
          <span class="label-text select-none whitespace-nowrap "
            >{strings.sort_by_availability}</span
          >
        </label>

        <label class="flex cursor-pointer gap-x-2 md:ml-4">
          <input bind:checked={onlyToday} type="checkbox" class="checkbox" />
          <span class="label-text select-none whitespace-nowrap ">{strings.only_today}</span>
        </label>
      </div>
    {/if}

    <ResetSearch {strings} />
  </div>

  {#if filtered}
    <div class="md:ml-4">{strings.displaying} {filtered?.length} {strings.of} {total}</div>
  {/if}
</div>

<section class="my-10">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each filtered as activity}
      <ListItem
        id={activity.id}
        identifier={activity.identifier}
        dropin={activity.dropin}
        signup={activity.signup}
        ontime={activity.ontime}
        dropinStatus={activity.dropinStatus}
        {lang}
        {strings}
        title={activity.title}
        summary={activity.summary}
        image={activity.images.sm}
        capacity={activity.capacity}
        available={activity.available}
      />
    {/each}
  </div>
</section>
