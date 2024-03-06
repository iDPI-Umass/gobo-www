<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State, Draft, Name, Validate } from "$lib/engines/draft.js";
  import { allyEvent } from "$lib/helpers/event";

  let publishButton, nameParts;
  const Render = State.make();

  Render.cycle = ( draft ) => {
    return;
  };

  Render.cleanup = () => {
    return;
  }


  const Handle = {};
  Handle.publish = allyEvent(async function () {
    if ( publishButton.loading === true ) {
      return;
    }

    if ( !Validate.isValid() ) {
      publishButton.loading = false;
      return;
    }
    
    publishButton.loading = true;
    const draft = Draft.read();
    await Draft.publish( draft );
    await Draft.clear();
    publishButton.loading = false;
    goto("/home");
  });

  Handle.discard = allyEvent(async () => {
    await Draft.clear();
  });


  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.cycle );
    return () => {
      Render.reset();
    }
  });
</script>


<h2>Publish</h2>
<p>
  Gobo will issue requests to each of the identities you specified.
</p>

<div class="buttons">
  <sl-button
    on:click={Handle.discard}
    on:keypress={Handle.discard}
    class="cancel"
    size="medium"
    pill>
    Discard Draft
  </sl-button>

  <sl-button
    bind:this={publishButton}
    on:click={Handle.publish}
    on:keypress={Handle.publish}
    class="submit"
    size="medium"
    pill>
    Publish
  </sl-button>
</div>

<style>
  p {
    margin: 0;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    border-top: none;
    padding-top: 0;
  }

  .buttons sl-button {
    margin-bottom: 0;
    width: 10rem;
  }
</style>