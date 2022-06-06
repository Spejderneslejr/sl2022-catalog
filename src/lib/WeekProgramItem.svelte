<script lang="ts">
  import type { Timeslot } from '../store'
  export let timeslot: Timeslot
  export let strings: Record<string, string>

  let className
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

<div class={`group relative m-1 p-1 text-center md:m-2 md:p-2 ${className}`}>
  {timeslot.start.format('HH:mm')} - {#if timeslot.end.day() > timeslot.start.day() && timeslot.end.hour() > 0}
    {timeslot.end.format('D/M')}
  {/if}
  {#if timeslot.end.hour() > 0}
    {timeslot.end.format('HH:mm')}
  {:else}
    24:00
  {/if}
  {#if timeslot.type === 'signup' && timeslot.available < 1}
    <div
      class="absolute bottom-0 right-0 hidden h-full w-4 bg-rose-400 group-hover:w-full md:inline-flex"
    >
      <div class="hidden w-full pt-2 text-center text-sm text-white md:group-hover:inline-block">
        {strings.full}
      </div>
    </div>
  {/if}
</div>
