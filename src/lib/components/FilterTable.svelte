<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Filter } from "$lib/engines/filter.js";
  import { Feed } from "$lib/engines/feed.js";
  import * as filterStores from "$lib/stores/filter.js";
  import { allyEvent } from "$lib/helpers/event";

  export let category;

  let filters;
  const Render = State.make();
  Render.cleanup = () => {
    filters = [];
  };

  Render.filters = async () => {
    filters = await Filter.findCategory( category );
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

  Handle.remove = ( filter ) => {
    return Handle.error( allyEvent( async () => {
      await Filter.remove( filter );
      await Feed.refresh();
    }));
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
              on:sl-change={Handle.toggle( filter )}>
            </sl-switch>

          </span>
          <span class="phrase">{ filter.configuration.value }</span>
          <sl-icon-button
            on:click={Handle.remove( filter )}
            on:keypress={Handle.remove( filter )}
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