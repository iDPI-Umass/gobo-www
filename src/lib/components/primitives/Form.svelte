<script>
  export let maxWidth = "32rem";
</script>

<form style="
  --max-width:{maxWidth};">
  <slot></slot>
</form>

<style>
  form {
    max-width: var(--max-width);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  form :global( h1 ) {
    font-size: var(--sl-font-size-x-large);
    margin-bottom: 2rem;
  }

  form :global( h2 ) {
    font-size: var(--sl-font-size-large);
    margin-bottom: 1rem;
  }

  form > :global( * ) {
    margin-bottom: 2rem;
  }

  form > :global( sl-divider ) {
    margin-bottom: 1rem;
  }

  form > :global( sl-button ) {
    align-self: flex-end;
  }
</style>