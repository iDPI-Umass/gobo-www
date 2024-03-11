<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Filter } from "$lib/engines/filter.js";
  import { Feed } from "$lib/engines/feed.js";
  import * as filterStores from "$lib/stores/filter.js";

  export let category;

  let activeSwitch;
  let filters, state;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    filters = [];
  };

  Render.filters = async () => {
    filters = await Filter.findCategory( category );

    if ( filters.length === 0 ) {
      state = "empty"
    } else {
      state = "ready";
    }
  };

  
  const Handle = {};
  Handle.error = ( f ) => {
    return async ( event ) => {
      try {
        await f( event );
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );        
      }
    }
  };

  Handle.toggle = ( filter ) => {
    return Handle.error( async () => {
      filter.active = !filter.active;
      Filter.update( filter );
      Feed.refresh();
    });
  };


  Render.reset();
  onMount(() => {
    Render.listen( filterStores.singleton, Render.filters );
    return () => {
      Render.reset();
    };
  });

</script>

<section class="filter-group">
  {#if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "empty"}
    <p>No filters in this category. </p>
  
  {:else if state === "ready"}
    {#each filters as filter (filter.id)}
      <section>
        <span>{ filter.value }</span>

        <sl-switch
          bind:this={activeSwitch}
          checked={filter.active}
          on:sl-change={Handle.toggle( filter )}
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


