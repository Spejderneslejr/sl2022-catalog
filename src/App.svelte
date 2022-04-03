<script lang="ts">
  import Router, { link } from 'svelte-spa-router'
  import routes from './routes'
  import { useSWR } from 'sswr'
  import {
    activities,
    activityTypes,
    activityAges,
    activitySizes,
    activityLanguages,
    activityLocations
  } from './store'

  const { data: request } = useSWR('https://aktiviteter.sl22.dk/api/activities', {
    dedupingInterval: 60,
    revalidateOnReconnect: true,
  })

  request.subscribe((value) => {
    if (value) {
      activities.set(value.data)
      activityTypes.set(value.meta.types)
      activityLocations.set(value.meta.locations)
      activityAges.set(value.meta.ages)
      activitySizes.set(value.meta.sizes)
      activityLanguages.set(value.meta.languages)
    }
  })
</script>

<section class="mx-auto max-w-6xl p-4">
  <Router {routes} />
</section>
