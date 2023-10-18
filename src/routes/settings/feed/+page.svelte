<script>
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
  import "@shoelace-style/shoelace/dist/components/radio-button/radio-button.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import  "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  import { allyEvent } from "$lib/helpers/event";
  import { onMount } from "svelte";


  let form, button, select, engine, filters;

  const loadFilters = async function () {
    engine = await FeedSaver.getEngine();
    filters = engine.getFilters();
  };

  const addKeyword = async function () {
    const data = new FormData( form );
    const category = data.get( "category" );
    const configuration = {
      value: data.get( "word" )
    };
    
    try {
      await engine.filterEngine.addFilter( category, configuration );
      filters = engine.getFilters();
      select.value = "block-keyword";
      form.reset();    
    } catch ( error ) {
      // TODO: Visually represent an error here.
      console.error( error );
    }

    button.loading = false;
  };

  const removeFilter = function ( filter ) {
    return allyEvent(function () {
      try {
        engine.filterEngine.removeFilter(filter);
        filters = engine.getFilters();
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
        console.log(filter)
        engine.filterEngine.updateFilter(filter);
        filters = engine.getFilters();
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );
      }
    });
  };

  onMount( function () {
    const listener = async function ( event ) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        await addKeyword();
      }
    };

    form.addEventListener( "submit", listener );

    return function () {
      form.removeEventListener( "submit", listener );
    };
  });
</script>

<div class="main-child">
  <BackLink heading="Feed Settings"></BackLink>

  <section class="gobo-copy">
    <header>
      <h2>Feed Filters</h2>
      <p>
        Control what content you would like to include in your Gobo feed.
        You can add filters below or delete any listed in the table.
      </p>
    </header>
    
    {#await loadFilters()}
      <Spinner></Spinner>
    {:then}
      {#if filters.length === 0}
        <section class="keyword-table">
          <section class="table-row">
            <span class="phrase">No filters configured at this time.</span>
          </section>
        </section>
      {:else}
        <section class="keyword-table">
          {#each filters as filter (filter.id)}
            <section class="table-row">
              <span class="keyword">
                <sl-button
                  size="small"
                  class="{filter.active ? 'action' : 'hollow'}"
                  on:click={toggleFilter({ ...filter })}
                  on:keypress={toggleFilter({ ...filter })}>
                  { filter.category }
                </sl-button>

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
    {/await}
  </section>

  <form class="gobo-form" bind:this={form}>
    <sl-select
      bind:this={select}
      name="category"
      value="block-keyword"
      label="Type"
      size="medium"
      pill>
      <sl-option value="block-keyword">Block Keyword</sl-option>
      <sl-option value="block-username">Block Username</sl-option>
      <sl-option value="block-domain">Block Domain</sl-option>
    </sl-select>
    
    <sl-input
      name="word"
      label="Pattern"
      help-text="Gobo will match against this text to exclude content from your feed"
      autocomplete="off"
      size="medium">
    </sl-input>

    <div class="buttons">
      <sl-button
        bind:this={button}
        type="submit"
        class="submit"
        variant="primary"
        size="medium"
        pill>
        Add Filter
      </sl-button>  
    </div>
    
  </form>
</div>


<style>
  .gobo-copy {
    margin-bottom: 2rem;
  }
  
  .keyword-table sl-icon-button {
    color: var(--gobo-color-danger);
  }

  .keyword-table .keyword {
    min-width: unset;
  }

  .keyword-table .keyword span {
    white-space: nowrap;
  }

  sl-select {
    max-width: 12rem;
  }

  @media ( max-width: 680px ) {
    .gobo-copy {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
  }
</style>