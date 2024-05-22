<script>
  import MediaSlot from "$lib/components/delivery/MediaSlot.svelte";
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


{#if attachments.length === 1}
  <MediaSlot attachment={attachments[0]} isSingle={true}></MediaSlot>

{:else if attachments.length === 2}
  <div class="media">
    <div class="left">
      <MediaSlot attachment={attachments[0]}></MediaSlot>
    </div>

    <div class="right">
      <MediaSlot attachment={attachments[1]}></MediaSlot>
    </div>
  </div>

{:else if attachments.length === 3}
  <div class="media">
    <div class="left">
      <MediaSlot attachment={attachments[0]}></MediaSlot>
    </div>

    <div class="right">
      <div class="top">
        <MediaSlot attachment={attachments[1]}></MediaSlot>
      </div>

      <div class="bottom">
        <MediaSlot attachment={attachments[2]}></MediaSlot>
      </div>
    </div>
  </div>

{:else if attachments.length === 4}
  <div class="media">
    <div class="left">
      <div class="top">
        <MediaSlot attachment={attachments[0]}></MediaSlot>
      </div>

      <div class="bottom">
        <MediaSlot attachment={attachments[2]}></MediaSlot>
      </div>
    </div>

    <div class="right">
      <div class="top">
        <MediaSlot attachment={attachments[1]}></MediaSlot>
      </div>

      <div class="bottom">
        <MediaSlot attachment={attachments[3]}></MediaSlot>
      </div>
    </div>
  </div>

{/if}
  
<style>
  .media {
    /* Must be an even number */
    --gap: 10px;
    position: relative;
    height: min( 40vw, 284px );
    max-width: 36rem;
    border-radius: var(--gobo-border-radius);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  .media > .left,
  .media > .right {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  .media > .left {
    margin-right: var(--gap);
  }

  .media > .left > .top,
  .media > .left > .bottom,
  .media > .right > .top,
  .media > .right > .bottom {
    height: calc( ( 0.5 * min( 40vw, 284px ) ) - calc( 0.5 * var(--gap) ) );
    border-radius: var(--gobo-border-radius);
  }

  .media > .left > .top,
  .media > .right > .top {
    margin-bottom: var(--gap);
  }
</style>


