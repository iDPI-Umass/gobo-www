<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Filter } from "$lib/engines/filter.js";
  import { Feed } from "$lib/engines/feed.js";
  import { filterStore } from "$lib/stores/filter.js";
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
  Handle.remove = ( filter ) => {
    return allyEvent(() => {
      try {
        Filter.remove( filter );
        Feed.refresh();
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );
      }
    });
  };

  Handle.toggle = ( filter ) => {
    return allyEvent(() => {
      try {
        filter.active = !filter.active;
        Filter.update( filter );
        Feed.refresh();
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );
      }
    });
  };


  Render.reset();
  onMount(() => {
    Render.listen( filterStore, Render.filters );
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
              on:click={Handle.toggle( filter )}
              on:keypress={Handle.toggle( filter )}>
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