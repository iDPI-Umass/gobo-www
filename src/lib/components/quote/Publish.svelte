<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { goto, replaceState } from "$app/navigation";
  import { State, Draft, Name } from "$lib/engines/draft.js";
  import { Publish, Validate } from "$lib/engines/platforms/index.js";
  import { Feed as DeliveryFeed } from "$lib/engines/delivery/index.js";


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
    publishButton.loading = true;

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
    DeliveryFeed.refresh();
    Draft.clear();
    replaceState( "/home" );
    goto( "/posts" );
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


<h2>Quote</h2>
<p>
  <span>
    You are quote-posting as
  </span>

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
    Quote
  </sl-button>
</div>

<style>
  p {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.25rem;
    row-gap: 0.5rem;
  }

  p > span {
    display: flex;
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