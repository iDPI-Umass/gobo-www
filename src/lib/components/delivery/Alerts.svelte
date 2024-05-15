<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  export let frame;


  let alerts;
  const Render = State.make();

  Render.cleanup = () => {
    alerts = [];
  };

  Render.alerts = ( value ) => {
    alerts = value
  };


  const Handle = {};
  Handle.dismiss = ( key ) => {
    frame.dismissAlert( key );
  };


  Render.reset();
  onMount(() => {
    Render.listen( frame.stores.alerts, Render.alerts );
    return () => {
      Render.reset();
    };
  });
</script>

{#if alerts?.length > 0 }
  {#each alerts as a (a.key) }
    <sl-alert
      on:sl-hide={ Handle.dismiss( a.key )}
      variant="danger"
      open
      closable>
      <sl-icon slot="icon" src="/icons/exclamation-octagon.svg"></sl-icon>
      { a.message }
    </sl-alert>

  {/each}
{/if}



<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--gobo-height-spacer-flex);
    margin-top: var(--gobo-height-spacer-flex);
  }
</style>