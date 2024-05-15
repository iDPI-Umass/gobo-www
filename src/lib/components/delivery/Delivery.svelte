<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Alerts from "$lib/components/delivery/Alerts.svelte";
  import Uploads from "$lib/components/delivery/Uploads.svelte";
  import Targets from "$lib/components/delivery/Targets.svelte";
  import Buttons from "$lib/components/delivery/Buttons.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Delivery } from "$lib/engines/delivery.js";

  export let delivery;

  let state, frame;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    frame = null;
  };

  Render.delivery = async ( value ) => {
    frame = await Delivery.fromResource( delivery );
    state = "ready";
  };

  Render.reset();
  onMount(() => {
    Render.delivery();
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
      <Alerts {frame}></Alerts>
    </section>

    <section class="panel">
      <Uploads {frame}></Uploads>
    </section>

    <section class="panel">
      <Targets {frame}></Targets>
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
</style>