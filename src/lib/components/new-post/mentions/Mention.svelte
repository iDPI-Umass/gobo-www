<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
  import "@shoelace-style/shoelace/dist/components/menu/menu.js";
  import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount, tick } from "svelte";
  import * as Time from "@dashkite/joy/time";
  import { State, Options } from "$lib/engines/draft.js";
  import { State as EventState } from "$lib/engines/store.js";
  import { Draft, Identity } from "$lib/engines/draft.js";
  import { Mention } from "$lib/engines/mention/index.js";
  import { Query } from "$lib/engines/mention/query.js";
  import { Thread } from "$lib/engines/thread.js";
  import { Platforms } from "$lib/engines/platforms/index.js";
  import { bodyEvents, mentionEvents } from "$lib/stores/draft.js";

  export let threadItem;
  export let indexes;

  const mentionSupported = [
    "bluesky",
    "mastodon",
    "reddit",
    "smalltown"
  ];

  const lookupSupported = [
    "bluesky",
    "mastodon",
    "smalltown"
  ];

  let _mention, mentionInput, suggestionBox;
  let scopedItem, mention; 
  let platform, identity, nameType, helpText;
  let queryHandle, state, suggestions, currentQuery;
  const Render = State.make();
  const Event = EventState.make();

  Render.cleanup = () => {
    scopedItem = null;
    mention = null;
    platform = "";
    nameType = "";
    helpText = null;

    queryHandle = undefined;
    state = "loading";
    suggestions = [];
    currentQuery = "";
  };

  Render.initalize = ( threadItem, indexes ) => {
    scopedItem = structuredClone( threadItem );
    mention = scopedItem.mentions[ indexes.id ];
    
    platform = mention.platform;
    identity = Identity.findActive( platform );

    if ( !mentionSupported.includes(platform) ) {
      const displayPlatform = Platforms.displayName( platform );
      helpText = `Gobo doesn't support mentions for ${displayPlatform} but you can edit your post on ${displayPlatform} to add mentions once it's published.`;
    }
    
    nameType = mention.type;
    mentionInput.value = mention.value;
    suggestionBox.disabled = !lookupSupported.includes( platform );

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

    const thread = Draft.readAspect( "thread" );
    Thread.splice( thread, scopedItem );
    Draft.updateAspect( "thread", thread );
  };

  Handle.updateSuggestion = async ( query ) => {
    currentQuery = query;
    queryHandle.query( query, 
      Mention.getSuggestions( mention, identity, query ));
  };

  Handle.matchMentionEvent = ( event ) => {
    return (event.type === "focus-mention") &&
      (event.detail.id === indexes.id) &&
      (threadItem.platform === indexes.firstPlatform);
  };

  // This is very suspicious. Why isn't the underlying input field ready?
  // The Svelte component is mounted because this gets called from onMount.
  // The Shoelace component exists because it successfully knows about the
  // method focus. But the input is not registered with the Shoelace component,
  // or at least input.input is undefined until we try again.
  Handle.mentionEvents = async ( event, count ) => {
    count ??= 0;

    if ( Handle.matchMentionEvent(event) ) {
      try {
        mentionInput.focus();
      } catch {
        if (count > 3) {
          console.warn('failed to focus mention input');
          return;
        }
        await Time.sleep(100);
        count++;
        Handle.mentionEvents( event, count );
      }
      mentionEvents.put( null );
    }
  };

  Handle.arrowKeys = [
    "ArrowRight",
    "ArrowLeft"
  ];

  Handle.keydown = ( event ) => {
    // The space key will also toggle the dropdown because of where the input
    // happens to be in the current HX. This prevents that so we pickup the
    // spaces as textual inputs without interruption.

    // By itself, this would break a11y patterns, but we make sure to open the
    // suggestion dropdown whenever the input receieves input. As designed by
    // Shoelace, the dropdown opens for up and down arrow keys. I decided
    // to extend that to left and right keys as well.
    if ( event.key === " " ) {
      event.stopPropagation();
      return;
    }

    if ( Handle.arrowKeys.includes(event.key) ) {
      suggestionBox.show();
    }
  };

  Handle.updateInput = ( value ) => {
    mentionInput.value = value;
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
      Handle.updateInput( suggestion.handle );
      Handle.update( suggestion.handle )
    }
  };

  Handle.focus = () => {
    const event = new CustomEvent( "focus-mention", { 
      detail: { id: indexes.id }
    });

    bodyEvents.put( event );
  };

  Handle.blur = () => {
    const event = new CustomEvent( "blur-mention", { 
      detail: { id: indexes.id }
    });
    
    bodyEvents.put( event );
  };
 

  Render.reset();
  onMount(() => {
    queryHandle = Query.make({ element: _mention });
    _mention.addEventListener( "gobo-mention-suggestions-incoming", Render.suggestionsIncoming );
    _mention.addEventListener( "gobo-mention-suggestions", Render.suggestions );
    Render.initalize( threadItem, indexes );
    Event.listen( mentionEvents, Handle.mentionEvents );
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

  <sl-dropdown 
    bind:this={suggestionBox}
    on:sl-show={Handle.show}
    sync="width">
    
    <div slot="trigger">
      <sl-input
        bind:this={mentionInput}
        on:sl-input={Handle.input}
        on:keydown={Handle.keydown}
        on:sl-focus={Handle.focus}
        on:sl-blur={Handle.blur}
        name="mention"
        size="medium"
        type="text"
        autocomplete="off"
        pill>

        {#if helpText}
          <div slot="help-text">{helpText}</div>
        {/if}
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
  }

</style>