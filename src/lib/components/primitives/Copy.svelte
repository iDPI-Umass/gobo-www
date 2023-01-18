<script>
  export let maxWidth = "32rem";
</script>

<section style="
  --max-width:{maxWidth};">
  <slot></slot>
</section>

<style>
  section {
    max-width: var(--max-width);
    margin: 0;
    padding: 0;
  }

  section :global( h1 ) {
    font-size: var(--sl-font-size-x-large);
    margin-bottom: 2rem;
  }

  section :global( h2 ) {
    font-size: var(--sl-font-size-large);
    margin-bottom: 1rem;
  }

  section :global( p + h2 ) {
    font-size: var(--sl-font-size-large);
    margin-top: 2rem;
  }

  section :global( p ) {
    font-size: var(--sl-font-size-medium);
    margin-bottom: 1rem;
  }

</style>