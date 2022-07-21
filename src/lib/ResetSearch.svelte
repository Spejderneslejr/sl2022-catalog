<script lang="ts">
  export let strings: Record<string, string>
  import { search, searchInitial } from '../store'
  function handleClick() {
    search.set(searchInitial)
  }
</script>

<button on:click={handleClick} class="md:mr-4 border-2 px-2 py-1">
  {strings.reset_search}
</button>
