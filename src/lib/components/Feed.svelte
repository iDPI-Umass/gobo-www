<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Post from "$lib/components/Post.svelte";

  import { onMount, tick } from "svelte";
  import { Feed } from "$lib/engines/feed/index.js";
  import { State } from "$lib/engines/store.js";
  import { Scroll } from "$lib/engines/scroll.js";
  // import * as scrollStores from "$lib/stores/scroll.js";
  import * as feedStores from "$lib/stores/feed.js";
  import * as LS from "$lib/helpers/local-storage.js";

  let _feed;
  let posts, state, scroll, styles;
  const Render = State.make();
  Render.cleanup = () => {
    posts = [];
    state = "loading";
    scroll = undefined;
  };


  Render.feed = async ( feed ) => {
    posts = feed.posts;
    Render.state();
    Render.scroll( feed );
  };

  Render.state = () => {
    // Checks to see if we're expecting a delay in feed visibility.
    const isBuilding = LS.read( "gobo-building-feed" );
    
    if ( posts.length === 0 ) {
      if ( isBuilding === true ) {
        state = "building feed";
      } else {
        state = "empty";
      }
    } else {
      state = "ready";
      LS.remove( "gobo-building-feed" );
    }
  };

  Render.scroll = async ( feed ) => {
    await tick();
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
        break; // no-op to save good and ready state.
      case "hide":
      case "show":
        break; // no-ops handled at the overlay level.
      default:
        console.warn( "unrecognized post feed command", event );
    }
  };

  Handle.scroll = ( event ) => {
    scroll.event( event );
  };

  Handle.infiniteScroll = ( event ) => {
    Feed.pull( 25 );
  };

  Handle.styleOverrides = ( index ) => {
    if ( index === 0 ) {
      return { marginTop: "0" };
    } else {
      return {};
    }
  };


  Render.reset();
  onMount(() => {
    scroll = Scroll.make({ element: _feed });
    Render.listen( feedStores.singleton, Render.feed );
    Render.listen( feedStores.command, Handle.command );
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

<section class="feed" bind:this={_feed}>
  {#if state === "loading"}
    <Spinner></Spinner>
  {:else if state === "building feed"}
    <section class="gobo-copy">
      <p>
        We are fetching your feed. This may take a couple of minutes.
      </p> 
    </section>
  {:else if state === "empty"}
    <section class="gobo-copy">
      <p>
        Your feed is empty! Add or activate an identity to get started.
      </p> 
    </section>
  {:else if state === "ready"}
    {#each posts as { identity, post, key }, index (key) }
      <Post 
        {identity}
        id={post.id}
        styleOverrides={Handle.styleOverrides(index)}></Post>
    {/each}
  {:else}
    <section class="gobo-copy">
      <p>
        There was a problem displaying your feed.
      </p> 
    </section>
  {/if}
</section>

<style>
  section.feed {
    flex-grow: 1;
    overflow-y: scroll;
    max-height: calc(100dvh - 5rem);
  }

  @media( min-width: 680px ) {
    section.feed {
      padding: var(--gobo-height-spacer) var(--gobo-width-spacer) 15rem var(--gobo-width-spacer); 
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