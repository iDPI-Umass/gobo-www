<script>
  import MediaSlot from "$lib/components/MediaSlot.svelte";

  export let identity;
  export let id;
  export let attachments = [];
</script>


  {#if attachments.length === 1}
    <MediaSlot {identity} post={id} id="0" attachment={attachments[0]} isSingle={true}></MediaSlot>

  {:else if attachments.length === 2}
    <div class="media">
      <div class="left">
        <MediaSlot {identity} post={id} id="0" attachment={attachments[0]}></MediaSlot>
      </div>

      <div class="right">
        <MediaSlot {identity} post={id} id="1" attachment={attachments[1]}></MediaSlot>
      </div>
    </div>

  {:else if attachments.length === 3}
    <div class="media">
      <div class="left">
        <MediaSlot {identity} post={id} id="0" attachment={attachments[0]}></MediaSlot>
      </div>

      <div class="right">
        <div class="top">
          <MediaSlot {identity} post={id} id="1" attachment={attachments[1]}></MediaSlot>
        </div>

        <div class="bottom">
          <MediaSlot {identity} post={id} id="2" attachment={attachments[2]}></MediaSlot>
        </div>
      </div>
    </div>

  {:else if attachments.length === 4}
    <div class="media">
      <div class="left">
        <div class="top">
          <MediaSlot {identity} post={id} id="0" attachment={attachments[0]}></MediaSlot>
        </div>

        <div class="bottom">
         <MediaSlot {identity} post={id} id="2" attachment={attachments[2]}></MediaSlot>
        </div>
      </div>

      <div class="right">
        <div class="top">
          <MediaSlot {identity} post={id} id="1" attachment={attachments[1]}></MediaSlot>
        </div>

        <div class="bottom">
          <MediaSlot {identity} post={id} id="3" attachment={attachments[3]}></MediaSlot>
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


