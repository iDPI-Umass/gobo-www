<script>
  import Mention from "$lib/components/new-post/mentions/Mention.svelte"
  import { onMount } from "svelte";
  import { State } from "$lib/engines/draft.js";

  export let threadRow;
  export let indexes;

  let displayIndex, displayName, groupList;
  const Render = State.make();
  Render.cleanup = () => {
    displayIndex = 1;
    displayName = "";
    groupList = [];
  };

  Render.cycle = ( threadRow, _indexes ) => {
    const list = [];
    for ( const threadItem of threadRow ) {
      if ( threadItem.mentions[_indexes.id] == null ) {
        continue;
      }
      const indexes = structuredClone( _indexes );
      indexes.group = `${indexes.panel}-${threadItem.platform}`;
      list.push({ threadItem, indexes });
    }

    displayIndex = _indexes.row + 1;
    displayName = `Mention ${_indexes.displayIndex}`;
    groupList = list;
  };


  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.cycle( threadRow, indexes );
</script>


<section class="mention-group">
  <div class="subheading">
    <h3>Post {displayIndex}, {displayName}</h3>
  </div>

  {#each groupList as { threadItem, indexes } (indexes.group)}
    <Mention
      {threadItem}
      {indexes}
    />
  {/each}  
</section>

<style>
  .mention-group {
    margin-top: 2rem;
  }

  .mention-group:first-of-type {
    margin-top: var(--gobo-height-spacer-flex);
  }

  .mention-group .subheading {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0;
  }
</style>