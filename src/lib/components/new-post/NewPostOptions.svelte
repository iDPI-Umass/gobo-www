<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import { onMount } from "svelte";
  import { State, Options, Identity } from "$lib/engines/draft.js";

  let options, hasMastodon, hasReddit, hasSmalltown;
  const Render = State.make();

  Render.cleanup = () => {
    options = {};
    hasMastodon = false;
    hasReddit = false;
    hasSmalltown = false;
  };

  Render.cycle = ( draft ) => {
    options = draft.options;
  };

  Render.identities = ( draft ) => {
    hasMastodon = Identity.hasMastodon();
    hasSmalltown = Identity.hasSmalltown();

    // In Reddit, replies are comments, not full posts. So don't show options.
    if ( draft.reply != null ) {
      hasReddit = false;
    } else {
      hasReddit = Identity.hasReddit();
    }
  };



  const Handle = {};
  Handle.visibility = ( event ) => {
    Options.handle( "visibility", event );
  };
  Handle.spoilerText = ( event ) => {
    Options.handle( "spoilerText", event );
  };
  Handle.title = ( event ) => {
    Options.handle( "title", event );
  };
  Handle.subreddit = ( event ) => {
    Options.handle( "subreddit", event );
  };
  Handle.spoiler = ( event ) => {
    Options.handle( "spoiler", event );
  };


  
  Render.reset();
  onMount(() => {
    Render.listen( "options", Render.cycle );
    Render.listen( "identities", Render.identities );
    return () => {
      Render.reset();
    };
  });
</script>


{#if hasMastodon || hasReddit || hasSmalltown }
  <section class="panel">
    <h2>Identity Specific Options</h2>
  </section>
  
  
  
  {#if hasMastodon }
    <section class="panel">
      <div class="subheading">
        <sl-icon 
          src="/icons/mastodon.svg"
          class="mastodon">
        </sl-icon>
        <h3>Mastodon</h3>
      </div>

      <sl-select
        on:sl-change={Handle.visibility}
        name="visibility"
        value={options.visibility}
        size="medium"
        pill>
        <sl-option value="public">Public</sl-option>
        <sl-option value="private">Followers Only</sl-option>
        <sl-option value="direct">Mentioned Only</sl-option>
      </sl-select>

      <sl-input
        on:sl-input={Handle.spoilerText}
        value={options.spoilerText}
        label="Spoiler Text"
        help-text="Provide text that contextualizes content behind warning."
        autocomplete="off"
        size="medium">
      </sl-input>
    </section>
  {/if}



  {#if hasReddit }
    <section class="panel">
      <div class="subheading">
        <sl-icon 
          src="/icons/reddit.svg"
          class="reddit">
        </sl-icon>
        <h3>Reddit</h3>
      </div>

      <sl-input
        on:sl-input={Handle.subreddit}
        value={options.subreddit}
        label="Target Subreddit"
        help-text="This is the subreddit where Gobo will submit your post."
        size="medium">
      </sl-input>

      <sl-input
        on:sl-input={Handle.title}
        value={options.title}
        label="Post Title"
        help-text="Provide a title that will appear in your Reddit post."
        size="medium">
      </sl-input>

      <sl-checkbox
        on:sl-change={Handle.spoiler}
        checked={options.spoiler}
        size="medium">
        Mark Text as Containing Spoilers
      </sl-checkbox>

    </section>
  {/if}



  {#if hasSmalltown }
    <section class="panel">
      <div class="subheading">
        <sl-icon 
          src="/icons/smalltown.svg"
          class="smalltown">
        </sl-icon>
        <h3>Smalltown</h3>
      </div>

      <sl-input
        on:sl-input={Handle.spoilerText}
        value={options.spoilerText}
        label="Spoiler Text"
        help-text="Provide text that contextualizes content behind warning."
        autocomplete="off"
        size="medium">
      </sl-input>
    </section>
  {/if}
{/if}

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

  sl-checkbox {
    margin-top: var(--gobo-height-spacer-flex);
  }
</style>