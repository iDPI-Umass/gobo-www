<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { Source } from "$lib/engines/post.js";

  export let source;
  export let hasSpine = false;

  let url = Source.href( source );
  let avatar = Source.avatar( source );
  let fallback = Source.fallback( source );
  let { headingSlot1 } = Source.headings( source );
</script>

<div class="gutter">
  <a
    target="_blank" 
    rel="noopener noreferrer nofollow"  
    href={ url }>

      <img 
        src="{ avatar }" 
        alt={`avatar for ${ headingSlot1 }`}
        onerror="this.onerror=null;this.src='{ fallback }'">

  </a>

  {#if hasSpine === true}
    <div class="spine"></div>
  {/if}
</div>

<style>
  div {
    min-width: max-content;
    display: flex;
    flex-direction: column;
  }

  div img,
  div a {
    height: 2.8125rem;
    width: 2.8125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-half);
    border: var(--gobo-border-panel);
  }

  .spine {
    height: calc(100% - 2.8125rem);
    width: 4px;
    background-color: var(--gobo-color-primary);
    margin-left: calc((2.8125rem / 2) - 2px);
  }
</style>