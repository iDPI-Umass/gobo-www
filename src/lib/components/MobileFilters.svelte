<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Identity } from "$lib/engines/identity.js";
  import { Filter } from "$lib/engines/filter.js";

  let state, identities, filters;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    identities = [];
    filters = [];
  };

  Render.menu = async () => {
    const results = await Promise.all([
      Identity.findActive(),
      Filter.findActive()
    ]);
    identities = results[0];
    filters = results[1];
    state = "ready";
  };

  Render.reset();
  onMount(() => {
    Render.menu();
    return () => {
      Render.reset();
    }
  });
</script>

<nav>
  {#if state === "error"}
    <p>There was a problem displaying menu.</p>
  
  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "ready"}
    <sl-button 
      href="/identities"
      pill>

      <sl-icon 
        class="identity-label"
        src="/icons/identities.svg" 
        slot="prefix">
      </sl-icon>

      {identities.length}
    </sl-button>



    <sl-button 
      href="/settings/filters"
      pill>

      <sl-icon 
        class="lens-label"
        src="/icons/filter.svg" 
        slot="prefix">
      </sl-icon>

      {filters.length}
    </sl-button>
    
  {/if}
</nav>


<style>
  nav {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex) 0 var(--gobo-width-spacer-flex)
  }

  nav > sl-button {
    margin-right: var(--gobo-width-spacer-flex);
    margin-bottom: var(--gobo-height-spacer-flex);
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
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-transform: capitalize;
    padding: 0 1rem;
  }

  nav sl-button sl-icon.identity-label {
    font-size: 1.625rem;
  }

  nav sl-button sl-icon.lens-label {
    font-size: 1.25rem;
  }

  @media( min-width: 988px ) {
    nav {
      display: none;
    }
  }
</style>