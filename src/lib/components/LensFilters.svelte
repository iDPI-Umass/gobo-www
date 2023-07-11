<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import LensMini from "$lib/components/LensMini.svelte";

  let lenses = [{
    name: "Keyword Blocking",
    description: "This control toggles your block lenses, filtering targeted keywords."
  }];

</script>

<section class="outer-frame">

  <header>
    <h2>Lenses</h2>
  </header>

  <section class="inner-frame">
    {#each lenses as lens (lens.key)}  
      <LensMini {lens}></LensMini>
    {/each}
  </section>

</section>

<style>
  .outer-frame {
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    max-width: 20rem;
  }

  header {
    padding: 0.75rem var(--gobo-width-spacer);
    border-bottom: var(--gobo-border-panel);
    margin-bottom: var(--gobo-height-spacer-flex);
  }

  h2 {
    font-weight: var(--gobo-font-weight-black);
    font-size: 1.25rem;
    text-transform: capitalize;
  }

  .inner-frame {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }
</style>
