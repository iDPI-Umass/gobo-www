<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { feedStore } from "$lib/stores/feed.js";
  import { allyEvent } from "$lib/helpers/event";

  export let engine;
  export let category;

  let filters = [];
  const getFilters = function () {
    filters = engine.getFilters().filter( f => f.category === category );
  }

  getFilters();


  const removeFilter = function ( filter ) {
    return allyEvent(function () {
      try {
        engine.filterEngine.removeFilter(filter);
        getFilters();
        feedStore.push({ command: "reset" });
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );
      }
    });
  };

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


<section class="gobo-copy">
  {#if filters.length === 0}
    <p>No filters configured at this time.</p>
  {:else}
    <section class="gobo-table">
      {#each filters as filter (filter.id)}
        <section class="table-row">
          <span class="keyword">
            <sl-switch
              size="medium"
              checked="{filter.active}"
              on:click={toggleFilter({ ...filter })}
              on:keypress={toggleFilter({ ...filter })}>
            </sl-switch>

          </span>
          <span class="phrase">{ filter.configuration.value }</span>
          <sl-icon-button
            on:click={removeFilter({ ...filter })}
            on:keypress={removeFilter({ ...filter })}
            label="Delete Filter" 
            src="/icons/trash.svg">
          </sl-icon-button>
        </section>
      {/each}
    </section>
  {/if}
</section>

<style>
  .gobo-copy {
    margin-top: var(--gobo-height-spacer);
  }

  .gobo-table sl-icon-button {
    color: var(--gobo-color-danger);
  }

  .gobo-table .keyword {
    min-width: unset;
    margin-right: 1rem;
  }

  .gobo-table .keyword span {
    white-space: nowrap;
  }
</style>