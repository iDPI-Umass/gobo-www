<header>
  <nav>
    <a class="logo" href="/">
      <img src="/images/gobo-logo.svg" alt="Main logo for the GOBO application">
    </a>
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
</style>