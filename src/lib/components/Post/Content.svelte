<script>
  import { render } from "$lib/helpers/markdown.js";
  
  export let title = null;
  export let content = "";
  export let styles = {};

  let renderedContent = render( content );
  
  styles.marginTop ??= "0";
  styles.maxHeight ??= "unset"
</script>


<section
  class="content"
  style:max-height={styles.maxHeight}
  style:margin-top={styles.marginTop}
  >
  {#if title != null}
    <h2>{title}</h2>
  {/if}

  {#if renderedContent}
    {@html renderedContent}
  {/if}          
</section>


<style>
  .content {
    max-height: var(--max-height);
    overflow-y: hidden;
    margin-bottom: 0;
    mask-image: var(--gradient);
    -webkit-mask-image: var(--gradient);
  }

  .content :global(h2) {
    font-size: 1.125rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 0.5rem;
  }

  .content :global(h3) {
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 1rem;
  }

  .content :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-bottom: 1rem;
  }
  .content :global(p:last-of-type) {
    margin-bottom: 0;
  }

  .content :global(a) {
    position: relative;
  }

  .content :global(:last-child) {
    margin-bottom: 0;
  }

  .content :global(pre) {
    white-space: pre-wrap;
  }
</style>