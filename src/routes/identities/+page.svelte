<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import Identity from "$lib/components/Identity.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { getGOBOClient } from "$lib/helpers/account.js";
  import { sort } from "$lib/helpers/identity";

  let identities = [];
  let allEmpty = false;

  const loadIdentities = async function () {
    const client = await getGOBOClient();
    let _identities;
    try {
      let body = await client.identityInfo();
      _identities = body.identities;
    } catch ( error ) {
      console.error( error );
      return;
    }

    if ( _identities.length === 0 ) {
      allEmpty = true;
    } else {
      allEmpty = false;
    }

    identities = sort( _identities );
  };
</script>
  
<section>
  <h1>Identities</h1>
  <sl-divider></sl-divider>

  <div class="subheader">
    <sl-button 
      href="/identities/about"
      pill>
      About Identities
    </sl-button>

    <sl-button
      href="/identities/add"
      pill>
      Add Identity
    </sl-button>
  </div>

  {#await loadIdentities()}
  
    <Spinner></Spinner>
  
  {:then}

    <section class="identities">
      {#if allEmpty === true}
        <p>No identities currently registered.</p>
      {/if}

      {#each identities as identity (identity.key)}  
        <Identity {identity}></Identity>
      {/each}

    </section>

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

  section > h1 {
    margin-bottom: 0.5rem;
  }

  section > sl-divider {
    margin: 0;
  }

  .subheader {
    margin: var(--gobo-height-spacer) 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
  }

  .subheader > sl-button:first-child {
    margin-right: var(--gobo-width-spacer);
  }

  .subheader sl-button::part(base) {
    height: 2.1875rem;
    background-color: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    color: var(--gobo-color-button-lens);
  }

  .subheader sl-button::part(label) {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-medium);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .identities {
    max-width: var(--gobo-max-width-primary);
  }
</style>