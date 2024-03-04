<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import MobileFilters from "$lib/components/Notification/MobileFilters.svelte";
  import Feed from "$lib/components/Notification/Feed.svelte";
</script>

<BackLink heading="Notifications" ></BackLink>
<MobileFilters></MobileFilters>
<Feed></Feed>

<style>
</style>