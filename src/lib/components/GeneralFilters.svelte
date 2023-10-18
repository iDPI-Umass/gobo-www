<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
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
    <h2>Filters</h2>
    <sl-button
      pill
      href="/settings/feed">
      
      <sl-icon 
        class="lens-label"
        src="/icons/filter.svg" 
        slot="prefix">
      </sl-icon>
      
      Configure
  </sl-button>
  </header>

  
  <section class="inner-frame">

    <p>Filters allow you to control what is included in your feed.</p>
  </section>

</section>

<style>
  .outer-frame {
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    max-width: 20rem;
    margin-bottom: var(--gobo-height-spacer);
  }

  header {
    padding: 0.75rem var(--gobo-width-spacer);
    border-bottom: var(--gobo-border-panel);
    margin-bottom: var(--gobo-height-spacer-flex);
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    font-weight: var(--gobo-font-weight-black);
    font-size: 1.25rem;
    text-transform: capitalize;
  }

  .inner-frame {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }

  header sl-button::part(base) {
    background-color: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    color: var(--gobo-color-button-lens);
  }

  p {
    margin-top: 1rem;
  }
</style>
