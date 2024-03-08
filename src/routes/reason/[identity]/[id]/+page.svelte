<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Reason from "$lib/components/Reason.svelte";

  export let data;
  let bindings = data.bindings;
</script>

<div class="main-child">
  <BackLink heading="Why Am I Seeing This?"></BackLink>
  <Reason {bindings}></Reason>
</div>