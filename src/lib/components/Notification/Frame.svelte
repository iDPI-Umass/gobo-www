<section class="outer">
  <div class="gutter">
    <slot name="gutter"></slot>
  </div>
 
  <div class="content">
    <slot name="content"></slot>
  </div>
</section>

<style>
  section {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    max-width: var(--gobo-max-width-primary);
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    margin-bottom: var(--gobo-height-spacer);
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    box-sizing: border-box;
    margin-top: 2.5rem;
  }

  section:first-child {
    margin-top: 0;
  }

  @media ( max-width: 680px ) {
    section {
      border-radius: 0;
      border-left: none;
      border-right: none;
      margin-bottom: calc(var(--gobo-height-spacer) / 2)
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

</style>