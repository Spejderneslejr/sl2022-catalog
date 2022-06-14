<script lang="ts">
  import { getContext } from 'svelte'
  import Fa from 'svelte-fa'
  import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
  import type { Config } from '../store'
  export let identifier: number
  export let strings: Record<string, string>
  export let lang: string
  export let config: Config

  const noqueue: boolean = getContext('noqueue')

  let signUpUrl = `https://${config.odoo}/${lang}/sl2022/activities/${identifier}`

  if (!noqueue) {
    const encodeSignUpUrl = encodeURIComponent(
      `https://${config.odoo}/${lang}/sl2022/activities/${identifier}`
    )
    signUpUrl = `https://spejderneslejr.queue-it.net/?c=spejderneslejr&e=spejderneslejr&t=${encodeSignUpUrl}`
  }
</script>

<div class="">
  <a href={signUpUrl}>
    <button
      class="items-center flex h-12 flex-row gap-2 whitespace-nowrap rounded-md bg-amber-200 p-3 hover:bg-amber-300"
      >{strings.signup_button} <Fa class="h-6 w-6" icon={faUserPlus} /></button
    >
  </a>
</div>
