<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import { onMount } from "svelte";
  import { State, Options } from "$lib/engines/draft.js";

  const allVisibilities = [
    [ "public", "Public" ],
    [ "mutuals", "Connections Only" ],
  ];

  let inputs;
  let allowed;
  const Render = State.make();
  Render.cleanup = () => {
    allowed = []
    inputs = {};
  };

  // TODO: this gets more complicated with replies.
  Render.visibility = ( draft ) => {
    allowed = allVisibilities.slice();
  };

  // Shoelace select doesn't allow option values to take spaces because it
  // they chose to delimit multiselect with spaces.
  Render.cycle = ( draft ) => {
    Render.visibility( draft );
    const options = draft.options.linkedin;
    inputs.visibility.value = options.visibility.replace( /\s/g, "-" );
  };


  const Handle = {};
  
  Handle.visibility = ( event ) => {
    const value = event.target.value.replace( /-/g, " " );
    Options.update( "linkedin", "visibility", value );
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
      src="/icons/linkedin.svg"
      class="linkedin">
    </sl-icon>
    <h3>LinkedIn</h3>
  </div>

  <sl-select
    bind:this={inputs.visibility}
    on:sl-change={Handle.visibility}
    name="visibility"
    size="medium"
    pill>
    {#each allowed as entry (entry[0])}
      <sl-option value={ entry[0].replace( /\s/g, "-" )}>{ entry[1] }</sl-option>
    {/each}
  </sl-select>
</section>

<style>
  .panel .subheading {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0;
  }

  .panel .subheading sl-icon {
    font-size: 1.25rem;
    margin-right: var(--gobo-width-spacer-half);
    margin-bottom: 0;
  }

  .panel .subheading h3 {
    margin: 0 !important;
  }

  sl-select {
    margin-top: var(--gobo-height-spacer-flex);
  }

  sl-select {
    align-self: flex-start;
    width: 12rem;
  }

  sl-select::part(combobox) {
    font-weight: var(--gobo-font-weight-medium);
  }
</style>