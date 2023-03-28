<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import MobileFilters from "$lib/components/MobileFilters.svelte";
  import Post from "$lib/components/Post.svelte";
  import posts from "$lib/stores/posts.js";

  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { feedStore } from "$lib/stores/feed-config.js";
  import { scrollStore } from "$lib/stores/scroll.js";
  import { getGOBOClient } from "$lib/helpers/account";
  let feed;
  let feedSortSelect, feedSort;
  let unsubscribeConfig, unsubscribeScroll;

  const loadFeed = async function () {
    const client = await getGOBOClient();
    const result = await client.freshFeed();
    console.log( result );
  };
  
  if ( browser ) {
    onMount( function () {
      unsubscribeConfig = feedStore.subscribe( function ( config ) {
        feedSort = config.defaultFeedSort;
      });

      // feed.scroll({
      //   top: config.position,
      //   behavior: "smooth"
      // });

      unsubscribeScroll = scrollStore.subscribe( function ({ deltaY }) {
        feed.scrollBy( 0, deltaY );
      });
    });

    onDestroy( function () {
      unsubscribeConfig();
      unsubscribeScroll();
    });
  }
</script>

<div class="main-child">
  <header>
    <h1>Home</h1>
    <sl-icon-button 
      src="/icons/gear.svg"
      href="/settings/feed">
    </sl-icon-button>
  </header>

  <MobileFilters></MobileFilters>
    
  <!-- TODO: Feed a11y with proper labeling -->
  <section bind:this={feed}>
    {#each posts as post (post.id)}
      <Post {...post}></Post>
    {/each}
  </section>
</div>


<style>
  section {
    overflow-y: scroll;
    padding: 2px;
  }

  .main-child {
    max-width: unset;
  }
</style>