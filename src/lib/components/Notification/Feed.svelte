<script>
  import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
  import "@shoelace-style/shoelace/dist/components/tab/tab.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Notification from "$lib/components/Notification/Notification.svelte";
  
  import { onMount, tick } from "svelte";
  import { Feed, Position, Count } from "$lib/engines/notification.js";
  import { State } from "$lib/engines/store.js";
  import { Scroll } from "$lib/engines/scroll.js";
  // import * as scrollStores from "$lib/stores/scroll.js";
  import * as notificationStores from "$lib/stores/notification.js";

  let _feed, _tabs;
  let notifications, state, scroll, view;
  const Render = State.make();
  Render.cleanup = () => {
    notifications = [];
    state = "loading";
    scroll = undefined;
    view = "all";
  };


  Render.feed = async ( feed ) => {
    notifications = feed.notifications;
    Render.state();
    Render.scroll( feed );
    Count.clear();
  };

  Render.state = () => {    
    if ( notifications.length === 0 ) {
      state = "empty";
    } else {
      state = "ready";
    }
  };

  Render.scroll = async ( feed ) => {
    await tick();
    // TODO: Scroll restoration.
    // _feed.scrollTo( 0, feed.position );
    scroll.listen();
  };


  const Handle = {};
  Handle.command = async ( event ) => {
    switch ( event.name ) {
      case "refresh":
        state = "loading";
        scroll.wait();
        await Feed.pull( 25 );
        Feed.command( "ready" );
        break;
      case "ready":
        break; // no-op
      default:
        console.warn("unrecognized feed command", event);
    }
  };

  Handle.tab = async ( event ) => {
    view = event.detail.name;
    Feed.refresh({ view });
  };

  Handle.scroll = ( event ) => {
    scroll.event( event );
    Position.write( _feed.scrollTop );
  };

  Handle.infiniteScroll = ( event ) => {
    Feed.pull( 25 );
  };


  Render.reset();
  onMount(() => {
    scroll = Scroll.make({ element: _feed });
    Render.listen( notificationStores.singleton, Render.feed );
    Render.listen( notificationStores.command, Handle.command );
    _feed.addEventListener( "scroll", Handle.scroll );
    _feed.addEventListener( "gobo-infinite-scroll", Handle.infiniteScroll );
    return () => {
      _feed.removeEventListener( "scroll", Handle.scroll );
      _feed.removeEventListener( "gobo-infinite-scroll", Handle.infiniteScroll );
      scroll.halt();
      Render.reset();
    }
  });
</script>

<sl-tab-group bind:this={_tabs} on:sl-tab-show={Handle.tab}>
  <sl-tab slot="nav" panel="all">All</sl-tab>
  <sl-tab slot="nav" panel="mentions">Mentions</sl-tab>
</sl-tab-group>
  
<section class="feed" bind:this={_feed}>
  {#if state === "loading"}
    <Spinner></Spinner>
  {:else if state === "empty"}
    <section class="gobo-copy">
      <p>
        No notifications at this time.
      </p> 
    </section>
  {:else if state === "ready"}
    {#each notifications as { identity, notification, key } (key) }
      <Notification {identity} {notification}></Notification>
    {/each}
  {:else}
    <section class="gobo-copy">
      <p>
        There was a problem displaying your notifications.
      </p> 
    </section>
  {/if}
</section>

<style>
  sl-tab-group {
    position: sticky;
  }

  section.feed {
    flex-grow: 1;
    overflow-y: scroll;
    max-height: calc(100dvh - 5rem);
  }

  @media( min-width: 680px ) {
    section.feed {
      padding: var(--gobo-height-spacer) var(--gobo-width-spacer) 10rem var(--gobo-width-spacer); 
    }
    sl-tab-group {
      padding: var(--gobo-height-spacer) var(--gobo-width-spacer) 0 var(--gobo-width-spacer); 
    }
  }

  @media ( max-width: 680px ) {
    section.feed {
      padding: var(--gobo-height-spacer) 0 10rem 0;
    }
    sl-tab-group {
      padding: var(--gobo-height-spacer) 0 0 0;
    }

    .gobo-copy {
      margin-left: var(--gobo-width-spacer-flex);
      margin-right: var(--gobo-width-spacer-flex);
    }
  }
</style>