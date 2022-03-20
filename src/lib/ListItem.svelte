<script lang="ts">
  import { link } from 'svelte-spa-router'
  import type { Location } from '../store'
  export let lang: string
  export let id: number
  export let title: { da: string; en: string }
  export let type: string[]
  export let age: string[]
  export let description: { da: string; en: string }
  export let images: { sm: string; md: string; lg: string }
  export let activityTypes
  export let activityAges
  export let area: string | null
  export let location: Location
  export let size: string[]

  $: types = getTypes(type, $activityTypes[lang])

  function getTypes(types, allTypes) {
    let res = []
    for (const t of types) {
      const value = allTypes.find((item) => item.key === t)
      if (value) {
        res.push(value)
      }
    }
    return res
  }

  $: ages = getAges(age, $activityAges)

  function getAges(ages, allAges) {
    let res = []
    for (const t of ages) {
      const value = allAges.find((item) => item === t)
      if (value) {
        res.push(value)
      }
    }
    return res
  }
</script>

<a use:link={`/activity/${id}`} class="card bordered bg-slate-50" id="activity-{id}">
  <figure>
    <img src={images.sm} alt={title[lang]} class="w-full" />
  </figure>
  <div class="card-body">
    <div class="card-title truncate">{title[lang]}</div>
    <p class="text-xs line-clamp-4">{@html description[lang]}</p>
    <div class="flex flex-row justify-end bottom-1 right-2 absolute">
      {#each ages as t}<div class="badge badge-outline text-sl-yellow">{t}</div> {/each}
      {#each types as t}<div class="badge badge-outline text-sl-turquis">{t.value}</div> {/each}
      <div />
    </div>
    <div class="card-actions">
      <button class="btn btn-sm btn-primary">Tilmelding</button>
    </div>
  </div>
</a>
