<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { feedStore } from "$lib/stores/feed.js";
  import { allyEvent } from "$lib/helpers/event";

  export let engine;
  export let category;

  let activeSwitch;

  let filters = [];
  const getFilters = function () {
    filters = engine.getFilters().filter( f => f.category === category );
  }

  getFilters();


  const toggleFilter = function ( filter ) {
    return allyEvent(function () {
      try {
        filter.active = !filter.active;
        engine.filterEngine.updateFilter(filter);
        getFilters();
        feedStore.push({ command: "reset" });
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );
      }
    });
  };

</script>

<section class="filter-group">
  {#if filters.length === 0}
    <p>No filters in this category. </p>

  {:else}
    {#each filters as filter (filter.id)}
      <section>
        <span>{ filter.configuration.value }</span>

        <sl-switch
          bind:this={activeSwitch}
          checked={filter.active}
          on:click={toggleFilter({ ...filter })}
          on:keypress={toggleFilter({ ...filter })}
          size="medium">
        </sl-switch>
      
      </section>
    {/each}
  
  {/if}
</section>

<style>
  section.filter-group {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
  }

  .filter-group > section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-right: 0.5rem;
    margin-top: 0.5rem;
  }

  section > section span {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    max-width: 11rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>


