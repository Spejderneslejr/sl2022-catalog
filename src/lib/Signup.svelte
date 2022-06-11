<script lang="ts">
  import type { Config } from "../store"
  export let identifier: number
  export let strings: Record<string, string>
  export let lang: string
  export let config: Config
  const signUpUrl = encodeURIComponent(`https://${config.odoo}/${lang}/sl2022/activities/${identifier}`)
  const queueItUrl = 'https://spejderneslejr.queue-it.net/?c=spejderneslejr&e=spejderneslejr'
</script>

<div class="">
  <a href={`${queueItUrl}&t=${signUpUrl}`}>
    <button class="!btn !btn-accent px-4">{strings.signup_button}</button>
  </a>
</div>
