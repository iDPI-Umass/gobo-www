<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";  
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Reference from "$lib/components/new-post/Reference.svelte";
  import Body from "$lib/components/new-post/Body.svelte";
  import Media from "$lib/components/new-post/Media.svelte";
  import Identities from "$lib/components/new-post/Identities.svelte";
  import Options from "$lib/components/new-post/Options.svelte";
  import NewPostPreview from "$lib/components/new-post/previews/Preview.svelte";
  import Publish from "$lib/components/new-post/Publish.svelte";
  import Alerts from "$lib/components/new-post/Alerts.svelte";
  import { onMount } from "svelte";
  import { State, Draft, Identity, Lock } from "$lib/engines/draft.js";

  let mediaPanel;
  let heading;
  const Render = State.make();

  Render.cleanup = () => {
    heading = "New Post";
  };

  Render.cycle = ( draft ) => {
    if( draft.reply != null ) {
      heading = "New Reply";
    } else if( draft.quote != null ) {
      heading = "New Quote";
    } else {
      heading = "New Post";
    }
  };

  
  // This is asynchronous and affects signalling through the Svelte store.
  // So we must avoid both race conditions and infinite looping.
  const once = async () => {
    Draft.pruneGraph();
    Draft.load();
    await Promise.all([
      Identity.load(),
      Draft.loadReply(),
      Draft.loadQuote(),
    ]);
    if ( Lock.isRequired() ) {
      Lock.close();
    }
  };


  Render.reset();
  onMount(() => {
    Render.listen( "reply", Render.cycle );
    Render.listen( "quote", Render.cycle );
    once();
    return () => {
      Render.reset();
    };
  });
</script>

<div class="main-child">
  <BackLink { heading }></BackLink>
  
  <form class="gobo-form">

    <section class="panel">
      <Reference></Reference>
    </section>
  
    <section class="panel">
      <Body></Body>
    </section>
  
  
    <section 
      class="panel"
      ondragover="return false" 
      on:dragenter={mediaPanel.dragEnter}
      on:dragleave={mediaPanel.dragLeave}
      on:drop={mediaPanel.drop}>
      <Media bind:this={mediaPanel}></Media>
    </section>
  
  
    <section class="panel">
      <Identities></Identities>
    </section>

    <section class="panel">
      <Options></Options>
    </section>
    
    <section class="panel extra-wide">
      <NewPostPreview></NewPostPreview>
    </section>

    <section class="panel warning">
      <Alerts></Alerts>
    </section>
  
    <section class="panel publish">
      <Publish></Publish>     
    </section>
  
  </form>
</div>


<style>

  .gobo-form {
    margin-top: var(--gobo-height-spacer-flex);
    padding: 0;
  }

  .gobo-form .panel {
    padding: var(--gobo-width-spacer-flex) var(--gobo-height-spacer-flex);
    margin: 0;
    border-bottom: var(--gobo-border-panel);
  }

  .gobo-form .panel:empty {
    padding: 0;
    margin: 0;
    border-bottom: none;
  }

  .gobo-form .panel :global(h2) {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-medium);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-form .panel :global(h3) {
    font-size: var(--gobo-font-size-large);
    font-weight: var(--gobo-font-weight-black);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-form .panel :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .gobo-form .panel :global(*):first-child {
    margin-top: 0;
  }
</style>

