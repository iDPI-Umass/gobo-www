<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<section 
  class="outer-frame">

  <div class="inner-frame">
    <aside class="gutter">
      <div class="avatar"></div>
      <div class="spine"></div>
    </aside>

    <div class="main">
      <div class="filter-warning">
        <sl-icon 
          class="lens-label"
          src="/icons/filter.svg">
        </sl-icon>
        <p>This post is filtered by your settings.</p>
      </div>
    </div>


  </div>

</section>

<style>

  .inner-frame {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 0 var(--gobo-width-spacer-flex) 0 var(--gobo-width-spacer-flex);
  }

  .inner-frame .gutter {
    min-width: max-content;
  }

  .inner-frame .gutter .avatar {
    display: block;
    height: 2.8125rem;
    width: 2.8125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-half);
    border: var(--gobo-border-panel);
    background: var(--gobo-color-null);
  }

  .inner-frame .gutter .spine {
    height: calc(100% - 2.8125rem);
    width: 4px;
    background-color: var(--gobo-color-primary);
    margin-left: calc((2.8125rem / 2) - 2px);
  }

  .inner-frame .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    min-width: 0;
    min-height: 5rem;
    background: var(--gobo-color-null);
    border-radius: var(--gobo-border-radius);
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    margin-bottom: var(--gobo-height-spacer-flex);
  }

  .outer-frame .inner-frame .filter-warning {
    padding: 0.5rem 1rem;
    margin: 0;
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    max-width: max-content;
    background: var(--gobo-color-panel);
  }

  .outer-frame .inner-frame .filter-warning sl-icon {
    margin-right: var(--gobo-width-spacer);
  }

</style>


