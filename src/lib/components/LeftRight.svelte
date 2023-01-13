<div class="panels">
  <div class="left-panel">
    <slot name="left"></slot>
  </div>
  
  <div class="right-panel">
    <slot name="right"></slot>
  </div>
</div>

<style>
  .panels {
    flex: 1 1 0;
    min-height: 0;
    margin: 0 1rem 1rem 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .left-panel {
    flex: 1 1 50%;
    overflow-y: scroll;
    padding: 0 1rem 0 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    /* justify-content: center; */
    align-items: center;
  }

  .right-panel {
    flex: 1 1 50%;
    padding: 0 1rem 0 1rem;
    display: flex;
    flex-direction: column;
  }

  @media ( max-width: 680px ) {
    .right-panel {
      display: none;
    }
  }  
</style>