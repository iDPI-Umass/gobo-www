<script>
  import * as Time from "@dashkite/joy/time";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Content from "$lib/components/delivery/Content.svelte";
  import Uploads from "$lib/components/delivery/Uploads.svelte";
  import Targets from "$lib/components/delivery/Targets.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Delivery } from "$lib/engines/delivery/index.js";

  export let delivery;

  let state, current;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    current = null;
  };

  Render.current = async () => {
    current = delivery;
    state = "ready";

    while ( Helpers.isActive( current ) ) {
      current = await Delivery.get( current.id );
      await Time.sleep( 3000 );
    }
  };

  const Helpers = {};

  Helpers.isActive = ( delivery ) => {
    return (delivery != null) &&
      Helpers.isNew( delivery ) &&
      Helpers.needsRefresh( delivery );
  }

  Helpers.isNew = ( delivery ) => {
    const now = (new Date).toISOString();
    const timestamp = new Date( delivery.created );
    timestamp.setUTCMinutes( timestamp.getUTCMinutes() + 5 );
    return now < timestamp.toISOString();
  };

  Helpers.needsRefresh = ( delivery ) => {
    const proof = delivery.proof;
    if ( proof == null || !["submitted", "error"].includes(proof.state) ) {
      return true;
    }
    
    for ( const file of proof.files ) {
      if ( !["uploaded", "error"].includes(file.state) ) {
        return true;
      }
    }

    for ( const target of delivery.targets ) {
      if ( !["delivered", "error"].includes(target.state) ) {
        return true;
      }
    }

    return false;
  }


  Render.reset();
  onMount(() => {
    Render.current();
    return () => {
      Render.reset();
    };
  });

  $: Render.current( delivery );
</script>


<section class="gobo-copy">
  {#if state === "loading"}
    <Spinner></Spinner>

  {:else if state === "ready"}
    {#if current.proof?.content}
      <section class="panel">
        <Content delivery={current}></Content>
      </section>
    {/if}

    {#if current.files.length > 0}
      <section class="panel">
        <Uploads delivery={current}></Uploads>
      </section>
    {/if}

    {#if current.targets.length > 0}
      <section class="panel">
        <Targets delivery={current}></Targets>
      </section>
    {/if}

  {/if}
</section>


<style>
  .gobo-copy {
    margin-top: var(--gobo-height-spacer-flex);
    padding: 0;
  }

  .gobo-copy .panel {
    padding: var(--gobo-width-spacer-flex) var(--gobo-height-spacer-flex);
    margin: 0;
    border-bottom: var(--gobo-border-panel);
  }

  .gobo-copy .panel:empty {
    padding: 0;
    margin: 0;
    border-bottom: none;
  }

  .gobo-copy .panel:last-child {
    border-bottom: none;
  }

  .gobo-copy .panel :global(h2) {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-medium);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-copy .panel :global(h3) {
    font-size: var(--gobo-font-size-large);
    font-weight: var(--gobo-font-weight-black);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-copy .panel :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .gobo-copy .panel :global(*):first-child {
    margin-top: 0;
  }
</style>