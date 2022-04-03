<script type="ts">
  import { link } from 'svelte-spa-router'
  export let params: { id?: string } = {}
  import { activities } from '../store'
  import type { Activity } from '../store'
  import ActivityMap from '../lib/ActivityMap.svelte'

  let activity: Activity
  const unsubscribe = activities.subscribe((value) => {
    activity = value.find((item) => item.id.toString() === params.id)
  })
</script>

<div class="flex flex-col">
  {#if activity}
    <a class="text-sm" use:link={'/'}>Tilbage til listen</a>
    <h1 class="mb-2 text-lg">{activity.title.da}</h1>
    <div class="mb-4 border-t-4 border-dashed border-gray-400" />
    <div class="flex flex-col gap-x-10 gap-y-10 sm:flex-row sm:gap-y-0">
      <img
        class="h-96 w-full object-cover sm:w-1/3"
        src={activity.images.sm}
        alt={activity.title.da}
      />
      <div class="mb-2 max-w-xl">{@html activity.description.da}</div>
    </div>
    <div class="mt-4">
      <ActivityMap {activity} />
    </div>
  {:else}
    <p class="loading">loading...</p>
  {/if}
</div>
