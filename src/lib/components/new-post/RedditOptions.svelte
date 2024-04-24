<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import { onMount } from "svelte";
  import { State, Options } from "$lib/engines/draft.js";

  let inputs;
  const Render = State.make();
  Render.cleanup = () => {
    inputs = {};
  };


  Render.cycle = ( draft ) => {
    const options = draft.options.reddit;
    inputs.title.value = options.title;
    inputs.subreddit.value = options.subreddit;
    inputs.spoiler.checked = options.spoiler;
  };


  const Handle = {};
  
  Handle.title = ( event ) => {
    Options.handle( "reddit", "title", event );
  };

  Handle.subreddit = ( event ) => {
    Options.handle( "reddit", "subreddit", event );
  };

  Handle.spoiler = ( event ) => {
    Options.handle( "reddit", "spoiler", event );
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
      src="/icons/reddit.svg"
      class="reddit">
    </sl-icon>
    <h3>Reddit</h3>
  </div>

  <sl-input
    bind:this={inputs.subreddit}
    on:sl-input={Handle.subreddit}
    label="Target Subreddit"
    help-text="This is the subreddit where Gobo will submit your post."
    size="medium"
    required>
  </sl-input>

  <sl-input
    bind:this={inputs.title}
    on:sl-input={Handle.title}
    label="Post Title"
    help-text="Provide a title that will appear in your Reddit post."
    size="medium"
    required>
  </sl-input>

  <sl-checkbox
    bind:this={inputs.spoiler}
    on:sl-change={Handle.spoiler}
    size="medium">
    Mark Text as Containing Spoilers
  </sl-checkbox>

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

  sl-input {
    margin-top: var(--gobo-height-spacer-flex);
  }

  sl-checkbox {
    margin-top: var(--gobo-height-spacer-flex);
  }
</style>