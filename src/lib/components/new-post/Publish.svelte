<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { replaceState, goto } from "$app/navigation";
  import { State, Draft } from "$lib/engines/draft.js";
  import { Publish, Validate } from "$lib/engines/platforms/index.js";

  let publishButton;
  const Render = State.make();

  Render.cycle = ( draft ) => {
    return;
  };

  Render.cleanup = () => {
    return;
  }


  const Handle = {};
  Handle.publish = async function () {
    if ( publishButton.loading === true ) {
      return;
    }

    const draft = Draft.read();

    if ( !Validate.isValid( draft )) {
      publishButton.loading = false;
      return;
    }
    
    let context;
    try {
      context = await Publish.setup( draft );
    } catch ( error ) {
      console.error( error );
      Draft.pushAlert( "There was a problem assembling post data." );
      publishButton.loading = false;
      return;
    }
    
    Publish.start( context );
    replaceState( "/home" );
    goto( "/posts" );
  };

  Handle.discard = async () => {
    await Draft.clear();
  };


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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <sl-button
    on:click={Handle.discard}
    class="cancel"
    size="medium"
    pill>
    Discard Draft
  </sl-button>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <sl-button
    bind:this={publishButton}
    on:click={Handle.publish}
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