<script lang="ts">
  import { link } from 'svelte-spa-router'
  export let id: number
  export let dropin: boolean
  export let signup: boolean
  export let lang: string
  export let title: { da: string; en: string }
  export let summary: { da: string; en: string }
  export let image: string

  const truncate = (str: string, max: number, suffix: string = '...'): string =>
    str.length < max
      ? str
      : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`
</script>

<a
  use:link={`/activity/${id}`}
  class="delay-50 duration-50 card bordered card-side card-compact transform-gpu shadow-sm transition ease-in-out hover:scale-105"
  id="activity-{id}"
>
  <figure class="px-4 pt-4" style="align-items: start">
    <img src={image} alt={title[lang]} class="h-40 w-40" />
  </figure>
  <div class="py-3 pr-3">
    <div class="card-title text-base">{title[lang]}</div>
    <p class="text-xs">{@html summary[lang]}</p>

    {#if dropin}
      <div
        class="absolute bottom-3 -left-5 rotate-45 bg-gray-400 px-5 text-sm leading-5 text-white"
      >
        Drop-in
      </div>
    {/if}

    {#if signup}
    <div
      class="absolute bottom-5 -left-6 rotate-45 bg-gray-400 px-5 text-sm leading-5 text-white"
    >
      Tilmelding
    </div>
  {/if}
  </div>
</a>
