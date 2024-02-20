<script>
  import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
  import "@shoelace-style/shoelace/dist/components/tab/tab.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Notification from "$lib/components/Notification/Notification.svelte";
  import { onMount, tick } from "svelte";

  import * as FeedSaver from "$lib/engines/notification-singleton.js";
  import { ScrollSmoother } from "$lib/helpers/infinite-scroll.js";
  import { scrollStore } from "$lib/stores/notification-scroll.js";
  import { feedStore } from "$lib/stores/notification-feed.js";

  let tabs, feed, engine;
  let items = [];
  let loaded = false;
  let view = "all";

  const pull = async function ( count, marker ) {
    const current = await engine.pull( count, marker );
    if ( current.length > 0 ) {
      const _items = [ ...items, ...current ];
      FeedSaver.setFeed( _items );
      items = _items;
    }
  };

  const loadFeed = async function () {
    engine = await FeedSaver.getEngine({ view });
    items = FeedSaver.getFeed();
    if ( items.length === 0 ) {
      await pull( 25 );
    }
    loaded = true;
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
          smoother.stop();
          items = [];
          await FeedSaver.reset({ view });
          await loadFeed();
          smoother.start();
          feedStore.push({}); // We're using store as message queue, clear out old message.
          break;
      }
    });

    
    tabs.addEventListener("sl-tab-show", function ( event ) {
        view = event.detail.name;
        feedStore.push({ command: "reset" });
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

<sl-tab-group bind:this={tabs}>
  <sl-tab slot="nav" panel="all">All</sl-tab>
  <sl-tab slot="nav" panel="mentions">Mentions</sl-tab>
</sl-tab-group>
  
<section class="feed" bind:this={feed}>
  {#if loaded === false }
    <Spinner></Spinner>
  {:else if items.length > 0}
    {#each items as { identity, notification } }
      <Notification {identity} {...notification}></Notification>
    {/each}
  {:else if items.length === 0 }
    <section class="gobo-copy">
      <p>
        No notifications at this time.
      </p> 
    </section>
  {/if}
</section>

<style>
  sl-tab-group {
    position: sticky;
  }

  section.feed {
    overflow-y: scroll;
    padding: var(--gobo-height-spacer) 2px 5rem 2px;
    max-height: 100%;
  }



  @media( max-width: 988px ) {
    section.feed {
      padding: 2px;
    }
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