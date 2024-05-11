<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Delivery } from "$lib/engines/platforms/publish";
  import * as deliveryStore from "$lib/stores/delivery.js";

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
    Delivery.dismissAlert( key );
  };


  Render.reset();
  onMount(() => {
    Render.listen( deliveryStore.alerts, Render.alerts );
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