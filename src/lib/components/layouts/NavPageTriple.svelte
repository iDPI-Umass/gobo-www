<script>
  import LeftNav from "$lib/components/headers/LeftNav.svelte";
  export let current;
</script>

<div class="panels">
  <LeftNav {current}></LeftNav>
  
  <main class="main">
    <slot name="main"></slot>
  </main>

  <aside>
    <slot name="aside"></slot>
  </aside>
</div>

<style>
  .panels {
    flex: 1 1 0%;
    min-height: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  main {
    flex: 0 1 calc( var(--gobo-max-width-primary) + (2 * var(--gobo-width-spacer-flex)) );
    margin: 0;
    padding: 0;
    max-width: calc( var(--gobo-max-width-primary) + (2 * var(--gobo-width-spacer-flex)) );
    overflow: hidden;
  }

  @media ( max-width: 680px ) {
    main {
      padding-left: 0;
      padding-right: 0;
    }
  }

  aside {
    display: none;
  }

  @media ( min-width: 988px ) {
    aside {
      flex: 1 0 auto;
      display: inherit;
      margin-top: var(--gobo-height-spacer);
      margin-right: var(--gobo-width-spacer);
    }
  }
</style>