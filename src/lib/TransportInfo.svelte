<script lang="ts">
  import Fa from 'svelte-fa'
  import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
  export let strings: Record<string, string>
</script>

<a
  class="w:full md:w-64 border-2 border-sl-turquis p-2 flex flex-row justify-center"
  href="https://spejderneslejr.dk/da/om-aktiviteter#aktivitetskrsel"
  target="businfo"
>
  <div>{strings.transport_info}</div>
  <Fa class="ml-3" icon={faExternalLink} />

</a>
