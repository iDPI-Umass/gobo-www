<script>
  import * as Time from "@dashkite/joy/time";
  import * as Value from "@dashkite/joy/value";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Content from "$lib/components/delivery/Content.svelte";
  import Uploads from "$lib/components/delivery/Uploads.svelte";
  import Media from "$lib/components/delivery/Media.svelte";
  import Targets from "$lib/components/delivery/Targets.svelte";
  import Buttons from "$lib/components/delivery/Buttons.svelte";
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

  Render.current = () => {
    current = delivery;
    state = "ready";    
  };

  Render.start = async () => {
    while ( Helpers.isActive( current ) ) {
      current = await Delivery.get( current.id );
      await Time.sleep( 3000 );
    }
  }


  const Handle = {};

  Handle.unpublish = async () => {
    current = await Delivery.get( current.id );
    Render.start();
  };


  const Helpers = {};

  Helpers.isActive = ( delivery ) => {
    return (delivery != null) &&
      ( state === "ready" ) &&
      Helpers.hasRecent( delivery ) &&
      Helpers.needsRefresh( delivery );
  }

  Helpers.hasRecent = ( delivery ) => {
    const now = (new Date).toISOString();
    
    const overall = new Date( delivery.updated );
    overall.setUTCMinutes( overall.getUTCMinutes() + 5 );
    if ( now < overall.toISOString() ) {
      return true;
    }

    for ( const target of delivery.targets ) {
      const timestamp = new Date( target.updated );
      timestamp.setUTCMinutes( timestamp.getUTCMinutes() + 5 );
      if( now < timestamp.toISOString() ) {
        return true;
      }
    }
    return false;
  };

  Helpers.states = [
    "pending"
  ];

  Helpers.needsRefresh = ( delivery ) => {
    const proof = delivery.proof;
    if ( proof == null || Helpers.states.includes(proof.state) ) {
      return true;
    }
    
    for ( const file of proof.files ) {
      if ( Helpers.states.includes(file.state) ) {
        return true;
      }
    }

    if ( delivery.targets.length === 0 ) {
      return true;
    }

    for ( const target of delivery.targets ) {
      if ( Helpers.states.includes(target.state) ) {
        return true;
      }
    }

    return false;
  }


  Render.reset();
  onMount(() => {
    Render.current();
    Render.start();
    return () => {
      Render.reset();
    };
  });
</script>


<section class="gobo-copy">
  {#if state === "loading"}
    <Spinner></Spinner>

  {:else if state === "ready"}
    <section class="panel">
      <div class="content">
        <Content delivery={current} />
      </div>
      
      {#if current.proof.files.length > 0}
        <div class="media">
          {#if current.files.length > 0}
            <Media delivery={current} />
          {/if}
        </div>
      {/if}
    </section>

    {#if current.targets.length > 0}
      <section class="panel">
        <Targets delivery={current} on:unpublish={Handle.unpublish}/>
      </section>
    {/if}

    <section class="panel">
      <Buttons delivery={current} />
    </section>

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

  .gobo-copy .panel .media {
    margin-top: 1rem;
  }
</style>