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

  let state, filters;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    filters = [];
  };

  Render.filters = async ( list ) => {
    filters = await Filter.findCategory( category );
    if ( filters.length === 0 ) {
      state = "empty";
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
        state = "error";   
      }
    }
  };

  Handle.remove = ( filter ) => {
    return Handle.error( async () => {
      await Filter.remove( filter );
      await Feed.refresh();
    });
  };

  Handle.toggle = ( filter ) => {
    return Handle.error( async () => {
      filter.active = !filter.active;
      await Filter.update( filter );
      await Feed.refresh();
    });
  };


  Render.reset();
  onMount(() => {
    Render.listen( filterStores.singleton, Render.filters );
    return () => {
      Render.reset();
    }
  })

</script>


<section class="gobo-copy">
  {#if state === "error"}
    <p>There was a problem displaying your filters.</p>
  
  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "empty"}
    <p>No filters configured at this time.</p>
  
  {:else if state === "ready"}
    <section class="gobo-table">
      {#each filters as filter (filter.id)}
        <section class="table-row">
          <span class="keyword">
            <sl-switch
              size="medium"
              checked="{filter.active}"
              on:sl-change={Handle.toggle( filter )}>
            </sl-switch>

          </span>
          <span class="phrase">{ filter.value }</span>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <sl-icon-button
            on:click={Handle.remove( filter )}
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