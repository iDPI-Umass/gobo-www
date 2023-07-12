<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import MobileFilters from "$lib/components/MobileFilters.svelte";
  import Post from "$lib/components/Post.svelte";

  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";

  import * as Identity from "$lib/resources/identity.js";
  import { Feed } from "$lib/resources/feed.js";
  import { feedStore } from "$lib/stores/feed-config.js";

  let feed, engine;
  let posts = [];
  let unsubscribeScroll;

  const loadFeed = async function () {
    const identities = await Identity.list()
    engine = await Feed.create({ identities });
    for ( let i = 0; i < 20; i++ ) {
      const post = await engine.next();
      if ( post != null ) {
        posts.push( post );
      }
    }
  };
  
  if ( browser ) {
    onMount( function () {
      feed.addEventListener( "click", function ( event ) {
        console.log(event)
      });
    });

    onDestroy( function () {
      // unsubscribeScroll();
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
    

  <section bind:this={feed}>
    {#await loadFeed()}
    
      <Spinner></Spinner>
    
    {:then}

      {#each posts as post (post.id)}
        <Post {...post}></Post>
      {/each}
  
    {/await}
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