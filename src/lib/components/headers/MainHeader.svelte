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
    <a class="logo" href="/home">GOBO</a>
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
    background: var(--sl-color-neutral-50);
    border-bottom: 1px solid var(--sl-color-neutral-700);
    height: 5rem;
  }


  header > nav {
    flex: 1 1 100%;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  header > nav > a.logo {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-2x-large);
    text-decoration: none;
    color: initial;
    margin: 0;
    flex: 0 0 auto;
  }

  header > nav > .spacer {
    flex: 1 1 100%;
  }

  header > nav > a {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    text-decoration: none;
    color: initial;
    padding: 1rem;
    flex: 1 0 0%;
  }

  header > nav > a:focus {
    padding: calc( 1rem - 2px );
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