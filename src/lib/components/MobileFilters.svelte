<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  import * as Lens from "$lib/resources/lens.js";

  let identities = [];
  let lenses = []

  const loadFilters = async function () {
    const engine = await FeedSaver.getEngine();
    identities = engine.getActiveIdentities();
    // lenses = [{
    //   key: "Keyword Blocking"
    // }];
  };

  const getLogo = function ( identity ) {
    return `/icons/${ identity.platform }.svg`;
  } 
</script>

<nav>
  {#await loadFilters()}
  
    <Spinner></Spinner>
  
  {:then}
  
    <sl-button 
      href="/identities"
      pill>

      <sl-icon 
        class="identity-label"
        src="/icons/identities.svg" 
        slot="prefix">
      </sl-icon>

      {identities.length}
      <!-- {#each identities as identity (identity.key)}
        <sl-icon 
          class="logo { identity.platform }"
          src="{getLogo( identity )}">
        </sl-icon>
      {/each} -->
    </sl-button>



    <sl-button 
      href="/settings/feed"
      pill>

      <sl-icon 
        class="lens-label"
        src="/icons/filter.svg" 
        slot="prefix">
      </sl-icon>

      {lenses.length}
      <!-- {#each lenses as lens (lens.key)}
        <span> { lens.key } </span>
      {/each} -->
    </sl-button>
  
  {/await}
</nav>


<style>
  nav {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding-top: var(--gobo-height-spacer);
  }

  @media ( max-width: 750px ) {
    nav {
      padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex) 0 var(--gobo-width-spacer-flex)
    }
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

  nav sl-button sl-icon.logo {
    width: 1.25rem;
    margin-right: 0.25rem;
  }


  @media( min-width: 988px ) {
    nav {
      display: none;
    }
  }
</style>