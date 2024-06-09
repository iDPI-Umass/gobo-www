<script>
  import Thread from "$lib/components/new-post/previews/Thread.svelte";
  import Mastodon from "$lib/components/new-post/previews/mastodon/Mastodon.svelte";

  export let thread = [];
</script>


<Thread>
  {#if thread.length === 1}
    <Mastodon 
      threadItem={thread[0]} 
      spines={{top: false, bottom: false}}
    />
  {:else}
    
    {#each thread as item (item.index)}
      {#if item.index === 0}
        <Mastodon 
          threadItem={item} 
          spines={{top: false, bottom: false}}
          gutter={false}
        />
      
      {:else if item.index === thread.length - 1}
        <Mastodon 
          threadItem={item} 
          spines={{top: true, bottom: false}}
          gutter={true}
        />
      
      {:else}
        <Mastodon 
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