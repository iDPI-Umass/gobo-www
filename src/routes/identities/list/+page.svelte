<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Identity from "$lib/components/Identity.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { getGOBOClient } from "$lib/helpers/account.js";

  let mastodons = [];
  let reddits = [];
  let twitters = [];

  const loadIdentities = async function () {
    const client = await getGOBOClient();
    let identities;
    try {
      let body = await client.identityInfo();
      identities = body.identities;
    } catch ( error ) {
      console.error( error );
      return;
    }
    console.log( identities );
    mastodons = identities.filter( identity => identity.type === "mastodon" );
    reddits = identities.filter( identity => identity.type === "reddit" );
    twitters = identities.filter( identity => identity.type === "twitter" );
    console.log({ mastodons, reddits, twitters });
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
    {#if mastodons.length === 0}
      <p>No identities currently registered.</p>
    {:else}
      {#each mastodons as mastodon}  
        <Identity type="mastodon"></Identity>
      {/each}
    {/if}
    <sl-divider class="gobo-divider"></sl-divider>
    
    <h2>Reddit</h2>
    {#if reddits.length === 0}
      <p>No identities currently registered.</p>
    {:else}
      {#each reddits as reddit}  
        <Identity type="reddit"></Identity>
      {/each}
    {/if}
    <sl-divider class="gobo-divider"></sl-divider>
    
    <h2>Twitter</h2>
    {#if twitters.length === 0}
      <p>No identities currently registered.</p>
    {:else}
      {#each twitters as twitter}  
        <Identity type="twitter"></Identity>
      {/each}
    {/if}

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