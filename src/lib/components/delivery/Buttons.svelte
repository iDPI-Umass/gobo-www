<script>
  import * as Value from "@dashkite/joy/value";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { goto } from "$app/navigation";
  import { onMount, createEventDispatcher } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Delivery } from "$lib/engines/delivery/index.js";
  import { Feed } from "$lib/engines/delivery/index.js";
  import { Draft } from "$lib/engines/draft";
  import { DraftFile } from "$lib/engines/draft-file.js";

  export let delivery;
  
  let redraftButton, deleteButton;
  const Render = State.make();

  Render.cleanup = () => {
  };

  const dispatch = createEventDispatcher();


  const Handle = {};
  
  Handle.redraft = () => {
    const draft = Value.clone( delivery.draft.store );
    draft.attachments = [];
    for ( const file of delivery.files ) {
      draft.attachments.push( DraftFile.make(file) );
    }
    Draft.update( draft );
    goto( "/new-post" );
  }

  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });
</script>


<div class="buttons">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <sl-button
    bind:this={redraftButton}
    on:click={Handle.redraft}
    class="submit"
    size="medium"
    pill>
    Re-Draft
  </sl-button>
</div>



<style>
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: end;
    align-items: center;
    margin-top: 2rem;
    border-top: none;
    padding-top: 0;
  }

  .buttons sl-button {
    margin-bottom: 0;
    width: 7rem;
  }
</style>