<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  export let heading;
  export let styles = {};

  const Handle = {};
  Handle.click = () => history.back();

  let color = styles.color ?? "var(--gobo-color-text)";
</script>

<header>
  
  <div class="heading" style:color={color}>
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

  @media(min-width: 768px) {
    header {
      padding-left: 0;
    }
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
    color: inherit;
  }

  .nav {
    margin-top: var(--gobo-height-spacer);
  }

  sl-icon-button {
    font-size: 20px;
    margin-right: 2rem;
    color: inherit;
  }
</style>
