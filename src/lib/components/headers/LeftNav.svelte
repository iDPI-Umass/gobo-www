<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  export let current;

  current = "home"

</script>

<nav>
  <sl-button
    class="home {current === 'home' ? "current" : ""}"
    pill
    href="/home">
    <sl-icon src="/icons/home.svg" slot="prefix"></sl-icon>
    <span>Home</span>
  </sl-button>

  <sl-button
    class="identities {current === "identities" ? "current" : ""}"
    pill
    href="/identities">
    <sl-icon src="/icons/identities.svg" slot="prefix"></sl-icon>
    <span>Identities</span>
  </sl-button>

  <sl-button
    class="settings {current === "settings" ? "current" : ""}"
    pill
    href="/settings">
    <sl-icon src="/icons/gear.svg" slot="prefix"></sl-icon>
    <span>Settings</span>
  </sl-button>

  <sl-button
    class="cta"
    pill
    href="/home/new-post">
    <span>New Post</span>
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
    min-width: 16.125rem;
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
    width: 0;
  }

  nav > .cta::part(label) {
    color: #FFFFFF;
    font-weight: var(--gobo-font-weight-black);
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

  @media ( min-width: 750px ) {
    nav {
      display: flex;
    }
  }
</style>