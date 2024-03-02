<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Reference from "$lib/components/quote/Reference.svelte";
  import Body from "$lib/components/new-post/Body.svelte";
  import Publish from "$lib/components/quote/Publish.svelte";
  import { onMount } from "svelte";
  import { Identity, Draft, Lock } from "$lib/engines/draft.js";

  // This is asynchronous and affects signalling through the Svelte store.
  // So we must avoid both race conditions and infinite looping.
  const once = async () => {
    Draft.pruneGraph();
    Draft.load();
    await Promise.all([
      Identity.load(),
      Draft.loadQuote(),
    ]);
    Lock.close();
  };

  onMount(() => {
    once();
    return () => {
      return;
    };
  });

</script>

<div class="main-child">
  <header>
    <BackLink heading="New Quote Post"></BackLink>
  </header>
  
  <form class="gobo-form">
    {#await once}
      <Spinner></Spinner>
    
    {:then}
      <section class="panel">
        <Reference></Reference>
      </section>

      <section class="panel">
        <Body></Body>
      </section>

      <section class="panel">
        <Publish></Publish>
      </section>
    {/await}

   
    <!-- <section class="panel">
      <NewPostOptions></NewPostOptions>
    </section>
    
    <section class="panel extra-wide">
      <NewPostPreview></NewPostPreview>
    </section>

    <section class="panel warning">
      <Alert></Alert>
    </section>
  
    <section class="panel publish">
      <NewPostPublish></NewPostPublish>     
    </section> -->
  
  </form>
</div>


<style>

  .gobo-form {
    margin-top: 0;
    padding: 0;
  }

  .gobo-form .panel {
    padding: 0 var(--gobo-width-spacer-flex) var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
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
</style>

