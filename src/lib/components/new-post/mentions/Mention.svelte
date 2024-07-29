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
  import { Mention } from "$lib/engines/mention.js";
  import { Thread } from "$lib/engines/thread.js";

  export let threadItem;
  export let indexes;

  const suggestionsSupported = [
    "bluesky",
    "mastodon",
    "smalltown"
  ];

  let mentionInput, suggestionBox;
  let platform;
  const Render = State.make();
  Render.cleanup = () => {
    platform = "";
  };

  Render.cycle = ( threadItem, indexes ) => {
    platform = threadItem.platform
    const mention = threadItem.mentions[ indexes.name ];
    if (mentionInput != null) {
      mentionInput.value = mention?.value ?? "";
    }
  }

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
    mention.value = event.target.value ?? "";

    const thread = Draft.readAspect( "thread" );
    Thread.splice( thread, item );
    Draft.updateAspect( "thread", thread );
  };
 

  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.cycle( threadItem, indexes );
</script>


<section class="mention">
  <div class="subheading">
    <sl-icon 
      src="/icons/{platform}.svg"
      class={platform}>
    </sl-icon>
    <h4>{platform}</h4>
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
    margin-top: var(--gobo-height-spacer-half);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gobo-width-spacer-flex);
  }

  .mention:first {
    margin-top: 0;
  }

  .mention .subheading {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0;
  }

  .mention .subheading sl-icon {
    font-size: 1.25rem;
    margin-right: var(--gobo-width-spacer-half);
    margin-bottom: 0;
  }

  .mention .subheading h4 {
    margin: 0 !important;
  }

  sl-input {
    margin-top: 0;
    z-index: 1
  }

  sl-menu {
    z-index: 5;
  }

  /* sl-input, sl-select {
    margin-top: var(--gobo-height-spacer-flex);
  }

  sl-select {
    align-self: flex-start;
    width: 12rem;
  }

  sl-select::part(combobox) {
    font-weight: var(--gobo-font-weight-medium);
  } */
</style>