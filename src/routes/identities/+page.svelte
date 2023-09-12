<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import Identity from "$lib/components/Identity.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import * as Feed from "$lib/helpers/feed.js";

  let identities = [];
  let allEmpty = true;

  const loadIdentities = async function () {
    identities = await Feed.getIdentities();
    
    if ( identities.length === 0 ) {
      allEmpty = true;
    } else {
      allEmpty = false;
    }
  };
</script>
  
<div class="main-child">
  <header>
    <div class="header-row">
      <h1>Identities</h1>
      <nav>
        <sl-button
          href="/identities/add"
          pill>
          Add Identity
        </sl-button>
      </nav>
    </div>
    <section class="gobo-copy">
      <p>
        Control which identities you would like to include in your Gobo feed. 
        You can add identities from Bluesky, Mastodon, and Reddit.
      </p> 
    </section>
  </header>
  

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

  .gobo-copy {
    margin-bottom: var(--gobo-height-spacer);
  }

  .main-child > header {
    flex-direction: column;
  }

  header nav {
    margin-bottom: 0;
  }

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

  header nav > sl-button:first-child {
    margin-right: 0;
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