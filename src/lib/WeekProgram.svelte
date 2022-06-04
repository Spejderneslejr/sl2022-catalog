<script lang="ts">
  import { getContext } from 'svelte'
  import dayjs from 'dayjs'
  import 'dayjs/locale/da' // import locale
  import type { Timeslot } from '../store'
  export let timeslots: Timeslot[]
  export let strings: Record<string, string>

  const lang: string = getContext('lang')

  dayjs.locale(lang)

  let days = []
  let start = dayjs('2022-07-24').hour(8).minute(0)

  for (let x = 0; x < 7; x++) {
    const slots = timeslots.filter((ts) => ts.start.day() === start.day())
    days.push({ date: start, slots })
    start = start.add(1, 'day')
  }
</script>

<div class="mt-4">
  <div class="flex flex-col justify-between border-b-2 border-gray-200 pb-2 md:flex-row">
    <div class="justify-self-start text-lg font-medium">{strings.programheader}</div>
    <div class="flex-cols mt-4 flex gap-x-4 text-xs md:mt-0 md:gap-x-8 md:text-sm">
      <div class="flex items-center gap-x-2">
        <div class="inline-block h-6 w-6 bg-amber-200" />
        <div>{strings.signup}</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="inline-block h-6 w-6 bg-purple-200" />
        <div>{strings.dropin}</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="inline-block h-6 w-6 bg-emerald-200" />
        <div>{strings.ontime}</div>
      </div>
    </div>
  </div>

  <div class="order-gray-200 grid grid-cols-7  border-b-2 text-xs">
    {#each days as day}
      <div class="border-l-2 border-gray-200 last-of-type:border-r-2">
        <div class="border-b-2 border-gray-200 p-4 text-center capitalize">
          <span class="md:hidden">
            {day.date.format('ddd')} ({day.date.format('D/M')})
          </span>
          <span class="hidden md:block">
            {day.date.format('dddd')} ({day.date.format('D/M')})
          </span>
        </div>

        {#each day.slots as slot}
          <div
            class="m-2 p-2 text-center"
            class:bg-amber-200={slot.type === 'signup'}
            class:bg-emerald-200={slot.type === 'ontime'}
            class:bg-purple-200={slot.type === 'dropin' && slot.type !== 'ontime'}
          >
            {slot.start.format('HH:mm')} - {#if slot.end.day() > slot.start.day() && slot.end.hour() > 0}
              {slot.end.format('D/M')}
            {/if}
            {#if slot.end.hour() > 0}
              {slot.end.format('HH:mm')}
            {:else}
              24:00
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
