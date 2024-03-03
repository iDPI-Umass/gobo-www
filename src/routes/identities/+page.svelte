<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import Identity from "$lib/components/Identity.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  
  let identities = [];
  let allEmpty = true;

  const loadIdentities = async function () {
    const engine = await FeedSaver.getEngine();
    identities = engine.getIdentities();
    
    if ( identities.length === 0 ) {
      allEmpty = true;
    } else {
      allEmpty = false;
    }
  };
</script>
  
<div class="main-child">

  <BackLink heading="Identities">

    <nav class="gobo-nav">
      <sl-button
        href="/identities/add"
        pill>
        Add Identity
      </sl-button>
    </nav>

  </BackLink>

  <section class="gobo-copy">
    <p>
      Control which identities you would like to include in your Gobo feed. 
      You can add identities from Bluesky, Mastodon, and Reddit.
    </p> 
  </section>
  
  
  {#await loadIdentities()}
  
    <Spinner></Spinner>
  
  {:then}

    <section class="identities">
      {#each identities as identity (identity.key)}  
        <Identity {identity}></Identity>
      {/each}
    </section>

  {/await}

  
</div>

<style>

  .identities {
    margin-top: var(--gobo-height-spacer);
  }

</style>