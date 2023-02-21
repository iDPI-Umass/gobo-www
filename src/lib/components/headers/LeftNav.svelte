<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
</script>

<nav>
  <sl-button
    variant="text"
    href="/home">
    <sl-icon src="/icons/house.svg" slot="prefix"></sl-icon>
    <span>Home</span>
  </sl-button>

  <sl-button
    variant="text"
    href="/home/search">
    <sl-icon src="/icons/search.svg" slot="prefix"></sl-icon>
    <span>Search</span>
  </sl-button>

  <sl-button
    variant="text"
    href="/home/new-post">
    <sl-icon src="/icons/pencil-square.svg" slot="prefix"></sl-icon>
    <span>New Post</span>
  </sl-button>

  <sl-button
    variant="text"
    href="/identities">
    <sl-icon src="/icons/people.svg" slot="prefix"></sl-icon>
    <span>Identities</span>
  </sl-button>

  <sl-button
    variant="text"
    href="/settings">
    <sl-icon src="/icons/list.svg" slot="prefix"></sl-icon>
    <span>Settings</span>
  </sl-button>

</nav>

<style>
  nav {
    display: none;
    background: var(--sl-color-neutral-50);
    border-right: 1px solid var(--sl-color-neutral-700);
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0;
    width: 16rem;
  }

  nav > sl-button {
    margin: 5px 0 5px 10px;
    padding: 5px 10px 5px 0;
    border-radius: var(--sl-border-radius-medium);
  }

  nav > sl-button:hover {
    background: var(--sl-color-neutral-200);
  }

  nav > sl-button::part(base) {
    padding: 0;
    align-items: center !important;
  }

  nav > sl-button::part(label) {
    color: var(--sl-color-neutral-1000);
    font-size: 20px;
  }

  nav > sl-button > sl-icon {
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