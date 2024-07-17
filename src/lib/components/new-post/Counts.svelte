<script>
  import Count from "$lib/components/new-post/Count.svelte"
  import { onMount, createEventDispatcher } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";
  import { Thread } from "$lib/engines/thread.js";
  import * as Helpers from "$lib/engines/platforms/helpers.js";

  const dispatch = createEventDispatcher();

  let row, addButtons;
  const Render = State.make();
  
  Render.cleanup = () => {
    row = [];
    addButtons = [];
  };

  Render.buttons = ( thread = [] ) => {
    const buttons = [];
    if ( thread[0] != null ) {
      for ( const item of thread[0] ) {
        if ( !Thread.ignoredPlatforms.has( item.platform) ) {
          buttons.push( item.platform );
        }
      }
    }
    addButtons = buttons;
  };

  Render.counts = ( draft ) => {
    row = Helpers.unroll( draft );
  };

  Render.thread = ( draft ) => {  
    Render.buttons( draft.thread );  
    Render.counts( draft );
  };


  const Handle = {};

  Handle.addThreadpoint = ( platform ) => {
    return () => dispatch( "add-threadpoint", { platform } );
  };


  Render.reset();
  onMount(() => {
    Render.listen( "thread", Render.thread );
    return () => {
      Render.reset();
    };
  });
</script>

<div class="vertical">

  {#if addButtons?.length > 0}
    <div class="wrapper">
      <div class="adds">
        {#each addButtons as platform (platform)}
          <sl-button
            on:click={Handle.addThreadpoint(platform)}
            class="glyph"
            size="medium">
            <sl-icon src="/icons/{platform}.svg" class={platform} />
            <sl-icon src="/icons/plus-circle.svg" />
          </sl-button>
        {/each}
      </div>
      <p class='help-text'>Add threadpoints to break your post up into a thread. Place them where you want a new reply&nbsp;to&nbsp;start.</p>
    </div>
  {/if}

  {#if row?.length > 0}
    <div class="wrapper">
      <div class="counts">
        {#each row as item, index (`${item.platform}${index}`)}
          <Count
            platform={item.platform} 
            content={item.content}
          />
        {/each}
      </div>
    </div>
  {/if}
 
</div>


<style>
  .vertical {
    display: flex;
    flex-direction: column;
    gap: var(--gobo-height-spacer-flex);
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 0;
    padding-top: var(--gobo-height-spacer-flex);
  }

  .label {
    flex: 1 0 auto;
    display: flex;
    align-items: center;
  }

  .adds {
    flex: 0 1 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
    gap: var(--gobo-width-spacer-flex);
  }

  .counts {
    flex: 0 1 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
    gap: var(--gobo-width-spacer-flex);
  }

  sl-button::part(label) {
    padding: 0 1rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  sl-button sl-icon:nth-child(1) {
    font-size: 1rem;
  }

  sl-button sl-icon:nth-child(2) {
    font-size: 1rem;
    color: var(--gobo-color-text-muted);
    /* color: var(--gobo-color-border-panel); */
  }

  sl-button.glyph::part(base) {
    padding: 0;
  }
  sl-button.glyph::part(label) {
    padding: 0;
  }

  p.help-text {
    margin: 0 !important;
    font-size: var(--sl-input-help-text-font-size-medium) !important;
    color: var(--sl-input-help-text-color) !important;
  }
</style>