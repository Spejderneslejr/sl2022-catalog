<script lang="ts">
  export let identifier: number
  export let strings: Record<string, string>
  const baseUrl = 'https://sl2022-test.steingabelgaard.dk/sl2022/activities'
</script>

<div class="">
  <a href={`${baseUrl}/${identifier}`}>
    <button class="!btn !btn-accent px-4">{strings.signup_button}</button>
  </a>
</div>
