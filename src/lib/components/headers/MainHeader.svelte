<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import ProfileBadge from "$lib/components/primitives/ProfileBadge.svelte"
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
</script>

<header class="desktop">
  <nav>
    <a class="logo" href="/home">
      <img src="/images/gobo-logo.svg" alt="Main logo for the GOBO application">
    </a>
    <div class="spacer" aria-hidden=true ></div>
    <ProfileBadge></ProfileBadge>
  </nav>
</header>

<header class="mobile">
  <nav>
    <a class="logo" href="/home">GOBO</a>
  </nav>
</header>

<style>
  header {
    flex-direction: row;
    flex-wrap: nowrap;
    background: var(--gobo-color-panel);
    color: var(--gobo-color-text);
    border-bottom: var(--gobo-border-panel);
    height: 4.625rem;
  }


  header > nav {
    flex: 1 1 100%;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  header > nav > .logo {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-2x-large);
    text-decoration: none;
    color: initial;
    margin: 4px;
    padding: calc( 1rem - 4px ); 
    flex: 0 0 auto;
  }

  header > nav > .logo:focus {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-2x-large);
    text-decoration: none;
    color: initial;
    margin: 4px;
    padding: calc( 1rem - 6px ); 
    flex: 0 0 auto;
  }

  header > nav > .spacer {
    flex: 1 1 100%;
  }

  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
  }

  @media ( min-width: 680px ) {
    .mobile {
      display: none;
    }
    .desktop {
      display: flex;
    }
  }
</style>