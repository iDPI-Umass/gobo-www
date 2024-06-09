<script>
  import Thread from "$lib/components/new-post/previews/Thread.svelte";
  import Smalltown from "$lib/components/new-post/previews/smalltown/Smalltown.svelte";

  export let thread = [];
</script>


<Thread>
  {#if thread.length === 1}
    <Smalltown 
      threadItem={thread[0]} 
      spines={{top: false, bottom: false}}
    />
  {:else}
    
    {#each thread as item (item.index)}
      {#if item.index === 0}
        <Smalltown 
          threadItem={item} 
          spines={{top: false, bottom: false}}
          gutter={false}
        />
      
      {:else if item.index === thread.length - 1}
        <Smalltown 
          threadItem={item} 
          spines={{top: true, bottom: false}}
          gutter={true}
        />
      
      {:else}
        <Smalltown 
          threadItem={item} 
          spines={{top: true, bottom: true}}
          gutter={true}
        />
      {/if}
    {/each}
  {/if}
</Thread>

<style>

</style>