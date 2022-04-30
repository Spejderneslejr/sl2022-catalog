<script lang="ts">
  import { setContext } from 'svelte'
  import Router, { link } from 'svelte-spa-router'
  import routes from './routes'
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
  import LanguageSwitcher from './lib/LanguageSwitcher.svelte'

  const [html] = document.getElementsByTagName('html')
  const lang = html.getAttribute('lang')
  setContext('lang', lang)
  setContext('strings', translation[lang])

  const { data: request } = useSWR('https://aktiviteter.sl22.dk/api/activities', {
    dedupingInterval: 60,
    revalidateOnReconnect: true,
  })

  request.subscribe((value) => {
    if (value) {
      config.set({ signup : value.meta.signup })
      activities.set(value.data)
      activityTypes.set(value.meta.types)
      activityLocations.set(value.meta.locations)
      activityAges.set(value.meta.ages)
      activitySizes.set(value.meta.sizes)
      activityLanguages.set(value.meta.languages)
    }
  })
</script>

<section class="mx-auto max-w-6xl text-gray-900 dark:text-white">
  <Router {routes} restoreScrollState={true} />
</section>
