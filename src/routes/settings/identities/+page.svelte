<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Identity from "$lib/components/Identity.svelte";
  import { onMount } from "svelte";
  import { Identity as IdentityEngine } from "$lib/engines/identity.js"
  import { State } from "$lib/engines/store.js";
  import * as identityStores from "$lib/stores/identity.js";

  let state, identities;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    identities = [];
  };
  
  Render.identities = ( list ) => {
    identities = list;
    if ( identities.length === 0 ) {
      state = "empty";
    } else {
      state = "ready";
    }
  };

  Render.reset();
  onMount(() => {
    Render.listen( identityStores.singleton, Render.identities );
    IdentityEngine.refresh();
    return () => {
      Render.reset();
    }
  });
</script>
  
<div class="main-child">

  <BackLink heading="Identities">

    <nav class="gobo-nav">
      <sl-button
        href="/settings/identities/add"
        pill>
        Add Identity
      </sl-button>
    </nav>

  </BackLink>

  <section class="gobo-copy">
    <p>
      Control which identities you would like to include in your Gobo feed. 
      You can add identities from Bluesky, LinkedIn, Mastodon, and Reddit.
    </p> 
  </section>
  
  <section class="identities">
    {#if state === "error"}
      <p>There was a problem displaying your identities.</p>

    {:else if state === "loading"}
      <Spinner></Spinner>
    
    {:else if state === "empty"}
      <p>No identities at this time.</p>

    {:else if state === "ready"}
      {#each identities as identity (identity.id)}  
        <Identity {identity}></Identity>
      {/each}
    
    {/if}

  </section>  
</div>

<style>

  .identities {
    margin-top: var(--gobo-height-spacer);
  }

</style>