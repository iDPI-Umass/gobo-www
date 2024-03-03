<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { Draft, State } from "$lib/engines/draft.js";

  let alert, message;
  const Render = State.make();

  Render.cleanup = () => {
    message = null;
  };

  Render.alert = ( draft ) => {
    if ( draft.alert == null ) {
      alert.hide();
      message = null;
    } else {
      message = draft.alert;
      alert.show();
    }
  };


  const Handle = {};
  Handle.dismiss = () => Draft.updateAspect( "alert", null );


  Render.reset();
  onMount(() => {
    Render.listen( "alert", Render.alert );
    alert.addEventListener( "sl-hide", Handle.dismiss );
    return () => {
      Render.reset();
      alert.removeEventListener( "sl-hide", Handle.dismiss );
    };
  });
</script>


<sl-alert
  bind:this={ alert }
  variant="danger"
  closable 
  class="alert">
  <sl-icon slot="icon" src="/icons/exclamation-circle.svg"></sl-icon>
  { message }
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