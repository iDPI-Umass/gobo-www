<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  export let current;
</script>

<footer>
  <nav>
    <sl-button
      pill
      href="/home"
      class="{current === "home" ? "current" : ""}">
      <sl-icon slot="prefix" src="/icons/home.svg"></sl-icon>
    </sl-button>

    <!-- <sl-button
      <sl-icon slot="prefix" src="/icons/search.svg"></sl-icon>
      href="/search"></sl-button> -->

    <sl-button
      pill
      href="/identities"
      class="{current === "identities" ? "current" : ""}">
      <sl-icon slot="prefix" src="/icons/identities.svg"></sl-icon>
    </sl-button>

    <sl-button
      pill
      href="/settings"
      class="{current === "settings" ? "current" : ""}">
      <sl-icon slot="prefix" src="/icons/gear.svg"></sl-icon>
    </sl-button>

    <sl-button
      pill
      href="/new-post"
      class="{current === "new post" ? "current" : ""}">
      <sl-icon slot="prefix" src="/icons/pencil-square.svg"></sl-icon>
    </sl-button>

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

  footer > nav > sl-button {
    margin: 12px;
    margin-top: 2px;
    font-size: 26px;
    color: var(--gobo-color-text);
  }

  footer > nav > sl-button::part(base):hover,
  footer > nav > sl-button::part(base):focus {
    color: var(--gobo-color-text);
  }


  nav > sl-button::part(base) {
    height: 2.375rem;
    padding: 0.333rem 1rem;
    height: 100%;
    background: var(--gobo-color-panel);
    color: var(--gobo-color-text-menu);
    border: none;
  }

  nav > sl-button::part(label) {
    padding-left: 0;
    font-size: var(--gobo-font-size-large);
    font-weight: var(--gobo-font-weight-medium);
  }

  nav > sl-button::part(prefix) {
    width: 1.625rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin-right: 0;
  }

  nav > sl-button::part(prefix) {
    font-size: 1.625rem; 
  }

  nav > .current::part(base) {
    background: var(--gobo-color-null);
  }

  nav > .current::part(label) {
    position: relative;
    font-weight: var(--gobo-font-weight-black);
  }

  nav > .current::part(base)::before {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 10%;
    height: 4px;
    width: 80%;
    border-radius: 4px;
    background: var(--gobo-color-primary);
  }

  @media ( min-width: 750px ) {
    footer {
      display: none;
    }
  }
</style>