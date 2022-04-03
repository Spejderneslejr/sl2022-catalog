<script type="ts">
  import { link } from 'svelte-spa-router'
  export let params: { id?: string } = {}
  import { activities, activitySizes, activityTypes, activityLocations, state } from '../store'
  import type { Activity } from '../store'
  import ActivityMap from '../lib/ActivityMap.svelte'

  let activity: Activity
  let sizes: string[] | Boolean
  let types: string[] | Boolean

  const unsubscribe = activities.subscribe((value) => {
    activity = value.find((item) => item.id.toString() === params.id)
  })

  $: sizes = getValues('size', $state, activity, $activitySizes)
  $: types = getValues('type', $state, activity, $activityTypes)

  function getValues(fieldName, state, activity, allSizes) {
    if (!state || !activity || !allSizes) {
      return false
    }
    let res = []
    for (const t of activity[fieldName]) {
      const found = allSizes[state.lang].find((item) => item.key === t)
      if (found) {
        res.push(found.value)
      }
    }
    return res.length > 0 ? res : false
  }
</script>

<div class="flex flex-col">
  {#if activity && state}
    <a class="text-sm" use:link={'/'}>Tilbage til listen</a>
    <div class="mb-4 border-t-4 border-dashed border-gray-400" />
    <div class="flex flex-col gap-x-10 gap-y-10 sm:flex-row sm:gap-y-0">
      <img
        class="h-96 w-full object-cover sm:w-1/3"
        src={activity.images.md}
        alt={activity.title.da}
      />

      <div class="flex flex-col gap-y-2">
        <h1 class="mb-2 text-lg">{activity.title.da}</h1>
        
        <div class="flex">
          <span>Sted:</span><span class="">
            <span class="ml-3 border-2 border-dotted border-gray-400 px-1"
            >{activity.area[$state.lang]}</span
            >
          </span>
        </div>
        
        {#if types}
        <div class="flex">
          <span>Aktivitetstype:</span><span class="">
            {#each types as type}
            <span class="ml-3 border-2 border-dotted border-sl-turquis px-1">{type}</span>
            {/each}
          </span>
        </div>
        {/if}
        
        <div class="flex">
        
        <span>Alder:</span><span class="">
            {#each activity.age as age}
              <span class="ml-3 border-2 border-dotted border-sl-yellow px-1">{age}</span>
            {/each}
          </span>
        </div>

        {#if sizes}
          <div class="flex">
            <span>Egnet til:</span><span class="">
              {#each sizes as size}
                <span class="ml-3 border-2 border-dotted border-sl-flamingo px-1">{size}</span>
              {/each}
            </span>
          </div>
        {/if}

        <div class="flex">
          <span>Foregår på:</span><span class="">
            {#if activity.danish}
              <span class="ml-3 border-2 border-dotted border-gray-400 px-1">Dansk</span>
            {/if}
            {#if activity.english}
              <span class="ml-3 border-2 border-dotted border-gray-400 px-1">Engelsk</span>
            {/if}
          </span>
        </div>

        <div class="mb-2 max-w-xl">{@html activity.description.da}</div>
      </div>
    </div>
    <div class="mt-4">
      <ActivityMap {activity} />
    </div>
  {:else}
    <p class="loading">loading...</p>
  {/if}
</div>
