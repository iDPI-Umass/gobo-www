<script>
  import * as Value from "@dashkite/joy/value";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";

  let identities = [];
  let identityLock = null;
  let allEmpty = true;

  const loadIdentities = async function () {
    const draft = get( draftStore );
    let identities = draft.identities;

    const engine = await FeedSaver.getEngine();
    const _identities = engine.getIdentities();
    if ( identities.length !== _identities.length ) {
      identities = [];
      for ( const identity of _identities ) {
        const i = Value.clone( identity );
        i.active = false;
        identities.push( i );
      }
    }
 
    draftStore.update({ identities, identitiesLoaded: "ready" });
  };

  const handleIdentitySwitch = function ( identity ) {
    return function ( event ) {
      identity.active = event.target.checked;
      draftStore.update({ identities });
    }
  };

  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( async function ( draft ) {
      if ( draft.identitiesLoaded == null ) {
        // Old draft stored in localStorage. Wipe it out and start over.
        draftStore.clear();
        return;
      }
      if ( draft.identitiesLoaded === "start" ) {
        draftStore.update({ identities, identitiesLoaded: "waiting" });
        await loadIdentities();
        return;
      }
      if ( draft.identitiesLoaded === "waiting" ) {
        // Not yet ready to process identities.
        return;
      }
      
      // We have a fresh list of identities from API. We're ready to process.
      identities = draft.identities;
      if ( identities.length === 0 ) {
        allEmpty = true;
      } else {
        allEmpty = false;
      }


      // In this case, we're not allowed to cross-post.
      identityLock = draft.reply?.identity ?? draft.quote?.identity;
      if ( identityLock != null ) {
        for ( const identity of identities ) {
          identity.active = identity.id === identityLock;
        }
      }
    });

    return function () {
      unsubscribeDraft();
    };
  });
</script>


<h2>Choose Identities</h2>

{#await loadIdentities()}
  <Spinner></Spinner>
{:then}

  <p>
    Select the identities you'd like to use to publish this post.
  </p>

  {#if allEmpty == true}

    <p>No identities currently registered.</p>

  {:else}

    {#each identities as identity (identity.key)}
      <div class="identity">
        
        <div class="label">
          <sl-icon 
            src="/icons/{identity.platform}.svg" 
            class="{identity.platform}"
            size="medium">
          </sl-icon>
          {identity.prettyName}
        </div>

        <sl-switch
          checked={identity.active}
          disabled={identityLock}
          on:sl-change={handleIdentitySwitch( identity )}
          size="medium">
        </sl-switch>
        
      </div>
    {/each}

  {/if}

{:catch}
  <p>There was a problem fetching your identities.</p>
{/await}


 
<style>
  .identity {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    margin-bottom: 0;
    border-radius: var(--gobo-border-radius);
    border: var(--gobo-border-panel);
    margin-top: var(--gobo-height-spacer-half);
    padding: var(--gobo-height-spacer) var(--gobo-width-spacer);
  }

  .identity:first-of-type {
    margin-top: var(--gobo-height-spacer-flex);
  }

  .identity > * {
    margin-bottom: 0;
  }

  .identity .label {
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  .identity sl-switch {
    margin-left: 0.25rem;
    margin-right: 0.5rem;
  }
  
  .identity sl-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }
</style>