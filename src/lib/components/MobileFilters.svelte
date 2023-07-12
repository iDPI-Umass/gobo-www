<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import * as ID from "$lib/resources/identity.js";
  import * as Lens from "$lib/resources/lens.js";
  import { feedStore } from "$lib/stores/feed-config.js";

  let identities = [];
  let lenses = []

  const loadFilters = async function () {
    identities = ( await ID.list() )
      .filter( i => i.active === true );
    lenses = ( await Lens.listBlocks() )
      .filter( i => i.active === true );

    feedStore.setIdentities(identities);

    console.log({ identities, lenses });
  };

  const getLogo = function ( identity ) {
    return `/icons/${ identity.type }.svg`;
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

      {#each identities as identity (identity.key)}
        <sl-icon 
          class="logo { identity.type }"
          src="{getLogo( identity )}">
        </sl-icon>
      {/each}
    </sl-button>



    <sl-button 
      href="/settings/feed"
      pill>

      <sl-icon 
        class="lens-label"
        src="/icons/filter.svg" 
        slot="prefix">
      </sl-icon>

      {#each lenses as lens (lens.key)}
        <span> { lens.key } </span>
      {/each}
    </sl-button>
  
  {/await}
</nav>


<style>
  nav {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
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
  }

  nav sl-button sl-icon.identity-label {
    font-size: 1.75rem;
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