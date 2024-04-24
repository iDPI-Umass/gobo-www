<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import { onMount } from "svelte";
  import { State, Options } from "$lib/engines/draft.js";

  const allVisibilities = [
    [ "public", "Public" ],
    [ "unlisted", "Unlisted" ],
    [ "followers only", "Followers Only" ],
    [ "direct", "Mentioned Only" ]
  ];

  let inputs;
  let allowed;
  const Render = State.make();
  Render.cleanup = () => {
    allowed = []
    inputs = {};
  };

  Render.visibility = ( draft ) => {
    let reference;
    if ( draft.reply?.data != null ) {
      const id = draft.reply.data.feed[0];
      const reply = draft.reply.data.posts.find( p => p.id === id );
      reference = reply.visibility;
    }
    reference ??= "public";

    const index = allVisibilities.findIndex( v => v[0] === reference );
    allowed = allVisibilities.slice( index );

    const current = draft.options.mastodon.visibility;
    const match = allVisibilities.find( v => v[0] === current );
    if ( match == null ) {
      Options.update( "mastodon", "visibility", allowed[0] );
    }
  };

  // Shoelace select doesn't allow option values to take spaces because it
  // they chose to delimit multiselect with spaces.
  Render.cycle = ( draft ) => {
    Render.visibility( draft );
    const options = draft.options.mastodon;
    inputs.visibility.value = options.visibility.replace( /\s/g, "-" );
    inputs.spoilerText.value = options.spoilerText;
  };


  const Handle = {};
  
  Handle.visibility = ( event ) => {
    const value = event.target.value.replace( /-/g, " " );
    Options.update( "mastodon", "visibility", value );
  };
  
  Handle.spoilerText = ( event ) => {
    Options.handle( "mastodon", "spoilerText", event );
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
      src="/icons/mastodon.svg"
      class="mastodon">
    </sl-icon>
    <h3>Mastodon</h3>
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

  sl-select {
    align-self: flex-start;
    width: 12rem;
  }

  sl-select::part(combobox) {
    font-weight: var(--gobo-font-weight-medium);
  }

</style>