<script>
  import Count from "$lib/components/new-post/Count.svelte"
  import { onMount, createEventDispatcher } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";
  import { Thread } from "$lib/engines/thread.js";

  const dispatch = createEventDispatcher();

  let rows, addButtons;
  const Render = State.make();
  
  Render.cleanup = () => {
    rows = [];
    addButtons = [];
  };

  Render.thread = ( draft ) => {
    rows = draft.thread;
    
    const buttons = [];
    if ( rows[0] != null ) {
      for ( const item of rows[0] ) {
        if ( !Thread.ignoredPlatforms.has( item.platform) ) {
          buttons.push( item.platform );
        }
      }
    }
    addButtons = buttons;
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


{#if rows?.length > 0}
  <div class="vertical">
    <div class="wrapper">
        <div class="adds">
          {#each addButtons as platform (platform)}
            <sl-button
              on:click={Handle.addThreadpoint(platform)}
              class="cancel"
              size="medium"
              pill>
              <sl-icon src="/icons/{platform}.svg" class={platform} />
              <sl-icon src="/icons/plus-circle.svg" />
            </sl-button>
          {/each}
        </div>
    </div>
  
    
    {#each rows as rowItems, index (index)}
      
      <div class="wrapper">
        <div class="counts">
          {#each rowItems as item (item.platform)}
            <Count
              platform={item.platform} 
              content={item.content}
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}


<style>
  .vertical {
    display: flex;
    flex-direction: column;
    gap: var(--gobo-height-spacer-flex);
  }

  .wrapper {
    display: flex;
    padding: 0;
    padding-top: var(--gobo-height-spacer-flex);
    gap: var(--gobo-width-spacer);
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
    justify-content: end;
    align-items: center;
    gap: var(--gobo-width-spacer-flex);
  }

  .counts {
    flex: 0 1 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
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
    font-size: 1.5rem;
  }
</style>