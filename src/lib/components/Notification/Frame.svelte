<section>
  <div class="main">
    <div class="gutter">
      <slot name="gutter"></slot>
    </div>
   
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
  
  <div class="footer">
    <slot name="footer"></slot>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    max-width: var(--gobo-max-width-primary);
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    box-sizing: border-box;
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .main {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex) 0 var(--gobo-width-spacer-flex);
  }

  section:first-child {
    margin-top: 0;
  }

  @media ( max-width: 680px ) {
    section {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
  }

  .gutter {
    flex: 0 0 10%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    min-width: max-content;
    padding-right: var(--gobo-width-spacer-half);
  }

  .content {
    flex: 1 0 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .footer {
    flex: 1;
    width: 100%;
  }

</style>