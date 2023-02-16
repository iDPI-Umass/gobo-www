<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
</script>

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
    href="/settings"></sl-icon-button>
</nav>

<style>
  nav {
    display: none;
    background: var(--sl-color-neutral-50);
    border-right: 1px solid var(--sl-color-neutral-700);
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin: 0;
  }

  nav > sl-icon-button {
    font-size: 26px;
    margin: 12px;
    color: var(--sl-color-neutral-1000);
  }

  @media ( min-width: 750px ) {
    nav {
      display: flex;
    }
  }
</style>