<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
</script>

<footer>
  <nav>
    <sl-icon-button
      src="/icons/home.svg"
      href="/home"></sl-icon-button>

    <!-- <sl-icon-button
      src="/icons/search.svg"
      href="/home/search"></sl-icon-button> -->

    <sl-icon-button
      src="/icons/identities.svg"
      href="/identities"></sl-icon-button>

    <sl-icon-button
      src="/icons/gear.svg"
      href="/settings"></sl-icon-button>

    <sl-icon-button
      src="/icons/pencil-square.svg"
      href="/home/new-post"></sl-icon-button>
  </nav>
</footer>


<style>
  footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: var(--gobo-color-panel);
    border-top: var(--gobo-border-panel);
  }


  footer > nav {
    flex: 1 0 100%;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  footer > nav > sl-icon-button {
    margin: 12px;
    font-size: 26px;
    color: var(--gobo-color-text);
  }

  @media ( min-width: 750px ) {
    footer {
      display: none;
    }
  }
</style>