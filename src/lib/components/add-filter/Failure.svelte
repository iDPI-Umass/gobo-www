<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";;
  import { onMount } from "svelte";
  import { replaceState } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import * as filterStores from "$lib/stores/filter.js";

  let failure;
  const Render = State.make();
  Render.cleanup = () => {
    failure = false;
  };

  Render.failure = ( value ) => {
    failure = value.failure ?? false;
  };

  const Handle = {};

  Handle.close = () => {
    filterStores.addFailure.put({ failure: false });
    replaceState( "/settings/filters/add" );
  };
  
  Render.reset();
  onMount(() => {
    Render.listen( filterStores.addFailure, Render.failure );
    return () => {
      Render.reset();
    };
  });
</script>

{#if failure === true}
  <div>
    <sl-alert
      on:sl-hide={Handle.close}
      variant="danger"
      open
      closable>
      <sl-icon slot="icon" src="/icons/exclamation-octagon.svg"></sl-icon>
      There was a problem adding your filter.
    </sl-alert>
  </div>
  
{/if}

<style>
  div {
    padding: 1rem;
    background-color: var(--gobo-color-panel);
    border-radius: var(--gobo-border-radius);
    margin-top: 2rem;
  }
</style>