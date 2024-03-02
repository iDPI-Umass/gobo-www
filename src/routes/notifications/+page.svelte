<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import MobileFilters from "$lib/components/Notification/MobileFilters.svelte";
  import Feed from "$lib/components/Notification/Feed.svelte";
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