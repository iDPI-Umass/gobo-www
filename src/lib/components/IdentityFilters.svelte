<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import IdentityMini from "$lib/components/IdentityMini.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Identity } from "$lib/engines/identity.js";
  import * as identityStores from "$lib/stores/identity.js";

  const readable = [
    "bluesky",
    "mastodon",
    "reddit",
    "smalltown"
  ];


  let identities, state;
  const Render = State.make();
  Render.cleanup = () => {
    identities = [];
    state = "loading";
  };

  Render.identities = ( list ) => {
    identities = list.filter( i => readable.includes( i.platform ));
  
    if ( identities.length === 0 ) {
      state = "empty";
    } else {
      state = "ready";
    }
  };


  Render.reset();
  onMount(() => {
    Render.listen( identityStores.singleton, Render.identities );
    return () => {
      Render.reset();
    };
  });
</script>

<section class="outer-frame">

  <header>
    <sl-icon src="/icons/identities.svg"></sl-icon>
    <h2>Identities</h2>
    <sl-icon-button src="/icons/arrow-right.svg" href="/settings/identities" />
  </header>

  {#if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "emtpy"}
    <section class="inner-frame">
      <p>No identities currently registered.</p>
    </section>
  
  {:else if state === "ready"}
    <section class="inner-frame">
      {#each identities as identity (identity.id)}  
        <IdentityMini {identity}></IdentityMini>
      {/each}
    </section>

  {/if}

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
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem var(--gobo-width-spacer);
    border-bottom: var(--gobo-border-panel);
    margin-bottom: var(--gobo-height-spacer-flex);
    width: 100%;
  }

  header sl-icon {
    font-size: 2rem;
  }

  h2 {
    flex: 1 1 100%;
    font-weight: var(--gobo-font-weight-black);
    font-size: 1.25rem;
    text-transform: capitalize;
  }

  header sl-icon-button {
    color: var(--gobo-color-text);
  }

  .inner-frame {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }
</style>
