<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State, Draft, Name, Validate } from "$lib/engines/draft.js";

  let publishButton, nameParts;
  const Render = State.make();

  Render.cycle = ( draft ) => {
    const match = draft.identities?.find( i => i.active === true );
    if ( match == null ) {
      return;
    }
    nameParts = Name.split( match.prettyName );
  };

  Render.cleanup = () => {
    nameParts = [];
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
    await Draft.publish( draft );
    await Draft.clear();
    publishButton.loading = false;
    goto("/home");
  };

  Handle.discard = async () => {
    await Draft.clear();
    goto("/home");
  };


  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.cycle );
    return () => {
      Render.reset();
    }
  });
</script>


<h2>Reply</h2>
<p>
  You are replying as

  <span>
    {#each nameParts as part}
      <span>{ part }</span>
    {/each}
  </span>
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
    Reply
  </sl-button>
</div>

<style>
  p {
    margin: 0;
  }

  p span {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
  }

  p span span {
    flex: 0 0 auto;
    margin: 0;
    word-break: break-all;
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