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
  export let danish: boolean
  export let english: boolean

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

<a
  use:link={`/activity/${id}`}
  class="delay-50 duration-50 card bordered card-side card-compact transform-gpu shadow-sm transition ease-in-out hover:scale-105"
  id="activity-{id}"
>
  <figure class="p-4">
    <img src={images.sm} alt={title[lang]} class="h-40 w-40" />
  </figure>
  <div class="py-3 pr-3">
    <div class="card-title text-base">{title[lang]}</div>
    <p class="text-xs line-clamp-6">{@html description[lang]}</p>
  </div>
</a>
