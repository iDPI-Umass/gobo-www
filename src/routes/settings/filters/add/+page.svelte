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
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import { Filter } from "$lib/engines/filter.js";
  import { Feed } from "$lib/engines/feed.js";

  export let data;

  let form, button, select;
  let category, copy;
  const Render = State.make();
  Render.cleanup = () => {
    copy = "";
    category = "block-keyword";
  };

  Render.form = () => {
    Render.copy();
  };

  Render.copy = () => {
    switch ( category ) {
      case "block-keyword":
        copy = "Gobo will exclude posts from your feed that include this word or phrase.";
        break;
      case "block-username":
        copy = "Gobo will exclude posts from your feed by this username (e.g., @gobo.bsky.social or r/idpi).";
        break;
      case "block-domain":
        copy = "Gobo will exclude posts from your feed that include links to this domain (e.g., publicinfrastructure.com)."; 
        break;
      default:
        copy = "";
    }
  };


  const Handle = {};
  Handle.add = async ( event ) => {
    event.preventDefault();
    if ( button.loading === true ) {
       return;
    }

    button.loading = true;
    const data = new FormData( form );
    const category = data.get( "category" );
    const configuration = {
      value: data.get( "word" )
    };

    try {
      await Filter.add( category, configuration );
      form.reset();
      select.value = category;
      await Feed.refresh();
      button.loading = false;
      goto( "/settings/filters" );
    } catch ( error ) {
      // TODO: Visually represent an error here.
      console.error( error );
      button.loading = false;
    }
  };

  Handle.category = ( event ) => {
    category = event.target.value;
    Render.copy();
  };

  
  Render.reset();
  onMount(() => {
    Render.form();
    return () => {
      Render.reset();
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

  <form class="gobo-form" bind:this={form} on:submit={Handle.add}>
    <sl-select
      bind:this={select}
      on:sl-change={Handle.category}
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
      help-text={copy}
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