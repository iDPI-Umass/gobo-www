<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
  import "@shoelace-style/shoelace/dist/components/menu/menu.js";
  import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
  import { onMount } from "svelte";
  import { State, Options } from "$lib/engines/draft.js";
  import { Draft } from "$lib/engines/draft.js";
  import { Mention } from "$lib/engines/mention/index.js";
  import { Thread } from "$lib/engines/thread.js";

  export let threadItem;
  export let indexes;

  const suggestionsSupported = [
    "bluesky",
    "mastodon",
    "smalltown"
  ];

  let mentionInput, suggestionBox;
  let platform, nameType;
  const Render = State.make();
  Render.cleanup = () => {
    platform = "";
    nameType = "";
  };

  Render.initalize = ( threadItem, indexes ) => {
    platform = threadItem.platform;
    const mention = threadItem.mentions[ indexes.name ];
    mentionInput.value = mention?.value ?? "";
    nameType = mention?.type ?? "";
  };

  const Handle = {};

  Handle.focus = () => {
    if ( suggestionsSupported.includes(threadItem?.platform) ) {
      suggestionBox.active = true;
    }
  };

  Handle.blur = () => {
    suggestionBox.active = false;
  }

  Handle.update = ( event ) => {
    const item = structuredClone( threadItem );
    const mention = item.mentions[ indexes.name ];
    if (!mention) {
      console.warn("trying to update mention that does not exist...")
      return;
    }

    Mention.update( mention, platform, event.target.value );

    const thread = Draft.readAspect( "thread" );
    Thread.splice( thread, item );
    Draft.updateAspect( "thread", thread );
    
    nameType = mention?.type;
  };
 

  Render.reset();
  onMount(() => {
    Render.initalize( threadItem, indexes );
    return () => {
      Render.reset();
    };
  });
</script>


<section class="mention">
  <sl-icon 
    src="/icons/{platform}.svg"
    class={platform}>
  </sl-icon>

  <div class="badge-spacer">
    <div class="badge">{nameType}</div>
  </div>

  <sl-dropdown bind:this={suggestionBox} sync="width">
    <div slot="trigger">
      <sl-input
        bind:this={mentionInput}
        on:sl-input={Handle.update}
        name="mention"
        size="medium"
        pill>
      </sl-input>
    </div>

    <sl-menu>
      <sl-menu-item value="1">Option 1</sl-menu-item>
      <sl-menu-item value="2">Option 2</sl-menu-item>
      <sl-menu-item value="3">Option 3</sl-menu-item>
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