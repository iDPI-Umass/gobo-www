<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import FilterGroup from "$lib/components/GeneralFilterMiniGroup.svelte";
</script>


<section class="outer-frame">

  <header>
    <h2>Filters</h2>
    <sl-button
      pill
      href="/settings/filters">
      
      <sl-icon 
        class="lens-label"
        src="/icons/filter.svg" 
        slot="prefix">
      </sl-icon>
      
      Configure
  </sl-button>
  </header>

  
  <section class="inner-frame">
    
    <h3>Block Keyword</h3>
    <FilterGroup category="block-keyword">
    </FilterGroup>

    <h3>Block Username</h3>
    <FilterGroup category="block-username">
    </FilterGroup>

    <h3>Block Domain</h3>
    <FilterGroup category="block-domain">
    </FilterGroup>

  </section>

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
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  header h2 {
    font-weight: var(--gobo-font-weight-black);
    font-size: 1.25rem;
    text-transform: capitalize;
  }

  h3 {
    text-transform: capitalize;
    margin: 0;
    margin-top: 2rem;
  }

  h3:first-child {
    margin: 0;
  }

  .inner-frame {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }

  header sl-button::part(base) {
    background-color: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    color: var(--gobo-color-button-lens);
  }
</style>
