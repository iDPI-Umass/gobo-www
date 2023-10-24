<script>
  import FilterTable from "$lib/components/FilterTable.svelte";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  import { allyEvent } from "$lib/helpers/event";
  import { onMount } from "svelte";

  let engine;

  const loadFilters = async function () {
    engine = await FeedSaver.getEngine();
  };

</script>

<div class="main-child">
  <BackLink heading="Feed Filters">
    
    <nav class="gobo-nav">
      <sl-button
        href="/settings/filters/add"
        pill>
        Add Filter
      </sl-button>
    </nav>

    <section class="gobo-copy">
      <p>
        Filters exclude posts from your feeds based on your configuration.
        Gobo aims to make these easy to add, use, and experiment with. Different
        filter categories are available with unique and powerful effects. These
        filters are private and reversable. Feel free to toggle or delete filters
        at will.
      </p> 
    </section>

  </BackLink>


  {#await loadFilters()}
    <Spinner></Spinner>
  {:then}
    <h2>Block Keyword</h2>
    <FilterTable
      {engine}
      category="block-keyword">
    </FilterTable>

    <h2>Block Username</h2>
    <FilterTable
      {engine}
      category="block-username">
    </FilterTable>

    <h2>Block Domain</h2>
    <FilterTable
      {engine}
      category="block-domain">
    </FilterTable>

  {/await}  

</div>


<style>
  h2 {
    margin-top: 2rem;
    padding-left: var(--gobo-width-spacer-half);
  }

  @media ( min-width: 680px ) {
    h2 {
      padding: 0;
    }
  }
</style>