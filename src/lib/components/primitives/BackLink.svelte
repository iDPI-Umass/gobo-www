<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  export let heading;

  const Handle = {};
  Handle.click = () => history.back();
</script>

<header>
  
  <div class="heading">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-icon-button 
      on:click={Handle.click}
      src="/icons/arrow-left.svg">
    </sl-icon-button>
  
    <h1>{heading}</h1>
  </div>
  

  <div class="nav">
    <slot></slot>
  </div>

</header>

<style>
  header {
    margin: 0;
    padding: 0;
    padding-top: var(--gobo-height-spacer-half);
    padding-bottom: 0;
    padding-left: var(--gobo-width-spacer-half);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  .heading {
    flex: 1 0 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  header > .heading > h1 {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-black);
    color: var(--gobo-color-text-menu);
  }

  .nav {
    margin-top: var(--gobo-height-spacer);
  }

  sl-icon-button {
    font-size: 20px;
    color: var(--gobo-color-text);
    margin-right: 2rem;
  }

  sl-icon-button:hover::part(base),
  sl-icon-button:focus::part(base) {
    color: var(--gobo-color-text);
  }

  @supports not selector(:focus-visible) {
    sl-icon-button:focus {
      color: var(--gobo-color-text);
    }
  }

</style>
