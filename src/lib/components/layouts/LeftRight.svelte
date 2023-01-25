<div class="panels">
  <main class="left-panel">
    <slot name="left"></slot>
  </main>
  
  <div class="right-panel">
    <slot name="right"></slot>
  </div>
</div>

<style>
  .panels {
    flex: 1 1 0;
    min-height: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .left-panel {
    flex: 1 1 50%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    margin: 1rem;
  }

  .right-panel {
    flex: 1 1 50%;
    display: none;
    flex-direction: column;
    margin: 0rem 1rem 1rem 1rem;
  }

  @media ( min-width: 680px ) {
    .left-panel {
      margin: 1rem;
    }

    .right-panel {
      display: flex;
      margin: 1rem;
    }
  }  
</style>