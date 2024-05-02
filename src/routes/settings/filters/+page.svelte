<script>
  import FilterTable from "$lib/components/FilterTable.svelte";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
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

  </BackLink>

  <section class="gobo-copy">
    <p>
      Filters include and exclude posts from your feeds. Once you create a filter, you can turn it on and off or delete it entirely.
    </p> 
  </section>

  <h2>Block Keyword</h2>
  <FilterTable category="block-keyword"></FilterTable>

  <h2>Block Username</h2>
  <FilterTable category="block-username"></FilterTable>

  <h2>Block Domain</h2>
  <FilterTable category="block-domain"></FilterTable>

  <!-- TODO: fix this in the layout refactor. -->
  <div class="spacer"></div>
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

  .spacer {
    width: 100%;
    margin-bottom: 10rem;
  }
</style>