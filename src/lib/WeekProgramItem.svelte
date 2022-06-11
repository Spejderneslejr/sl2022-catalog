<script lang="ts">
  import Fa from 'svelte-fa'
  import { faUserPlus, faUserSlash } from '@fortawesome/free-solid-svg-icons'
  import type { Timeslot } from '../store'
  export let identifier: number
  export let timeslot: Timeslot
  export let strings: Record<string, string>

  let className: string
  switch (timeslot.type) {
    case 'signup': {
      className =
        timeslot.available < 1
          ? 'bg-amber-200 cursor-not-allowed'
          : 'bg-amber-200 hover:bg-amber-300'
      break
    }
    case 'ontime': {
      className = 'bg-emerald-200'
      break
    }
    default: {
      className = 'bg-purple-200'
    }
  }
</script>

<div class={`group relative m-1 flex justify-evenly p-1 text-center md:m-2 md:p-2 ${className}`}>
  {timeslot.start.format('HH:mm')} - {#if timeslot.end.day() > timeslot.start.day() && timeslot.end.hour() > 0}
    {timeslot.end.format('D/M')}
  {/if}
  {#if timeslot.end.hour() > 0}
    {timeslot.end.format('HH:mm')}
  {:else}
    24:00
  {/if}
  {#if timeslot.type === 'signup' && timeslot.available < 1 && identifier !== 1046}
    <Fa class="hidden md:inline-block" icon={faUserSlash} />
    <div
      class="absolute right-0 hidden w-full bg-amber-200 text-center text-sm md:group-hover:inline-block"
    >
      {strings.full}
    </div>
  {/if}
  {#if timeslot.type === 'signup' && timeslot.available > 1 && identifier !== 1046}
    <Fa class="hidden md:inline-block" icon={faUserPlus} />
  {/if}
</div>
