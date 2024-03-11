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

    <section class="gobo-copy">
      <p>
        Filters include and exclude posts from your feeds. Once you create a filter, you can turn it on and off or delete it entirely.
      </p> 
    </section>

  </BackLink>

  <h2>Block Keyword</h2>
  <FilterTable category="block-keyword"></FilterTable>

  <h2>Block Username</h2>
  <FilterTable category="block-username"></FilterTable>

  <h2>Block Domain</h2>
  <FilterTable category="block-domain"></FilterTable>

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