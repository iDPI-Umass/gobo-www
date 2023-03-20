<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  export let href;
  export let heading;
</script>

<div>
  
  <sl-icon-button 
    href={href}
    src="/icons/arrow-left.svg">
  </sl-icon-button>
  
  <h1>{heading}</h1>

</div>

<style>
  div {
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 2rem;
  }

  div > h1 {
    font-size: var(--gobo-font-size-2x-large);
    font-weight: var(--gobo-font-weight-black);
    color: var(--gobo-color-text);
  }

  sl-icon-button {
    font-size: 20px;
    color: var(--gobo-color-text);
    margin-right: 2rem;
  }
</style>
