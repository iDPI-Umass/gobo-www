<script>
  import { allyEvent } from "$lib/helpers/event";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  export let heading;

  const handleClick = allyEvent( function () {
    history.back();
  });
</script>

<header>
  
  <div class="heading">
    <sl-icon-button 
      on:click={handleClick}
      on:keypress={handleClick}
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

  sl-icon-button:focus-visible {
    color: var(--gobo-color-text);
  }

  @supports not selector(:focus-visible) {
    sl-icon-button:focus {
      color: var(--gobo-color-text);
    }
  }

</style>
