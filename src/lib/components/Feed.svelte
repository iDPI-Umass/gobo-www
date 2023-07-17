<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Post from "$lib/components/Post.svelte";
  import { onMount } from "svelte";

  import { FeedEngine } from "$lib/helpers/feed.js";
  import { ScrollSmoother } from "$lib/helpers/infinite-scroll.js";
  import { scrollStore } from "$lib/stores/scroll.js";
  import { feedStore } from "$lib/stores/feed.js";

  let feed, engine;
  let posts = [];

  const pull = async function ( count, marker ) {
    const current = await engine.pull( count, marker );
    posts = [ ...posts, ...current ];
  };

  const loadFeed = async function () {
    engine = await FeedEngine.create();
    await pull( 25 );
  };  
  
  onMount( function () {
    const listener = function () {
      pull( 25 );
    };
    feed.addEventListener( "gobo-smooth-scroll", listener );

    const smoother = ScrollSmoother.create({ element: feed });
    smoother.start();

    const unsubscribeScroll = scrollStore.subscribe( function ( event ) {
      if ( engine == null || event == null ) {
        return;
      }
      feed.scrollBy( 0, event.deltaY );
      smoother.update( event );
    });

    const unsubscribeFeed = feedStore.subscribe( function ( event ) {
      const command = event?.command;
      if ( command == null ) {
        return;
      }

      switch ( command ) {
        case "reset":
          posts = [];
          feed.scrollTo(0, 0);
          loadFeed();
          break;
      }
    });

    return function () {
      feed.removeEventListener( "gobo-change", listener );
      smoother.stop();
      unsubscribeScroll();
      unsubscribeFeed();
    };
  });

</script>

<section bind:this={feed}>
  {#await loadFeed()}
  
    <Spinner></Spinner>
  
  {:then}

    {#if posts}
      {#each posts as post }
        <Post {...post}></Post>
      {/each}
    {:else}
      <Spinner></Spinner>
    {/if}

    

  {/await}
</section>

<style>
  section {
    overflow-y: scroll;
    padding: 2px;
    max-height: 100%;
  }
</style>