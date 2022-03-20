<script lang="ts">
  import Router, { link } from 'svelte-spa-router'
  import routes from './routes'
  import { useSWR } from 'sswr'
  import { activities, activityTypes, activityAges, activitySizes, activityLanguages } from './store'

  const { data: request } = useSWR('https://sl22.test/api/activities', {
    dedupingInterval: 10,
    revalidateOnReconnect: true,
  })

  request.subscribe((value) => {
    if (value) {
      activities.set(value.data)
      activityTypes.set(value.meta.types)
      activityAges.set(value.meta.ages)
      activitySizes.set(value.meta.sizes)
      activityLanguages.set(value.meta.languages)
    }
  })

</script>

<section class="p-4 max-w-6xl mx-auto">
  <Router {routes} />
</section>
