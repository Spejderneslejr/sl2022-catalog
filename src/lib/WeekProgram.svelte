<script lang="ts">
  import { getContext } from 'svelte'
  import dayjs from 'dayjs'
  import 'dayjs/locale/da' // import locale
  import type { Timeslot } from '../store'
  export let timeslots: Timeslot[]
  export let strings

  const lang: string = getContext('lang')

  dayjs.locale(lang)

  timeslots = timeslots.map((item) => {
    item.start = dayjs(item.start)
    return item
  })

  const firstHour =
    timeslots.reduce(
      (previousValue, currentValue) =>
        currentValue.start.hour() < previousValue ? currentValue.start.hour() : previousValue,
      24
    ) - 1

  const lastHour =
    timeslots.reduce(
      (previousValue, currentValue) =>
        currentValue.start.add(currentValue.duration, 'minute').hour() > previousValue
          ? currentValue.start.add(currentValue.duration, 'minute').hour()
          : previousValue,
      0
    ) + 2

  let days = []
  let start = dayjs('2022-07-24')
  for (let x = 0; x < 7; x++) {
    days.push({ date: start, intervals: intervals(start) })
    start = start.add(1, 'day')
  }

  function intervals(day) {
    let intervals = []
    start = day.hour(firstHour).minute(0)
    while (start.hour() < lastHour) {
      const slots = timeslots.filter((item) => start.isSame(item.start))
      intervals.push({ start, slots })
      start = start.add(5, 'minute')
    }

    return intervals
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

  <div class="mt-2 grid grid-cols-8 gap-x-1 text-xs md:grid-cols-calendar md:gap-x-4">
    <div class="text-left">
      <div style="height:24px">&nbsp;</div>
      {#each intervals(dayjs()) as interval}
        <div style="height:5px">
          {interval.start.minute() === 0 ? interval.start.format('HH:mm') : ''}
        </div>
      {/each}
    </div>

    {#each days as day}
      <div class="">
        <div class="border-l-2 border-gray-200 py-1 pl-1 text-center capitalize">
          <span class="md:hidden">
            {day.date.format('ddd')}
          </span>
          <span class="hidden md:block">
            {day.date.format('dddd')}
          </span>
        </div>

        {#each day.intervals as interval}
          <div style="height:5px" class="border-l-2 border-gray-200 pl-1">
            <div class="flex flex-row justify-center md:gap-x-1">
              {#each interval.slots as slot}
                {#if slot.type === 'dropin'}
                  <div style="height:{slot.duration}px" class="bg-purple-200">
                    <div class="mt-2 w-5 rotate-90 whitespace-nowrap md:mt-5 md:w-10">
                      {slot.start.format('HH:mm')} - {slot.start
                        .add(slot.duration, 'minute')
                        .format('HH:mm')}
                    </div>
                  </div>
                {:else if slot.type === 'ontime'}
                  <div style="height:{slot.duration}px" class="bg-emerald-200">
                    <div class="rotate-90 whitespace-nowrap w-5 md:w-10 mt-2 md:mt-5">
                      {slot.start.format('HH:mm')} - {slot.start
                        .add(slot.duration, 'minute')
                        .format('HH:mm')}
                    </div>
                  </div>
                {:else}
                  <div style="height:{slot.duration}px" class="bg-amber-200">
                    <div class="rotate-90 whitespace-nowrap w-5 md:w-10 mt-2 md:mt-5">
                      {slot.start.format('HH:mm')} - {slot.start
                        .add(slot.duration, 'minute')
                        .format('HH:mm')}
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
