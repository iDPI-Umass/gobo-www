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
    font-size: var(--sl-font-size-large);
    font-weight: var(--sl-font-weight-bold);
    color: var(--sl-color-neutral-1000);
  }

  sl-icon-button {
    font-size: 20px;
    color: var(--sl-color-neutral-1000);
    margin-right: 2rem;
  }
</style>
