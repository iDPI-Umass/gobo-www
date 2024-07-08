<script>
  import MiniMediaSlot from "$lib/components/delivery/MiniMediaSlot.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { DraftFile } from "$lib/engines/draft-file.js";

  export let delivery;

  let attachments;
  const Render = State.make();

  Render.cleanup = () => {
    attachments = [];
  };

  Render.attachments = () => {
    const files = [];
    for ( const _ of delivery.proof.files ) {
      const file = DraftFile.make( _ );
      // Only show media that got uploaded...
      if ( file.state === "uploaded" ) {
        files.push( file );
      }
    }
    attachments = files;
  };


  Render.reset();
  onMount(() => {
    Render.attachments();
    return () => {
      Render.reset();
    };
  });
  
  $: Render.attachments( delivery );
</script>


{#if attachments.length > 0}
  <div class="media-row">
    {#each attachments as attachment}
      <MiniMediaSlot {attachment} />
    {/each}
  </div>
{/if}
  
<style>
  .media-row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: var(--gobo-width-spacer-flex);
  }
</style>


