<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
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

    for ( const identity of identities ) {
      if ( identity.base_url === "twitter.com" ) {
        twitters.push( identity );
      } else if ( identity.base_url === "www.reddit.com" ) {
        reddits.push( identity );
      } else {
        mastodons.push( identity );
      }
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

    <sl-button
      variant="primary"
      href="/identities/add">
      Add Identity
    </sl-button>

    <h2>Mastodon</h2>
    {#if mastodons.length === 0}
      <p>No identities currently registered.</p>
    {:else}
      {#each mastodons as mastodon}  
        <Identity type="mastodon" {...mastodon}></Identity>
      {/each}
    {/if}
    <sl-divider class="gobo-divider"></sl-divider>
    
    <h2>Reddit</h2>
    {#if reddits.length === 0}
      <p>No identities currently registered.</p>
    {:else}
      {#each reddits as reddit}  
        <Identity type="reddit" {...reddit}></Identity>
      {/each}
    {/if}
    <sl-divider class="gobo-divider"></sl-divider>
    
    <h2>Twitter</h2>
    {#if twitters.length === 0}
      <p>No identities currently registered.</p>
    {:else}
      {#each twitters as twitter}  
        <Identity type="twitter" {...twitter}></Identity>
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

  section > sl-button {
    margin-bottom: 2rem;
    align-self: flex-start;
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