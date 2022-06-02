<script lang="ts">
  export let strings: Record<string, string>
  import { search, searchInitial } from '../store'
  function handleClick() {
    search.set(searchInitial)
  }
</script>

<button on:click={handleClick}>
  {strings.reset_search}
</button>
