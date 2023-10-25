<script>
  export let poll = {};

  let total = poll.total ?? 0;
  let results = poll.options ?? [];

  if ( total > 0 ) {
    for ( const result of results ) {
      result.value = ( 100 * result.count / total ).toPrecision( 3 );
    }
  } else {
    for ( const result of results ) {
      result.value = 0;
    }
  }

  total = new Intl.NumberFormat().format( total );
  
</script>


<section class="question">
  {#each results as result }
      <div class="question-text">
        <div class="question-key">{result.key}</div>
        <div class="question-value">{result.value}%</div>
      </div>
      <div class="question-bar" style="width: {result.value}%;"></div>
  {/each}

  <p class="tally">{ total } Votes</p>
</section>

<style>
  .question {
    position: relative;
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    border: var(--gobo-border-panel);
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    border-radius: var(--gobo-border-radius);
  }

  .question-text {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    margin-top: 1rem;
  }

  .question-text:first-child {
    margin-top: 0;
  }

  .question-text > .question-key {
    padding-left: 0.5rem;
    z-index: 1;
    color: var(--gobo-color-text);
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-normal);
  }

  .question-text > .question-value {
    z-index: 1;
    margin-left: var(--gobo-width-spacer-flex);
  }

  .question-bar {
    height: 0.5rem;
    background-color: var(--gobo-color-primary);
    border-radius: var(--gobo-border-radius);
    z-index: 0;
  }

  .tally {
    margin: 0;
    margin-top: var(--gobo-height-spacer);
    align-self: flex-end;
  }

</style>


