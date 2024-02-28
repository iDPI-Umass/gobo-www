<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import * as h from "$lib/engines/post.js";

  export let post;
  export let showWhy;

  let logo = h.getLogo( post.platform );
  let sourceCopy = h.getSourceCopy( post.platform );
  let url = post.proxyURL ?? post.url;

</script>

<footer>
    
  {#if showWhy === true}
    <a
      class="why"
      href="/why-am-i-seeing-this">
      <sl-icon src="/icons/question-circle.svg"></sl-icon>
    </a>
  {/if}

  <div class="spacer"></div>
  
  <a
    class="source-link"
    href="{ url }"
    target="_blank" 
    rel="noopener noreferrer nofollow">
    <sl-icon src="{ logo }" class="{ post.platform }"></sl-icon>
    <span>{ sourceCopy }</span>     
  </a>
 
</footer>


<style>
  footer {
    width: 100%;
    height: 2.5rem;
    padding: 0.5rem var(--gobo-width-spacer-flex);
    border-top: var(--gobo-border-panel);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .spacer {
    flex: 1;
  }

  footer a {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    font-size: var(--gobo-font-size-detail);
  }

  footer a sl-icon {
    font-size: 1rem;
    margin-right: 0;
  }

  footer a.source-link {
    color: var(--gobo-color-text-muted);
  }

  footer a.source-link span {
    display: none;
  }

  @media ( min-width: 425px ) {
    footer a.source-link sl-icon {
      margin-right: 0.5rem;
    }

    footer a.source-link span {
      display: inline;
    }
  }
</style>