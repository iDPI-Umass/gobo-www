<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import Count from "$lib/components/new-post/Count.svelte"
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";

  let content, placeholder, platforms;
  const Render = State.make();
  
  Render.cleanup = () => {
    content = null;
    placeholder = "Write your post";
    platforms = [];
  };

  Render.content = ( draft ) => {
    content = draft.content;
  };

  Render.shouldTrack = ( platforms, identity ) => {
    return identity.active === true && 
      !platforms.includes( identity.platform );
  };

  Render.identities = ( draft ) => {
    // Figure out which platforms are active so we can show the indicator.
    const px = [];
    for ( const identity of draft.identities ) {
      if ( Render.shouldTrack( px, identity )) {
        px.push( identity.platform );
      }
    }
    platforms = px;    
    
    // We set the placeholder in this aspect because it's less noisy.
    if ( draft.reply != null ) {
      placeholder = "Write your reply"
    } else if ( draft.quote != null ) {
      placeholder = "Write your quote post"
    } else {
      placeholder = "Write your post";
    }
  };


  const Handle = {};
  Handle.content = ( event ) => {
    Draft.updateAspect( "content", event.target.value );
  };


  Render.reset();
  onMount(() => {
    Render.listen( "content", Render.content );
    Render.listen( "identities", Render.identities );
    return () => {
      Render.reset();
    };
  });
</script>


<sl-textarea
  on:sl-input={ Handle.content }
  value={ content }
  { placeholder }
  size="medium"
  resize="none"
  rows=4>
</sl-textarea>

{#if platforms}
<div>
  {#each platforms as platform (platform)}
    <Count { platform }></Count>
  {/each}
</div>
{/if}

<style>
  sl-textarea {
    margin-top: var(--gobo-height-spacer-flex);
  }

  sl-textarea::part(base) {
    font-size: 1.125rem;
    border-radius: var(--gobo-border-radius)
  }

  sl-textarea::part(textarea) {
    padding: 0.5rem 1rem;
  }

  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    align-items: center;
    padding: 0;
    padding-top: var(--gobo-height-spacer-flex);
    gap: var(--gobo-width-spacer-flex);
  }
</style>