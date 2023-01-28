<script>
  import { scroll } from "$lib/stores/scroll.js";

  const handleWheel = function ( event ) {
    if ( window.screen.width > 750 ) {
      event.preventDefault();
      scroll.push({
        deltaY: event.deltaY
      });
    }
  };
  
</script>

<div class="panels">
  <div class="left-panel" on:wheel={handleWheel}>
    <slot name="left"></slot>
  </div>
  
  <main class="right-panel">
    <slot name="right"></slot>
  </main>
</div>

<style>
  .panels {
    flex: 1 1 0%;
    min-height: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .left-panel {
    flex: 0 0 auto;
    overflow-y: scroll;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    max-width: 20rem;
  }

  .right-panel {
    flex: 0 0 auto;
    margin: 2rem 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  @media ( min-width: 750px ) {
    .panels {
      flex-direction: row;
    }

    .left-panel {
      flex: 1 2 33%;
      margin: 1rem;
    }

    .right-panel {
      flex: 2 1 67%;
      margin: 1rem;
      padding-left: 3rem;
    }
  }  
</style>