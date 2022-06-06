<script lang="ts">
  import type { Config } from "../store"
  export let identifier: number
  export let strings: Record<string, string>
  export let config: Config
</script>

<div class="">
  <a href={`https://${config.odoo}/sl2022/activities/${identifier}`}>
    <button class="!btn !btn-accent px-4">{strings.signup_button}</button>
  </a>
</div>
