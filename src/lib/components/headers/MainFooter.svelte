<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
</script>

<footer>
  <nav>
    <sl-icon-button
      src="/icons/house.svg"
      href="/home"></sl-icon-button>

    <sl-icon-button
      src="/icons/search.svg"
      href="/home/search"></sl-icon-button>

    <sl-icon-button
      src="/icons/pencil-square.svg"
      href="/home/new-post"></sl-icon-button>

    <sl-icon-button
      src="/icons/people.svg"
      href="/identities"></sl-icon-button>

    <sl-icon-button
      src="/icons/list.svg"
      href="/settings/profile"></sl-icon-button>
  </nav>
</footer>


<style>
  footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    flex-direction: row;
    flex-wrap: nowrap;
    background: var(--sl-color-neutral-50);
    border-top: 1px solid var(--sl-color-neutral-700);
  }


  footer > nav {
    flex: 1 1 100%;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.5rem;
  }

  footer > nav > sl-icon-button {
    margin: 0.5rem;
    font-size: 1.25rem;
  }

  @media ( min-width: 750px ) {
   footer {
     display: none;
   }
  }
</style>