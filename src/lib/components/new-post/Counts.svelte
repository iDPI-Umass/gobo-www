<script>
  import Count from "$lib/components/new-post/Count.svelte"
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";

  let rows;
  const Render = State.make();
  
  Render.cleanup = () => {
    rows = [];
  };

  Render.thread = ( draft ) => {
    rows = draft.thread;
  }


  Render.reset();
  onMount(() => {
    Render.listen( "thread", Render.thread );
    return () => {
      Render.reset();
    };
  });
</script>


{#if rows}
  {#each rows as rowItems, index (index)}
    
    <div>
      {#each rowItems as item (item.platform)}
        <Count 
          platform={item.platform} 
          content={item.content}
        />
      {/each}
    </div>
  
  {/each}
{/if}


<style>
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