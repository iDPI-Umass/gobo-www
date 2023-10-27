<script>
  
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="outer-frame">

  <div class="inner-frame">
    <aside class="gutter">
      <div class="spine"></div>
    </aside>

    <div class="main">
    </div>

  </div>

</div>

<style>

  .inner-frame {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 0 var(--gobo-width-spacer-flex) 0 var(--gobo-width-spacer-flex);
    height: 2rem;
    box-sizing: border-box;
  }

  .inner-frame .gutter {
    min-width: max-content;
    box-sizing: border-box;
  }

  .inner-frame .gutter .spine {
    height: 2rem;
    box-sizing: border-box;
    border-right: 4px dotted var(--gobo-color-primary);
    margin-left: calc((2.8125rem / 2) - 2px);
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .inner-frame .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    min-width: 0;
    margin-left: var(--gobo-width-spacer-flex);
  }

</style>


