<script>
  import MentionGroup from "$lib/components/new-post/mentions/MentionGroup.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/draft.js";
  import { Mentions as MentionsEngine } from "$lib/engines/mention/index.js";

  let threadMentions;
  const Render = State.make();

  Render.cleanup = () => {
    threadMentions = [];
  };

  Render.mentions = async ( draft ) => {
    const list = [];

    for (const threadRow of draft.thread ) {
      const mentions = MentionsEngine.unroll( threadRow );
      for ( const mention of mentions ) {
        const row = threadRow[0].index;
        const indexes = {
          name: mention.name,
          row: row,
          panel: `${row}-${mention.name}`,
        };
        list.push({ threadRow, indexes });
      }
    }

    threadMentions = list;
  };


  const Handle = {};

 
  Render.reset();
  onMount(() => {
    Render.listen( "thread", Render.mentions );
    return () => {
      Render.reset();
    };
  });
</script>


{#if threadMentions.length > 0}
  <h2>Mentions</h2>
{/if}

{#each threadMentions as {threadRow, indexes} (indexes.panel)}
  <MentionGroup
    {threadRow}
    {indexes}
  />
{/each}


<style>
  :global(.panel):first-of-type {
    margin-top: 1rem;
  }
  
  :global(.panel) {
    margin-top: 1.5rem;
  }

  @media( min-width: 768px ) {
    :global(.panel) {
      margin-top: 3rem;
    }
  }
</style>