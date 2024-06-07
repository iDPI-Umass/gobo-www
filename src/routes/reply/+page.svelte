<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Reference from "$lib/components/reply/Reference.svelte";
  import Body from "$lib/components/new-post/Body.svelte";
  import Options from "$lib/components/new-post/Options.svelte";
  import Alerts from "$lib/components/new-post/Alerts.svelte";
  import Publish from "$lib/components/reply/Publish.svelte";
  import { onMount } from "svelte";
  import { Identity, Draft, Lock } from "$lib/engines/draft.js";
  import { Thread } from '$lib/engines/thread.js';

  // This is asynchronous and affects signalling through the Svelte store.
  // So we must avoid both race conditions and infinite looping.
  const once = async () => {
    Draft.pruneGraph();
    Draft.load();
    await Promise.all([
      Identity.load(),
      Draft.loadReply(),
    ]);
    const draft = Lock.close();
    const thread = Thread.parse( draft );
    Draft.updateAspect( "thread", thread );
    Draft.load(); // reply can affect options.
  };

  onMount(() => {
    once();
    return () => {
      return;
    };
  });

</script>

<div class="main-child">
  <BackLink heading="New Reply">
    
    <nav class="gobo-nav">
      <sl-button
        href="/new-post"
        pill>
        Advanced
      </sl-button>
    </nav>
  
  </BackLink>

  
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
        <Options></Options>
      </section>

      <section class="panel warning">
        <Alerts></Alerts>
      </section>

      <section class="panel">
        <Publish></Publish>
      </section>
    {/await}
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

