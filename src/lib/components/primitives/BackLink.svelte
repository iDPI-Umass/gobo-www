<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  export let href;
  export let heading;
</script>

<header>
  
  <sl-icon-button 
    href={href}
    src="/icons/arrow-left.svg">
  </sl-icon-button>
  
  <h1>{heading}</h1>

</header>

<style>
  header {
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: var(--gobo-border-hr);
  }

  header > h1 {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-black);
    color: var(--gobo-color-text-menu);
  }

  sl-icon-button {
    font-size: 20px;
    color: var(--gobo-color-text);
    margin-right: 2rem;
  }

  sl-icon-button:focus-visible {
    color: var(--gobo-color-text);
  }

  @supports not selector(:focus-visible) {
    sl-icon-button:focus {
      color: var(--gobo-color-text);
    }
  }

</style>
