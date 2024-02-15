<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import MobileNotificationFilters from "$lib/components/MobileNotificationFilters.svelte";
  import NotificationFeed from "$lib/components/NotificationFeed.svelte";
  import { onMount } from "svelte";
  import { draftStore } from "$lib/stores/post-draft.js";

  // As a temporary measure, we reset the draft when we go home. This keeps
  // us from resetting on all navigations, like the image pages.
  onMount( function () {
    draftStore.clear();
  });
</script>

<div class="main-child">
  <MobileNotificationFilters></MobileNotificationFilters>
  <NotificationFeed></NotificationFeed>
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