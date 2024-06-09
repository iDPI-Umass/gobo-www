<script>
  import Thread from "$lib/components/new-post/previews/Thread.svelte";
  import Bluesky from "$lib/components/new-post/previews/bluesky/Bluesky.svelte";

  export let thread = [];
</script>


<Thread>
  {#if thread.length === 1}
    <Bluesky 
      threadItem={thread[0]} 
      spines={{top: false, bottom: false}}
    />
  {:else}
    
    {#each thread as item (item.index)}
      {#if item.index === 0}
        <Bluesky 
          threadItem={item} 
          spines={{top: false, bottom: true}}
        />
      
      {:else if item.index === thread.length - 1}
        <Bluesky 
          threadItem={item} 
          spines={{top: true, bottom: false}}
        />
      
      {:else}
        <Bluesky 
          threadItem={item} 
          spines={{top: true, bottom: true}}
        />
      {/if}
    {/each}
  {/if}
</Thread>

<style>

</style>