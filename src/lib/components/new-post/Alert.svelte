<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { draftStore } from "$lib/stores/draft.js";
  import { onMount } from "svelte";

  let alert;
  let message = null;

  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( function ( draft ) {
      if ( draft?.alert != null ) {
        message = draft.alert;
        alert.show();
      }
    });

    const listener = function () {
      draftStore.update({ alert: null });
    };

    alert.addEventListener( "sl-hide", listener );

    return function () {
      unsubscribeDraft();
      alert.removeEventListener( "sl-hide", listener );
    };
  });
</script>


<sl-alert
  bind:this={alert}
  variant="danger"
  closable 
  class="alert">
  <sl-icon slot="icon" src="/icons/exclamation-circle.svg"></sl-icon>
  {message}
</sl-alert>


<style>
  sl-alert {
    margin-top: var(--gobo-height-spacer);
  }

  sl-alert::part(base) {
    background: var(--gobo-color-null);
  }

  sl-alert::part(message) {
    color: var(--gobo-color-text);
  }
</style>