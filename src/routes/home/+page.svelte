<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import MobileFilters from "$lib/components/MobileFilters.svelte";
  import Feed from "$lib/components/Feed.svelte"
</script>

<div class="main-child">
  <header class="desktop">
    <h1>Home</h1>
    <sl-icon-button 
      src="/icons/gear.svg"
      href="/settings/feed">
    </sl-icon-button>
  </header>

  <MobileFilters></MobileFilters>
  <Feed></Feed>

</div>


<style>
  .main-child {
    max-width: unset;
    max-height: 100%;
  }
  .desktop {
    display: none;
  }

  @media ( min-width: 680px ) {
    .desktop {
      display: flex;
    }
  }
  @media ( max-width: 750px ) {
    .main-child {
      padding: 0;
    }
}
</style>