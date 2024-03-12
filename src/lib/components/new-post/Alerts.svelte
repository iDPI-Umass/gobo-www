<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { Draft, State } from "$lib/engines/draft.js";

  let alerts;
  const Render = State.make();

  Render.cleanup = () => {
    alerts = [];
  };

  Render.alerts = ( draft ) => {
    alerts = draft.alerts;
  };


  const Handle = {};
  Handle.dismiss = ( key ) => {
    return () => {
      const index = alerts.findIndex( a => a.key === key );
      if ( index > -1 ) {
        alerts.splice( index, 1 );
        Draft.updateAspect( "alerts", alerts );
      }
    };
  };


  Render.reset();
  onMount(() => {
    Render.listen( "alerts", Render.alerts );
    return () => {
      Render.reset();
    };
  });
</script>

<div>
  {#each alerts as a (a.key) }

    <sl-alert
      on:sl-hide={ Handle.dismiss( a.key )}
      variant="danger"
      open
      closable 
      class="alert">
      <sl-icon slot="icon" src="/icons/exclamation-circle.svg"></sl-icon>
      { a.message }
    </sl-alert>
  
  {/each}
</div>



<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--gobo-height-spacer-flex);
    margin-top: var(--gobo-height-spacer-flex);
  }

  sl-alert::part(base) {
    background: var(--gobo-color-null);
  }

  sl-alert::part(message) {
    color: var(--gobo-color-text);
  }
</style>