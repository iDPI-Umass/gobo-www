<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/badge/badge.js";
  import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { onMount } from "svelte";

  let button, drawer;

  const checkClose = function ( path ) {
    return function ( event ) {
      if ( window.location.pathname === path ) {
        drawer.hide();
      }
    };    
  };

  onMount(() => {
    button.addEventListener( "click", () => {
      drawer.show();
    });
  });
</script>

<header class="desktop">
  <nav>
    <a class="logo" href="/">GOBO</a>
    <div class="spacer" aria-hidden=true ></div>
    <a href="/home">Home</a>
    <a href=/identities>Identities</a>
    <div class="badge">
      David Harper
    </div>
  </nav>
</header>

<header class="mobile">
  <nav>
    <a class="logo" href="/">GOBO</a>
    <div class="spacer" aria-hidden=true ></div>
    <sl-button
      bind:this={button}
      class="hamburger"
      variant="primary"
      size="medium">
      <sl-icon slot="prefix" src="/icons/list.svg" ></sl-icon>
    </sl-button>
  </nav>
</header>

<sl-drawer 
  bind:this={drawer}
  label="GOBO Menu"
  placement="start">
  
  <VerticalNav>
    <NavLink href="/home" action={ checkClose("/home") }>Home</NavLink>
    <NavLink href="/identities" action={ checkClose("/identities") }>Identities</NavLink>
  </VerticalNav>
</sl-drawer>

<style>
  header {
    flex-direction: row;
    flex-wrap: nowrap;
    background: #fafafa;
    border-bottom: 1px solid var(--sl-color-neutral-700);
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

  header > nav > sl-button {
    flex: 0 0 auto;
    margin: 1rem;
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

  header > nav > .badge {
    min-width: max-content;
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: var(--sl-border-radius-pill);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-bold);
    font-family: var(--sl-font-sans);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    margin: 1rem;
    flex: 1 0 0%;
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