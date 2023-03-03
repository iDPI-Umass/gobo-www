<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Identity from "$lib/components/Identity.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { getGOBO } from "$lib/stores/account.js";
  import { buildClient as buildGOBOClient } from "$lib/helpers/gobo.js";

  let goboClient;

  const loadIdentities = async function () {
    goboClient = await getGOBO();
    try {
      const list = await goboClient.identityInfo();
      console.log( "identity list", list);
    } catch ( error ) {
      console.error( error );
    }
  };
</script>
  
<section>
  <BackLink
    href="/identities"
    heading="Your Identities">
  </BackLink>

  {#await loadIdentities()}
    <Spinner></Spinner>
  {:then}
    <h2>Mastodon</h2>
    <Identity type="mastodon"></Identity>
    <!-- <p>No identities currently registered.</p> -->
    <sl-divider class="gobo-divider"></sl-divider>
    <h2>Reddit</h2>
    <Identity type="reddit"></Identity>
    <!-- <p>No identities currently registered.</p> -->
    <sl-divider class="gobo-divider"></sl-divider>
    <h2>Twitter</h2>
    <Identity type="twitter"></Identity>
    <!-- <p>No identities currently registered.</p> -->
  {/await}

  
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

  section > h2 {
    font-size: var(--sl-font-size-large);
    margin: 0;
  }

  section > sl-divider {
    margin: 2rem 0 1rem 0;
    max-width: 40rem;
  }
</style>