<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  export let current;
</script>

<footer>
  <nav>
    <sl-icon-button
      src="/icons/home.svg"
      href="/home"
      class="{current === "home" ? "current" : ""}">
    </sl-icon-button>

    <!-- <sl-icon-button
      src="/icons/search.svg"
      href="/search"></sl-icon-button> -->

    <sl-icon-button
      src="/icons/identities.svg"
      href="/identities"
      class="{current === "identities" ? "current" : ""}">
    </sl-icon-button>

    <sl-icon-button
      src="/icons/gear.svg"
      href="/settings"
      class="{current === "settings" ? "current" : ""}">
    </sl-icon-button>

    <sl-icon-button
      src="/icons/pencil-square.svg"
      href="/new-post"
      class="{current === "new post" ? "current" : ""}">
    </sl-icon-button>

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

  footer > nav > sl-icon-button::part(base):hover,
  footer > nav > sl-icon-button::part(base):focus {
    color: var(--gobo-color-text);
  }


  nav > .current::part(base) {
    background: var(--gobo-color-null);
  }

  nav > .current::part(base) {
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