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
      let displayIndex = 1;
      for ( const mention of mentions ) {
        const row = threadRow[0].index;
        const indexes = {
          row,
          displayIndex,
          id: mention.id,
          panel: `${row}-${mention.id}`,
        };
        list.push({ threadRow, indexes });
        displayIndex++;
      }
    }

    threadMentions = list;
  };



 
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
  <p class="help-text">Hint: The @ in the compose box will be replaced with the text you provide. You can provide placeholder text (e.g., "accountless John Doe") instead of an&nbsp;account&nbsp;handle.</p>
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

  p.help-text {
    margin: 0 !important;
    font-size: var(--sl-input-help-text-font-size-medium) !important;
    color: var(--sl-input-help-text-color) !important;
  }
</style>