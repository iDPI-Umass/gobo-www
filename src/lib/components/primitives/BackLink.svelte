<script>
  import { allyEvent } from "$lib/helpers/event";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  export let heading;
  export let marginBottom = "2rem";

  const handleClick = allyEvent( function () {
    history.back();
  });
</script>

<header style="margin-bottom: {marginBottom}">
  
  <sl-icon-button 
    on:click={handleClick}
    on:keypress={handleClick}
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
