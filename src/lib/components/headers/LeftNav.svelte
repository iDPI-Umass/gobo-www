<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  export let current;
</script>

<nav>
  <sl-button
    class="home {current === 'home' ? "current" : ""}"
    pill
    href="/home">
    <sl-icon src="/icons/home.svg" slot="prefix"></sl-icon>
    Home
  </sl-button>

  <sl-button
    class="identities {current === "identities" ? "current" : ""}"
    pill
    href="/identities">
    <sl-icon src="/icons/identities.svg" slot="prefix"></sl-icon>
    Identities
  </sl-button>

  <sl-button
    class="settings {current === "settings" ? "current" : ""}"
    pill
    href="/settings">
    <sl-icon src="/icons/gear.svg" slot="prefix"></sl-icon>
    Settings
  </sl-button>

  <sl-button
    class="cta"
    pill
    href="/new-post">
    <sl-icon slot="prefix" src="/icons/pencil-square.svg"></sl-icon>
    New Post
  </sl-button>
</nav>

<style>
  nav {
    display: none;
    background: var(--gobo-color-panel);
    border-right: var(--gobo-border-panel);
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0;
    padding: var(--gobo-width-spacer);
  }

  nav > sl-button {
    width: 100%;
    margin-bottom: var(--gobo-height-spacer);
  }

  nav > sl-button::part(base) {
    height: 2.375rem;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background: var(--gobo-color-panel);
    color: var(--gobo-color-text-menu);
    border: none;
  }

  nav > sl-button::part(label) {
    display: none;
  }

  nav > sl-button::part(prefix) {
    width: 1.625rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin-right: var(--gobo-width-spacer-half);
    margin-left: 0.75rem;
  }

  nav > .home::part(prefix) {
    font-size: 1.25rem; 
  }

  nav > .identities::part(prefix) {
    font-size: 1.625rem; 
  }

  nav > .settings::part(prefix) {
    font-size: 1.25rem; 
  }

  nav > .cta::part(base) {
    background: var(--gobo-color-primary);
    border: 1px solid var(--gobo-color-primary);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
  }

  nav > .cta::part(prefix) {
    font-size: 1.25rem;
  }

  nav > .cta::part(label) {
    color: #FFFFFF;
    font-weight: var(--gobo-font-weight-black);
    padding-right: 0;
  }

  nav > .current::part(base) {
    background: var(--gobo-color-null);
  }

  nav > .current::part(label) {
    position: relative;
    font-weight: var(--gobo-font-weight-black);
  }

  nav > .current::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 10%;
    width: 4px;
    height: 80%;
    border-radius: 4px;
    background: var(--gobo-color-primary);
  }

  @media ( min-width: 1300px ) {
    nav {
      min-width: 16.125rem;
    }

    nav > sl-button::part(label) {
      display: block;
      padding-left: 0;
      font-size: var(--gobo-font-size-large);
      font-weight: var(--gobo-font-weight-medium);
    }

    nav > .cta::part(prefix) {
      display: none;
      width: 0;
    }
  }

  @media ( min-width: 750px ) {
    nav {
      display: flex;
    }
  }
</style>