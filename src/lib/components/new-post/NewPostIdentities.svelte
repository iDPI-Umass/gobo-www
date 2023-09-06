<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { onMount } from "svelte";
  import * as Identity from "$lib/resources/identity.js";

  let identities = [];
  let allEmpty = true;

  const loadIdentities = async function () {
    const _identities = await Identity.list();
    
    // Merge in the active state from the draft store, but take in the freshest values for other fields.
    for ( const _identity of _identities ) {
      const match = identities.find( i => i.key === _identity.key );
      if ( match != null ) {
        _identity.active = match.active;
      } 
    }
 
    identities = _identities;
    draftStore.update({ identities, identitiesLoaded: true });
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
      
      identities = draft.identities;
      if ( draft.identitiesLoaded === false ) {
        await loadIdentities();
      }

      if ( identities.length === 0 ) {
        allEmpty = true;
      } else {
        allEmpty = false;
      }
    });

    return function () {
      unsubscribeDraft();
    };
  });
</script>


<h2>Choose Identities</h2>
      
<p>
  Select the identities below you'd like to use to create this post. Gobo
  will submit posts to these platforms on your behalf.
</p>


{#if allEmpty == true}

  <Spinner></Spinner>

{:else}
  
  {#each identities as identity (identity.key)}
    <div class="identity">
      
      <div class="label">
        <sl-icon 
          src="/icons/{identity.type}.svg" 
          class="{identity.type}"
          size="medium">
        </sl-icon>
        {identity.prettyName}
      </div>

      <sl-switch
        checked={identity.active}
        on:sl-change={handleIdentitySwitch( identity )}
        size="medium">
      </sl-switch>
      
    </div>
  {/each}

{/if}
 
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