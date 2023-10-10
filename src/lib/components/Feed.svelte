<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Post from "$lib/components/Post.svelte";
  import { onMount, tick } from "svelte";

  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  import { ScrollSmoother } from "$lib/helpers/infinite-scroll.js";
  import { scrollStore } from "$lib/stores/scroll.js";
  import { feedStore } from "$lib/stores/feed.js";
  import * as LS from "$lib/helpers/local-storage.js";

  let feed, engine;
  let items = [];
  let loaded = false;
  let fetching = false;

  const pull = async function ( count, marker ) {
    const current = await engine.pull( count, marker );
    if ( current.length > 0 ) {
      const _items = [ ...items, ...current ];
      FeedSaver.setFeed( _items );
      items = _items;
    }
  };

  const loadFeed = async function () {
    engine = await FeedSaver.getEngine();
    items = FeedSaver.getFeed();
    if ( items.length === 0 ) {
      await pull( 25 );
    }
    loaded = true;
    if ( items.length > 0 ) {
      fetching = false;
      LS.remove("fetching");
    }
    await tick();
    feed.scrollTo( 0, FeedSaver.getScrollPosition() );
  };  
  
  onMount( function () {
    const smoother = ScrollSmoother.create({ element: feed });

    const rawListener = function ( event ) {
      event.preventDefault();
      scrollStore.push( event );
    };

    const smoothListener = async function ( event ) {
      await pull( 25 );
    };

    feed.addEventListener( "scroll", rawListener );
    feed.addEventListener( "gobo-smooth-scroll", smoothListener );
    fetching = LS.read( "fetching" );

    const unsubscribeScroll = scrollStore.subscribe( function ( event ) {
      if ( engine == null || event == null ) {
        return;
      }
      feed.scrollBy( 0, event.deltaY );
      FeedSaver.setScrollPosition( feed.scrollTop );
      smoother.update( event );
      scrollStore.push(null); // We're using store as message queue, clear out old message.
    });

    const unsubscribeFeed = feedStore.subscribe( async function ( event ) {
      const command = event?.command;
      if ( command == null ) {
        return;
      }

      switch ( command ) {
        case "reset":
          loaded = false;
          await FeedSaver.reset();
          await loadFeed();
          feedStore.push({}); // We're using store as message queue, clear out old message.
          break;
      }

    });

    smoother.start();
    loadFeed();

    return function () {
      feed.removeEventListener( "scroll", rawListener );
      feed.removeEventListener( "gobo-smooth-scroll", smoothListener );
      smoother.stop();
      unsubscribeScroll();
      unsubscribeFeed();
    };
  });

</script>

<section class="feed" bind:this={feed}>
  {#if items.length > 0}
    {#each items as { identity, post } }
      <Post {identity} {...post}></Post>
    {/each}
  {:else if loaded && items.length === 0 && fetching === true }
    <section class="gobo-copy">
      <p>
        We are fetching your feed. This may take a couple of minutes.
      </p> 
    </section>
  {:else if loaded && items.length === 0 }
    <section class="gobo-copy">
      <p>
        Your feed is empty! Add or activate an identity to get started.
      </p> 
    </section>
  {/if}
</section>

<style>
  section.feed {
    overflow-y: scroll;
    padding: 2px;
    max-height: 100%;
  }

  @media ( max-width: 680px ) {
    section.feed {
      padding: 0;
    }
    .gobo-copy {
      margin-left: var(--gobo-width-spacer-flex);
      margin-right: var(--gobo-width-spacer-flex);
    }
  }
</style>