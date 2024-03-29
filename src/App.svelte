<script lang="ts">
  import { setContext } from 'svelte'
  import Router from 'svelte-spa-router'
  import routes from './routes'
  import dayjs from 'dayjs'
  import { useSWR } from 'sswr'
  import {
    activities,
    activityTypes,
    activityAges,
    activitySizes,
    activityLanguages,
    activityLocations,
    config,
    type Timeslot,
    type Activity,
  } from './store'
  import * as translation from './translation.json'

  const [html] = document.getElementsByTagName('html')
  const lang = html.getAttribute('lang')
  setContext('lang', lang)
  setContext('strings', translation[lang])

  const searchParams = new URLSearchParams(window.location.search)
  setContext('noqueue', searchParams.has('noqueue'))

  const apiUrl =
    window.location.hostname === 'spejderneslejr.dk'
      ? 'https://aktiviteter.sl22.dk/api/activities'
      : 'https://test-t6dnbai-7qektsweefnaa.de-2.platformsh.site/api/activities'

  const { data: request } = useSWR(apiUrl, {
    dedupingInterval: 300,
    revalidateOnReconnect: true,
  })

  request.subscribe((value) => {
    if (value) {
      const mappedActivities = value.data.map((activity: Activity) => {
        if (activity.timeslots) {
          activity.timeslots = activity.timeslots.map((item) => {
            item.start = dayjs(item.start)
            item.end = item.start.clone().add(item.duration, 'minute')
            return item
          })
          activity.timeslots.sort(compareType)
          activity.timeslots.sort(compareStart)
        }
        return activity
      })

      config.set({ signup: value.meta.signup, odoo: value.meta.odoo })
      // config.set({ signup: false, odoo: value.meta.odoo })
      activities.set(mappedActivities)
      activityTypes.set(value.meta.types)
      activityLocations.set(value.meta.locations)
      activityAges.set(value.meta.ages)
      activitySizes.set(value.meta.sizes)
      activityLanguages.set(value.meta.languages)
    }
  })

  function compareStart(a: Timeslot, b: Timeslot) {
    if (a.start.isBefore(b.start)) {
      return -1
    }
    if (a.start.isAfter(b.start)) {
      return 1
    }
    return 0
  }

  function compareType(a: Timeslot, b: Timeslot) {
    if (a.type > b.type) {
      return -1
    }
    if (a.type < b.type) {
      return 1
    }
    return 0
  }
</script>

<section class="mx-auto max-w-6xl text-gray-900">
  <Router {routes} restoreScrollState={true} />
</section>
