<script>
  export let url = "#";
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="outer-frame">

  <div class="inner-frame">
    <aside class="gutter">
      <div class="spine"></div>
    </aside>

    <div class="main">
      <a href={url}>View Full Thread</a>
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
    box-sizing: border-box;
  }

  .inner-frame .gutter {
    min-width: max-content;
    box-sizing: border-box;
  }

  .inner-frame .gutter .spine {
    height: 100%;
    box-sizing: border-box;
    border-right: 4px dotted var(--gobo-color-primary);
    margin-left: calc((2.8125rem / 2) - 2px);
    margin-right: calc((2.8125rem / 2) - 2px + var(--gobo-width-spacer-half));
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .inner-frame .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: flex-start;
    min-width: 0;
    min-height: 3rem;
  }

  .main a {
    font-size: var(--gobo-font-size-detail);
  }

</style>


