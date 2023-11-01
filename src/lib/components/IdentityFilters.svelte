<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import IdentityMini from "$lib/components/IdentityMini.svelte";
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

<section class="outer-frame">

  <header>
    <h2>Identities</h2>
  </header>

  {#await loadIdentities()}
  
    <Spinner></Spinner>
  
  {:then}

    <section class="inner-frame">
      {#if allEmpty === true}
        <p>No identities currently registered.</p>
      {/if}

      {#each identities as identity (identity.id)}  
        <IdentityMini {identity}></IdentityMini>
      {/each}
    </section>

  {/await}

</section>

<style>
  .outer-frame {
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    width: 20rem;
    margin-bottom: var(--gobo-height-spacer);
  }

  header {
    padding: 0.75rem var(--gobo-width-spacer);
    border-bottom: var(--gobo-border-panel);
    margin-bottom: var(--gobo-height-spacer-flex);
    width: 100%;
  }

  h2 {
    font-weight: var(--gobo-font-weight-black);
    font-size: 1.25rem;
    text-transform: capitalize;
  }

  .inner-frame {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }
</style>
