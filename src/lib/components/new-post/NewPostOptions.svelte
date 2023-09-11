<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { onMount } from "svelte";

  let options = {};
  let hasMastodon = false;
  let hasReddit = false;

  const nullEmpty = function ( value ) {
    if ( value == null ) {
      return null
    } else {
      if ( value.length === 0 ) {
        return null;
      } else {
        return value;
      }
    }
  };

  const handleOptionVisibility = function ( event ) {
    draftStore.updateOption({
      visibility: event.target.value 
    });
  };

  const handleOptionSpoilerText = function ( event ) {
    draftStore.updateOption({ 
      spoilerText: nullEmpty( event.target.value )
    });
  };

  const handleOptionTitle = function ( event ) {
    draftStore.updateOption({
      title: nullEmpty( event.target.value )
    });
  };

  const handleOptionSubreddit = function ( event ) {
    draftStore.updateOption({
      subreddit: nullEmpty( event.target.value )
    });
  };

  const handleOptionSpoiler = function ( event ) {
    draftStore.updateOption({ 
      spoiler: event.target.checked 
    });
  }

  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( async function ( draft ) {
      options = draft.options;
      let match;
      
      // In Reddit, replies are comments, not full posts. So don't show options.
      if ( draft.reply != null ) {
        hasReddit = false;
      } else {
        match = draft.identities.find( i => i.type === "reddit" && i.active === true);
        hasReddit = match != null;
      }
      
      match = draft.identities.find( i => i.type === "mastodon" && i.active === true);
      hasMastodon = match != null;
    });

    return function () {
      unsubscribeDraft();
    };
  });
</script>


{#if hasMastodon || hasReddit }
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
        on:sl-change={handleOptionVisibility}
        name="visibility"
        value={options.visibility}
        size="medium"
        pill>
        <sl-option value="public">Public</sl-option>
        <sl-option value="private">Followers Only</sl-option>
        <sl-option value="direct">Mentioned Only</sl-option>
      </sl-select>

      <sl-input
        on:sl-input={handleOptionSpoilerText}
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
        on:sl-input={handleOptionSubreddit}
        value={options.subreddit}
        label="Target Subreddit"
        help-text="This is the subreddit where Gobo will submit your post."
        size="medium">
      </sl-input>

      <sl-input
        on:sl-input={handleOptionTitle}
        value={options.title}
        label="Post Title"
        help-text="Provide a title that will appear in your Reddit post."
        size="medium">
      </sl-input>

      <sl-checkbox
        on:sl-change={handleOptionSpoiler}
        checked={options.spoiler}
        size="medium">
        Mark Text as Containing Spoilers
      </sl-checkbox>

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