<script>
  import LeftNav from "$lib/components/headers/LeftNav.svelte";
  export let current;
</script>

<div class="panels">
  <LeftNav {current} ></LeftNav>
  
  <main class="main">
    <slot></slot>
  </main>
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
    z-index: 5;
  }

  main {
    flex: 1 1 100%;
    margin: 0;
    overflow: hidden;
    padding: 4px;
    display: flex;
    flex-direction: column;
  }

  @media ( max-width: 680px ) {
    main {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>