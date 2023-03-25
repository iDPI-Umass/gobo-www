<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import Identity from "$lib/components/Identity.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { getIdentities } from "$lib/helpers/identity";

  let identities = [];
  let allEmpty = true;

  const loadIdentities = async function () {
    identities = await getIdentities()
    
    if ( identities.length === 0 ) {
      allEmpty = true;
    } else {
      allEmpty = false;
    }
  };
</script>
  
<div class="main-child">
  <header>
    <h1>Identities</h1>
  </header>
  
  <nav>
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
  </nav>

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

  
</div>

<style>
  nav {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
  }

  nav > sl-button:first-child {
    margin-right: var(--gobo-width-spacer-flex);
  }

  nav sl-button::part(base) {
    height: 2.1875rem;
    background-color: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    color: var(--gobo-color-button-lens);
  }

  nav sl-button::part(label) {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-medium);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>