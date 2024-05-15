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

<div>
  <BackLink heading="Notifications" ></BackLink>
</div>
<MobileFilters></MobileFilters>
<Feed></Feed>

<style>
  /* 
    This is messy, but this is an edge case because the infinite notification
    feed has us avoiding using the "main-child" pattern. Correct this and
    the main case when we get a chance to refactor the layout.
  */
  @media( min-width: 680px ) {
    div {
      padding: var(--gobo-height-spacer) var(--gobo-width-spacer) 0 var(--gobo-width-spacer); 
    }
  }

  @media ( max-width: 680px ) {
    div {
      padding: var(--gobo-height-spacer) 0 0 0;
    }
  }
</style>