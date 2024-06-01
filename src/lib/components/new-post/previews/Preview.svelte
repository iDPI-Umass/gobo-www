<script>
  import Thread from "$lib/components/new-post/previews/Thread.svelte";
  import Bluesky from "$lib/components/new-post/previews/Bluesky.svelte";
  import Linkedin from "$lib/components/new-post/previews/Linkedin.svelte";
  import Mastodon from "$lib/components/new-post/previews/Mastodon.svelte";
  import Reddit from "$lib/components/new-post/previews/Reddit.svelte";
  import Smalltown from "$lib/components/new-post/previews/Smalltown.svelte";
  import { onMount } from "svelte";
  import { State, Identity } from "$lib/engines/draft.js";

  let bluesky, linkedin, mastodon, reddit, smalltown;
  const Render = State.make();

  Render.cleanup = () => {
    bluesky = [];
    linkedin = [];
    mastodon = [];
    reddit = [];
    smalltown = [];
  }

  const Helpers = {};

  Helpers.extract = ( platform, rows ) => {
    const output = [];
    
    for ( const row of rows ) {
      for ( const item of row ) {
        if ( item.platform === platform ) {
          output.push( item );
        }
      }
    }

    return output;
  };

  Render.thread = ( draft ) => {
    bluesky = Helpers.extract( "bluesky", draft.thread );
    linkedin = Helpers.extract( "linkedin", draft.thread );
    mastodon = Helpers.extract( "mastodon", draft.thread );
    reddit = Helpers.extract( "reddit", draft.thread );
    smalltown = Helpers.extract( "smalltown", draft.thread );
  };


  Render.reset();
  onMount(() => {
    Render.listen( "thread", Render.thread );
    return () => {
      Render.reset()
    };
  });
</script>


<h2>Preview</h2>
<p>
  This section provides an approximation of how your posts will appear on 
  each platform once submitted. As you edit your post, these previews will update.
</p>


{#if bluesky.length > 0}
  <h3 class="preview-header">Bluesky</h3>
  <Thread>
    {#each bluesky as post, index (index)}
      <Bluesky rawContent={post} />
    {/each}
  </Thread>
{/if}

{#if linkedin.length > 0}
  <h3 class="preview-header">LinkedIn</h3>
  <Linkedin rawContent={linkedin[0]} />
{/if}

{#if mastodon.length > 0}
  <h3 class="preview-header">Mastodon</h3>
  <Thread>
    {#each mastodon as post, index (index)}
      <Mastodon rawContent={post} />
    {/each}
  </Thread>
{/if}

{#if reddit.length > 0}
  <h3 class="preview-header">Reddit</h3>
  <Reddit rawContent={reddit[0]} />
{/if}

{#if smalltown.length > 0}
  <h3 class="preview-header">Smalltown</h3>
  <Thread>
    {#each smalltown as post, index (index)}
      <Smalltown rawContent={post} />
    {/each}
  </Thread>
{/if}


<style>
</style>