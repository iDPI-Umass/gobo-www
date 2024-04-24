<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import { onMount } from "svelte";
  import { State, Options } from "$lib/engines/draft.js";

  let inputs;
  const Render = State.make();
  Render.cleanup = () => {
    inputs = {};
  };

  Render.cycle = ( draft ) => {
    const options = draft.options.smalltown;
    inputs.spoilerText.value = options.spoilerText;
  };


  const Handle = {};
  
  Handle.spoilerText = ( event ) => {
    Options.handle( "smalltown", "spoilerText", event );
  };
 

  Render.reset();
  onMount(() => {
    Render.listen( "options", Render.cycle );
    return () => {
      Render.reset();
    };
  });
</script>


<section class="panel">
  <div class="subheading">
    <sl-icon 
      src="/icons/smalltown.svg"
      class="smalltown">
    </sl-icon>
    <h3>Smalltown</h3>
  </div>

  <sl-input
    bind:this={inputs.spoilerText}
    on:sl-input={Handle.spoilerText}
    label="Spoiler Text"
    help-text="Provide text that contextualizes content behind warning."
    autocomplete="off"
    size="medium">
  </sl-input>
</section>

<style>
  .panel .subheading {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: var(--gobo-height-spacer-flex);
  }

  .panel .subheading sl-icon {
    font-size: 1.25rem;
    margin-right: var(--gobo-width-spacer-half);
    margin-bottom: 0;
  }

  .panel .subheading h3 {
    margin: 0 !important;
  }

  sl-input, sl-select {
    margin-top: var(--gobo-height-spacer-flex);
  }

</style>