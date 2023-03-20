<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
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


<section bind:this={feed} role="feed">
  <div class="subheader">
    <h1>Home</h1>
    <sl-icon-button 
      src="/icons/gear.svg"
      href="/settings/feed">
    </sl-icon-button>
  </div>

  <sl-divider></sl-divider>

  <!-- <div class="viewheader">
    <sl-button
      class="identities-button"
      pill>
      Identities
      <sl-icon slot="prefix" src="/icons/identities.svg"></sl-icon>
      <sl-badge pill>3</sl-badge>
    </sl-button>

    <sl-button
      class="lenses-button"
      pill>
      Lenses
      <sl-icon slot="prefix" src="/icons/filter.svg"></sl-icon>
      <sl-badge pill>3</sl-badge>
    </sl-button>
  </div> -->
  

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
    padding-top: 4px;
    max-width: var(--gobo-max-width-primary);
  }

  .subheader > h1 {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-black);
    color: var(--gobo-color-text-menu);
  }

  .subheader > sl-icon-button {
    font-size: 1.25rem;
  }

  .subheader > sl-icon-button::part(base) {
    color: var(--gobo-color-text-muted);
  }

  /* .viewheader {
    margin: var(--gobo-height-spacer) 0;
    max-width: var(--gobo-max-width-primary);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
  }

  .viewheader sl-button::part(base) {
    height: 2.1875rem;
    background-color: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    color: var(--gobo-color-button-lens);
  }

  .viewheader sl-button::part(label) {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-medium);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .viewheader > .identities-button {
    margin-right: 1rem;
  }

  
  .viewheader .identities-button sl-icon {
    width: 1.25rem;
  }

  .viewheader .lenses-button sl-icon {
    width: 0.75rem;
  }

  .viewheader sl-button sl-badge {
    translate: 30% -30%;
    border-radius: var(--sl-border-radius-pill);
  }

  .viewheader sl-button sl-badge::part(base) {
    background-color: var(--gobo-color-background-badge);
    color: var(--gobo-color-badge);
    border: none;
  } */


  section {
    overflow-y: scroll;
  }
</style>