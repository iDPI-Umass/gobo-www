<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  // import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";  
</script>

<PlainHeader></PlainHeader>
<Center>
  <section class="centered">
    <sl-spinner></sl-spinner>
  </section>
</Center>


<style>

  .centered {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }

  .centered sl-spinner {
    font-size: 6rem;
  }
</style>