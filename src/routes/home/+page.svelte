<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import Post from "$lib/components/Post.svelte";
  import posts from "$lib/stores/posts.js";

  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { marker } from "$lib/stores/feed-marker.js";
  import { config } from "$lib/stores/feed-config.js";
  import { scroll } from "$lib/stores/scroll.js";
  let feed, unsubscribeMarker;
  let feedSortSelect, feedSort, unsubscribeConfig;
  let unsubscribeScroll;
  
  if ( browser ) {
    onMount( function () {
      unsubscribeConfig = config.subscribe( function ( config ) {
        feedSort = config.defaultFeedSort;
      });

      unsubscribeMarker = marker.subscribe( function ( config ) { 
        feed.scroll({
          top: config.position,
          behavior: "smooth"
        });
      });

      unsubscribeScroll = scroll.subscribe( function ({ deltaY }) {
        feed.scrollBy( 0, deltaY );
      });

      feedSortSelect.addEventListener( "sl-change", function () {
        console.log( "Feed update goes here" );
      });
    });

    onDestroy( function () {
      unsubscribeConfig();
      unsubscribeMarker();
      unsubscribeScroll();
    });
  }
</script>


<section bind:this={feed} role="feed">
  <div class="subheader">
    <h1>Home Feed</h1>
    <sl-icon-button 
      src="/icons/gear.svg"
      href="/settings/feed">
    </sl-icon-button>
  </div>
  
  <sl-select
    bind:this={feedSortSelect}
    label="Feed Sort"
    size="medium"
    value={feedSort}>
    <sl-option value="chronological-descending">Newest to Oldest</sl-option>
    <sl-option value="chronological-ascending">Oldest to Newest</sl-option>
    <sl-option value="popular-descending">Most Popular</sl-option>
    <sl-option value="by-platform">Prioritized By Platform</sl-option>
  </sl-select>
  {#each posts as post (post.id)}
    <Post {...post}></Post>
  {/each}
</section>

<style>
  .subheader {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    max-width: 36rem;
  }

  .subheader > h1 {
    font-size: var(--sl-font-size-x-large);
  }

  .subheader > sl-icon-button {
    font-size: 1.75rem;
    color: var(--sl-color-neutral-1000);
  }

  section {
    overflow-y: scroll;
  }

  sl-select {
    max-width: 36rem;
    margin: 1rem 0 2rem 0;
  }
</style>