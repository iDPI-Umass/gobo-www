<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
  import "@shoelace-style/shoelace/dist/components/menu/menu.js";
  import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State, Options } from "$lib/engines/draft.js";
  import { Draft, Identity } from "$lib/engines/draft.js";
  import { Mention } from "$lib/engines/mention/index.js";
  import { Query } from "$lib/engines/mention/query.js";
  import { Thread } from "$lib/engines/thread.js";

  export let threadItem;
  export let indexes;

  const supported = [
    "bluesky",
    "mastodon",
    "smalltown"
  ];

  let _mention, mentionInput, suggestionBox;
  let scopedItem, mention; 
  let platform, identity, nameType;
  let queryHandle, state, suggestions, currentQuery;
  const Render = State.make();
  Render.cleanup = () => {
    scopedItem = null;
    mention = null;
    platform = "";
    nameType = "";

    queryHandle = undefined;
    state = "loading";
    suggestions = [];
    currentQuery = "";
  };

  Render.initalize = ( threadItem, indexes ) => {
    scopedItem = structuredClone( threadItem );
    mention = scopedItem.mentions[ indexes.name ];
    
    platform = mention.platform;
    identity = Identity.findActive( platform );
    
    nameType = mention.type;
    mentionInput.value = mention.value;
    suggestionBox.disabled = !supported.includes( platform );

    queryHandle.listen();
  };

  Render.suggestionsIncoming = ( event ) => {
    state = "loading";
  }

  Render.suggestions = ( event ) => {
    suggestions = event.detail.suggestions;
    state = "ready";
  };


  const Handle = {};

  Handle.updateMention = ( value ) => {
    Mention.update( mention, value );
    nameType = mention?.type;
    mentionInput.value = mention.value;

    const thread = Draft.readAspect( "thread" );
    Thread.splice( thread, scopedItem );
    Draft.updateAspect( "thread", thread );
  };

  Handle.updateSuggestion = async ( query ) => {
    currentQuery = query;
    queryHandle.query( query, 
      Mention.getSuggestions( mention, identity, query ));
  };

  Handle.update = ( value ) => {
    Handle.updateMention( value );
    Handle.updateSuggestion( value );
  };

  Handle.input = ( event ) => {
    if (suggestionBox.open !== true) {
      suggestionBox.show();
    }
    Handle.update( event.target.value );
  };

  Handle.show = async () => {
    if (currentQuery !== mentionInput.value) {
      currentQuery = mentionInput.value;
      Handle.updateSuggestion( mentionInput.value );
    }
  };

  Handle.select = ( event ) => {
    const id = event.detail.item.value;
    const suggestion = suggestions.find( s => s.id === id )
    if ( suggestion ) {
      Handle.update( suggestion.handle )
    }
  }
 

  Render.reset();
  onMount(() => {
    queryHandle = Query.make({ element: _mention });
    _mention.addEventListener( "gobo-mention-suggestions-incoming", Render.suggestionsIncoming );
    _mention.addEventListener( "gobo-mention-suggestions", Render.suggestions );
    Render.initalize( threadItem, indexes );
    return () => {
      _mention.removeEventListener( "gobo-mention-suggestions-incoming", Render.suggestionsIncoming );
      _mention.removeEventListener( "gobo-mention-suggestions", Render.suggestions );
      queryHandle.halt();
      Render.reset();
    };
  });
</script>


<section class="mention" bind:this={_mention}>
  <sl-icon 
    src="/icons/{platform}.svg"
    class={platform}>
  </sl-icon>

  <div class="badge-spacer">
    <div class="badge">{nameType}</div>
  </div>

  <sl-dropdown 
    bind:this={suggestionBox}
    on:sl-show={Handle.show}
    sync="width">
    
    <div slot="trigger">
      <sl-input
        bind:this={mentionInput}
        on:sl-input={Handle.input}
        name="mention"
        size="medium"
        pill>
      </sl-input>
    </div>

    <sl-menu on:sl-select={Handle.select}>
      {#if state === "ready"}
        {#if suggestions.length === 0}
          <div class="no-results">No Results</div>
        {:else}
          {#each suggestions as suggestion (suggestion.id)}
            <sl-menu-item value={suggestion.id}>
              <div class="menu-item">
                {#if suggestion.avatar}
                  <img 
                    src={suggestion.avatar} 
                    alt="profile picture for {suggestion.handle}"
                  />
                {/if}
                <div class="names">
                  <div class="display-name">{suggestion.displayName}</div>
                  <div class="handle">{suggestion.handle}</div>
                </div>
              </div>
            
            </sl-menu-item>
          {/each}
        {/if}
      {:else}
        <Spinner/>
      {/if} 

    </sl-menu>
    
  </sl-dropdown>

  <!-- <sl-input
    bind:this={inputs.spoilerText}
    on:sl-input={Handle.spoilerText}
    label="Spoiler Text"
    help-text="Provide text that contextualizes content behind warning."
    autocomplete="off"
    size="medium">
  </sl-input> -->
</section>

<style>
  .mention {
    margin-top: var(--gobo-height-spacer);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem var(--gobo-width-spacer-half);
    width: 100%;
  }

  .mention:first-of-type {
    margin-top: var(--gobo-height-spacer-half);
  }

  .mention sl-icon {
    flex: 0 0 auto;
    font-size: 1.25rem;
    margin: 0;
  }

  .mention sl-dropdown {
    flex: 1 1 100%;
  }

  .mention sl-input {
    margin-top: 0;
    color: var(--gobo-color-text);
  }

  .mention sl-input::part(input) {
    -webkit-text-fill-color: var(--gobo-color-text);
  }

  .mention sl-menu {
    background-color: var(--gobo-color-panel);
  }

  .mention sl-menu .no-results {
    margin: 0 var(--gobo-width-spacer-flex);
  }

  .mention sl-menu .menu-item {
    display: flex;
    align-items: center;
  }

  .mention sl-menu .menu-item img {
    flex: 0 0 auto;
    height: 2.25rem;
    width: 2.25rem;
    border-radius: 50%;
    margin-right: var(--gobo-width-spacer-half);
  }

  .mention sl-menu .menu-item .names {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
  }

  .mention sl-menu .menu-item .names .display-name {
    width: 100%;
    color: var(--gobo-color-text);
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mention sl-menu .menu-item .handle {
    width: 100%;
    color: var(--gobo-color-text-muted);
    font-size: 0.925rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mention .badge-spacer {
    flex: 0 0 6rem;
    display: flex;
  }

  .mention .badge-spacer .badge {
    background-color: var(--gobo-color-null);
    color: var(--gobo-color-text);
    font-weight: var(--gobo-font-weight-black);
    font-size: 14px;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
  }

  .mention .badge:empty {
    display: none;
  }

  @media( min-width: 680px ) {
    .mention {
      flex-wrap: nowrap;
    }
    .mention sl-icon {
      order: 0;
    }

    .mention sl-dropdown {
      order: 1;
      flex: 1 1 100%;
    }

    .mention .badge-spacer {
      order: 2
    }
  }

</style>