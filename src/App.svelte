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
  } from './store'
  import * as translation from './translation.json'

  const [html] = document.getElementsByTagName('html')
  const lang = html.getAttribute('lang')
  setContext('lang', lang)
  setContext('strings', translation[lang])

  const { data: request } = useSWR('https://aktiviteter.sl22.dk/api/activities', {
    dedupingInterval: 300,
    revalidateOnReconnect: true,
  })

  request.subscribe((value) => {
    if (value) {
      const mappedActivities = value.data.map((activity) => {
        if (activity.timeslots) {
          activity.timeslots = activity.timeslots.map((item) => {
            item.start = dayjs(item.start)
            return item
          })
        }
        return activity
      })

      config.set({ signup: value.meta.signup })
      activities.set(mappedActivities)
      activityTypes.set(value.meta.types)
      activityLocations.set(value.meta.locations)
      activityAges.set(value.meta.ages)
      activitySizes.set(value.meta.sizes)
      activityLanguages.set(value.meta.languages)
    }
  })
</script>

<section class="mx-auto max-w-6xl text-gray-900">
  <Router {routes} restoreScrollState={true} />
</section>
