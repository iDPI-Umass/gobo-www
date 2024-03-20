<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Post from "$lib/components/Post.svelte";

  import { onMount, tick } from "svelte";
  import * as Time from "@dashkite/joy/time";
  import { Feed, Position } from "$lib/engines/feed.js";
  import { State } from "$lib/engines/store.js";
  import { Scroll } from "$lib/engines/scroll.js";
  // import * as scrollStores from "$lib/stores/scroll.js";
  import * as feedStores from "$lib/stores/feed.js";
  import * as LS from "$lib/helpers/local-storage.js";
    import { feed } from "$lib/stores/scroll";

  // TODO: We can handle the observation without feed and "feed frame" right?
  //   revisit this when we adjust the layout to be more simplified.

  let _feed, _feedFrame;
  let posts, state, restorationState, scroll;
  const Render = State.make();
  Render.cleanup = () => {
    posts = [];
    state = "loading";
    restorationState = "loading";
    scroll = undefined;
  };


  Render.feed = async ( feed ) => {
    await Time.sleep(50);  // Absolute hack to deal with scroll restoration.
    posts = feed.posts;
    Render.state( feed );
    Render.restore( feed );
    Render.scroll( feed );
  };

  Render.state = ( feed ) => {
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

  Render.restore = async ( feed ) => {
    if ( restorationState !== "loading" ) {
      return;
    }
    
    let height = _feed.clientHeight;
    while ( true ) {
      await tick();
      if ( _feed.clientHeight == height ) {
        break;
      } else {
        height = _feed.clientHeight;
      }
    }

    _feedFrame.scrollTo( 0, feed.position );
    restorationState = "bounce 1";  // see Handle.scroll
  };

  Render.scroll = async ( feed ) => {
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

  // TODO: I am confused where the scroll-readjustment is coming from.
  //  My current theory is that after we've scrolled to the correct position in
  //  the feed, svelte child components do some stuff offscreen that affects
  //  the height of the feed temporarily, before it snaps back.
  // During the temporary growth, the relative scroll position changes,
  //  in the snap back, the scroll is left with an absolute change, offset
  //  by how far down we've scrolled. We need reposition again after everything
  //  settled and not store the bad positions.
  Handle.scroll = async ( event ) => {
    scroll.event( event );
    if ( restorationState === "bounce 1") {
      // console.log("bounce 1", _feedFrame.scrollTop );
      restorationState = "bounce 2";
    } else if ( restorationState === "bounce 2") {
      // console.log("bounce 2", _feedFrame.scrollTop );
      const position = await Position.read();
      _feedFrame.scrollTo( 0, position );
      restorationState = "ready";
    } else if ( restorationState === "ready" ) {
      // console.log("writing", _feedFrame.scrollTop );
      Position.write( _feedFrame.scrollTop );
    }
  };

  Handle.infiniteScroll = async ( event ) => {
    await Feed.pull( 25 );
  };


  Render.reset();
  onMount(() => {
    scroll = Scroll.make({ element: _feedFrame });
    Render.listen( feedStores.singleton, Render.feed );
    Render.listen( feedStores.command, Handle.command );
    _feedFrame.addEventListener( "scroll", Handle.scroll );
    _feedFrame.addEventListener( "gobo-infinite-scroll", Handle.infiniteScroll );

    return () => {
      _feedFrame.removeEventListener( "scroll", Handle.scroll );
      _feedFrame.removeEventListener( "gobo-infinite-scroll", Handle.infiniteScroll );
      scroll.halt();
      Render.reset();
    }
  });
</script>

<section class="feed-frame" bind:this={_feedFrame}>
  <div class="feed" bind:this={_feed}>
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
      {#each posts as { identity, post, key } (key) }
        <Post {identity} id={post.id}></Post>
      {/each}
    {:else}
      <section class="gobo-copy">
        <p>
          There was a problem displaying your feed.
        </p> 
      </section>
    {/if}


  </div>
</section>

<style>
  section.feed-frame {
    flex-grow: 1;
    overflow-y: scroll;
    max-height: calc(100dvh - 5rem);
  }

  @media( min-width: 680px ) {
    section.feed-frame {
      padding: var(--gobo-height-spacer) var(--gobo-width-spacer) 15rem var(--gobo-width-spacer); 
    }
  }

  @media ( max-width: 680px ) {
    section.feed-frame {
      padding: 0;
    }
    .gobo-copy {
      margin-left: var(--gobo-width-spacer-flex);
      margin-right: var(--gobo-width-spacer-flex);
    }
  }
</style>