<script>
  import Identity from "$lib/components/Identity.svelte"
  import Divider from "$lib/components/primitives/Divider.svelte"
</script>
  
<section>
  <h1>Your Identities</h1>
  <h2>Mastodon</h2>
  <Identity type="mastodon"></Identity>
  <!-- <p>No identities currently registered.</p> -->
  <Divider top="2rem" bottom="1rem"></Divider>
  <h2>Reddit</h2>
  <Identity type="reddit"></Identity>
  <!-- <p>No identities currently registered.</p> -->
  <Divider top="2rem" bottom="1rem"></Divider>
  <h2>Twitter</h2>
  <Identity type="twitter"></Identity>
  <!-- <p>No identities currently registered.</p> -->
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 0;
    max-width: 40rem;
  }

  section > h1 {
    font-size: var(--sl-font-size-x-large);
    margin: 0 0 1rem 0;
  }

  section > h2 {
    font-size: var(--sl-font-size-large);
    margin: 0;
  }
</style>