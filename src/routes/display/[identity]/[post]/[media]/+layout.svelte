<script>
  import GuardFrame from "$lib/components/GuardFrame.svelte";
</script>


<GuardFrame>
  <main>
    <slot></slot>
  </main>
</GuardFrame>


<style>
  main {
    height: 100dvh;
    padding: 1rem;
  }
</style>