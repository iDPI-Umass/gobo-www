<script>
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
  import "@shoelace-style/shoelace/dist/components/radio-button/radio-button.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import  "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  import { feedStore } from "$lib/stores/feed.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  let form, button, select, currentCategory = "block-keyword";

  const addKeyword = async function () {
    const data = new FormData( form );
    const category = data.get( "category" );
    const configuration = {
      value: data.get( "word" )
    };
    
    try {
      const engine = await FeedSaver.getEngine();
      await engine.filterEngine.addFilter( category, configuration );
      form.reset();
      select.value = "block-keyword";
      feedStore.push({ command: "reset" });
      goto( "/settings/filters" );
    } catch ( error ) {
      // TODO: Visually represent an error here.
      console.error( error );
    }

    button.loading = false;
  };

  const getHintCopy = function ( category ) {
    switch ( category ) {
      case "block-keyword":
        return "Gobo matches this phrase against this first-class and syndicated content and excludes those posts from your feed.";
      case "block-username":
        return "Gobo matches this username against authors in the feed social graph and excludes those posts from your feed.";
      case "block-domain":
        return "Gobo Matches this domain, ex: example.com, against related URLs shared as links and exlcudes those posts from your feed."; 
      default:
        console.warn( "unknown category, cannot provide hint copy." )
        return "";
    }
  };

  

  onMount( function () {
    const listener = async function ( event ) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        await addKeyword();
      }
    };

    const selectListener = function ( event ) {
      currentCategory = event.target.value;
    };

    form.addEventListener( "submit", listener );
    select.addEventListener( "sl-change", selectListener );

    return function () {
      form.removeEventListener( "submit", listener );
      select.removeEventListener( "sl-change", selectListener );
    };
  });
</script>

<div class="main-child">
  <BackLink heading="Add Filter"></BackLink>

  {#if data.bindings.failure}
    <p class="danger">
      There was a problem adding your filter.
    </p>
  {/if}

  <form class="gobo-form" bind:this={form}>
    <sl-select
      bind:this={select}
      name="category"
      value="block-keyword"
      label="Category"
      size="medium"
      pill>
      <sl-option value="block-keyword">Block Keyword</sl-option>
      <sl-option value="block-username">Block Username</sl-option>
      <sl-option value="block-domain">Block Domain</sl-option>
    </sl-select>
    
    <sl-input
      name="word"
      label="Pattern"
      help-text={getHintCopy(currentCategory)}
      autocomplete="off"
      size="medium">
    </sl-input>

    <div class="buttons">
      <sl-button
        bind:this={button}
        type="submit"
        class="submit"
        variant="primary"
        size="medium"
        pill>
        Add Filter
      </sl-button>  
    </div>
    
  </form>

</div>


<style>
  
  sl-select {
    width: 12rem;
  }

</style>