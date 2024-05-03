<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
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

    if ( !Validate.isValid() ) {
      publishButton.loading = false;
      return;
    }
    
    publishButton.loading = true;
    const draft = Draft.read();
    const result = await Publish.flow( draft );
    publishButton.loading = false;
    
    if ( result.success === true ) {
      await Draft.clear();
      goto("/home");
    }
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