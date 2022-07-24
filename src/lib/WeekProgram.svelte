<script lang="ts">
  import { getContext } from 'svelte'
  import dayjs from 'dayjs'
  import 'dayjs/locale/da' // import locale
  import type { Dayjs } from 'dayjs'
  import type { Config, Timeslot } from '../store'
  import WeekProgramItem from './WeekProgramItem.svelte'
  export let identifier: number
  export let timeslots: Timeslot[]
  export let strings: Record<string, string>
  export let config: Config
  interface day {
    date: Dayjs
    timeslots: Timeslot[]
  }

  const lang: string = getContext('lang')
  dayjs.locale(lang)

  const noqueue: boolean = getContext('noqueue')

  let days: day[] = []
  let start = dayjs('2022-07-24').hour(8).minute(0)

  for (let x = 0; x < 7; x++) {
    days.push({
      date: start,
      timeslots: timeslots.filter((ts) => ts.start.day() === start.day()),
    })
    start = start.add(1, 'day')
  }

  function signupUrl(timeslot: Timeslot): string {
    let signUpUrl = `https://${config.odoo}/${lang}/sl2022/activities/instance/${timeslot.id}`

    /*
      if (!noqueue) {
      const encodeSignUpUrl = encodeURIComponent(signUpUrl)
      signUpUrl = `https://spejderneslejr.queue-it.net/?c=spejderneslejr&e=spejderneslejr&t=${encodeSignUpUrl}`
    }
    */

    return signUpUrl
  }
</script>

<div class="mt-4">
  <div class="flex flex-col justify-between border-b-2 border-gray-200 pb-2 md:flex-row">
    <div class="justify-self-start text-lg font-medium">{strings.programheader}</div>
    <div class="flex-cols mt-4 flex gap-x-4 text-xs md:mt-0 md:gap-x-8 md:text-sm">
      <div class="flex items-center gap-x-2">
        <div class="inline-block h-6 w-6 bg-red-500" />
        <div>{strings.cancelled}</div>
      </div>
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

        {#each day.timeslots as timeslot}
          {#if config.signup && timeslot.id && timeslot.available > 0}
            <a href={signupUrl(timeslot)} title={strings.signup_button}>
              <WeekProgramItem {timeslot} {strings} />
            </a>
          {:else}
            <WeekProgramItem {timeslot} {strings} />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>
