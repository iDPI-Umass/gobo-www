<script>
  import * as h from "$lib/engines/post.js";

  export let source;

  let url = source.proxyURL ?? source.url;
  let { headingSlot1, headingSlot2 } = h.getHeadingSlots( source );

</script>

<a 
  class="names"
  target="_blank" 
  rel="noopener noreferrer nofollow"  
  href={ url }>
  

  <div class="slot1">{ headingSlot1 }</div>
  {#if headingSlot2}
    <div class="slot2">{ headingSlot2 }</div>
  {/if}
</a>



<style>
  .names {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
  }

  a:hover {
    text-decoration: underline;
    color: inherit;
  }

  .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    color: var(--gobo-color-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 0.75rem;
  }

  .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>