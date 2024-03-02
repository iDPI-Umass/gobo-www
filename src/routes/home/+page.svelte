<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import MobileFilters from "$lib/components/MobileFilters.svelte";
  import Feed from "$lib/components/Feed.svelte"
  import { onMount } from "svelte";
  import { Draft } from "$lib/engines/draft.js";

  // As a temporary measure, we reset the draft when we go home. This keeps
  // us from resetting on all navigations, like the image pages.
  onMount( function () {
    Draft.clear();
  });
</script>

<div class="main-child">

  <MobileFilters></MobileFilters>
  <Feed></Feed>

</div>


<style>
  .main-child {
    max-width: unset;
    max-height: 100%;
    padding-top: 0;
  }
  @media ( max-width: 750px ) {
    .main-child {
      padding: 0;
    }
}
</style>