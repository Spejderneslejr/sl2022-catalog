<script lang="ts">
  import { link } from 'svelte-spa-router'
  export let id: number
  export let identifier: number
  export let available: number
  export let capacity: number
  export let dropin: boolean
  export let signup: boolean
  export let ontime: boolean
  export let dropinStatus: string
  export let lang: string
  export let title: { da: string; en: string }
  export let summary: { da: string; en: string }
  export let image: string | null
  export let strings: Record<string, string>
</script>

<a
  use:link={`/activity/${id}`}
  class="delay-50 duration-50 card bordered card-side card-compact transform-gpu shadow-sm transition ease-in-out hover:scale-105"
  id="activity-{id}"
  tabindex="0"
>
  <figure class="px-4 pt-4" style="align-items: start">
    <img
      src={image ?? 'https://aktiviteter.sl22.dk/images/default.webp'}
      alt={title[lang]}
      class="mb-3 h-40 w-40"
    />
  </figure>
  <div class="py-3 pr-3">
    <div class="card-title text-base leading-snug">{title[lang]}</div>
    <p class="my-0 text-xs">{@html summary[lang]}</p>

    {#if ontime || dropin}
      {#if ontime}
        <div
          class="absolute bottom-7 -left-7 rotate-45 bg-emerald-200 px-7 text-sm leading-5 text-gray-500"
        >
          {strings.ontime}
        </div>
      {:else}
        <div
          class="absolute bottom-3 -left-5 rotate-45 bg-purple-200 px-5 text-sm leading-5 text-gray-500"
        >
          {strings.dropin}
        </div>
      {/if}
    {/if}

    {#if signup && !dropin && !ontime}
      <div
        class="absolute bottom-5 -left-6 rotate-45 bg-amber-200 px-5 text-sm leading-5 text-gray-500"
      >
        {strings.signupshort}
      </div>
    {/if}

    {#if signup && ontime}
      <div
        class="absolute bottom-4 -left-6 rotate-45 bg-amber-200 px-6 text-xs leading-5 text-gray-500"
      >
        {strings.signupshort}
      </div>
    {/if}

    {#if signup && dropin && !ontime}
      <div
        class="absolute bottom-7 -left-7 rotate-45 bg-amber-200 px-8 text-sm leading-5 text-gray-500"
      >
        {strings.signupshort}
      </div>
    {/if}

    {#if signup}
      {#if available <= 0}
        <div class="absolute bottom-2 right-14 rounded-sm bg-red-200 p-1 text-sm">
          {strings.full}
        </div>
      {:else if available / capacity < 0.1}
        <div class="absolute bottom-2 right-14 rounded-sm bg-red-200 p-1 text-sm">
          {strings.few}
        </div>
      {/if}
    {/if}

    {#if identifier}
      {#if dropin && dropinStatus}
        {#if dropinStatus === 'red'}
          <div class="absolute bottom-2 right-2 rounded-sm bg-red-400 p-1 text-sm text-white">
            {identifier}
          </div>
        {/if}
        {#if dropinStatus === 'yellow'}
          <div class="absolute bottom-2 right-2 rounded-sm bg-yellow-400 p-1 text-sm text-white">
            {identifier}
          </div>
        {/if}
        {#if dropinStatus === 'green'}
          <div class="absolute bottom-2 right-2 rounded-sm bg-green-400 p-1 text-sm text-white">
            {identifier}
          </div>
        {/if}
      {:else}
        <div class="absolute bottom-2 right-2 rounded-sm bg-slate-100 p-1 text-sm">
          {identifier}
        </div>
      {/if}
    {/if}
  </div>
</a>
