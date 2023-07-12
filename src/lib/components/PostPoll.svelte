<script>
  export let poll = {};

  let total = poll.total ?? 0;
  let results = poll.options ?? [];

  for ( const result of results ) {
    result.value = 100 * result.count / total;
  }
</script>

<section class="question-container">
  <div class="question-box">
    {#each results as result }
      <div class="question">
        <div class="question-value-bar" style="width: {result.value}%;"></div>
        <div class="question-key">{result.key}</div>
        <div class="question-value">{result.value}%</div>
      </div>
    {/each}
  </div>
  <p class="tally">{ new Intl.NumberFormat().format( total ) } Votes</p>
</section>

<style>
  .question-container {
    position: relative;
    margin: 0;
    overflow-y: hidden;
  }

  .question-container > .question-box {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .question-container > .question-box > .question {
    position: relative;
    width: 100%;
    height: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    margin: 0.25rem 0 0.25rem 0;
  }

  .question-container > .question-box > .question >.question-value-bar {
    height: 100%;
    position: absolute;
    left: 0;
    background-color: var(--gobo-color-primary);
    border-radius: var(--gobo-border-radius);
    z-index: 0;
  }

  .question-container > .question-box > .question > .question-key {
    padding-left: 0.5rem;
    z-index: 1;
    color: var(--gobo-color-text);
    font-weight: var(--gobo-font-weight-black);
  }

  .question-container > .question-box > .question > .question-value {
    z-index: 1;
  }

  .question-container > .tally {
    margin-bottom: 0;
  }

</style>


