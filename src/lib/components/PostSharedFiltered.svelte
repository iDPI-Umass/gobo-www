<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";

  export let marginTop = "1rem";
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<section 
  class="outer-frame"
  style:margin-top={marginTop}>

  <div class="inner-frame">
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

  .outer-frame {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    max-width: var(--gobo-max-width-primary);
    background: var(--gobo-color-panel);
    margin-bottom: 0;
    box-sizing: border-box;
    cursor: var(--cursor);
  }


  .outer-frame .inner-frame {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin-top: var(--margin-top);
    border-left: 4px solid var(--gobo-color-text);
    padding-left: var(--gobo-width-spacer-half);
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


  .main .filter-warning sl-icon {
    margin-right: var(--gobo-width-spacer);
  }

</style>


