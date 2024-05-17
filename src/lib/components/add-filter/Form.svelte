<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { onMount } from "svelte";
  import { replaceState, goto } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import { Filter } from "$lib/engines/filter.js";
  import { Feed } from "$lib/engines/feed/index.js";
  import * as filterStores from "$lib/stores/filter.js";

  let form, button, inputs;
  let state, category;
  const Render = State.make();
  Render.cleanup = () => {
    state = "ready";
    category = "block-keyword";
    inputs = {};
  };

  const Inputs = {};

  Inputs.alert = ( name, message ) => {
    inputs[ name ].setCustomValidity( message );
  };

  Inputs.reset = ( name ) => {
    inputs[ name ].setCustomValidity( "" );
  };

  Inputs.resetAll = () => {
    for ( const key of inputs ) {
      Inputs.reset( key );
    }
  };


  const Validate = {};

  Validate.clear = ( event ) => {
    event.target.setCustomValidity( "" );
  };

  Validate.context = () => {
    const data = new FormData( form );
    const context = { category };
    for ( const [ key, value ] of data.entries() ) {
      context[ key ] = value;
    }
    return context;
  };

  Validate.url = ( value ) => {
    if ( /^http(s):\/\//.test(value) === false ) {
      value = "https://" + value;
    }
    
    try {
      return new URL( value );
    } catch ( error ) {
      console.warn( error );
      return;
    }
  };

  Validate[ "block-keyword" ] = () => {
    const context = Validate.context();
    
    if ( !context.keyword ) {
      Inputs.alert( "keyword", "Please provide a keyword to block." );
      return;
    }

    context.configuration = {
      value: context.keyword
    };
    
    return context;
  };

  Validate[ "block-username" ] = () => {
    const context = Validate.context();
    
    if ( !context.username ) {
      Inputs.alert( "username", "Please provide a username to block." );
      return;
    }

    context.configuration = {
      value: context.username
    };
    
    return context;
  };

  Validate[ "block-domain" ] = () => {
    const context = Validate.context();
    
    let domain = context.domain;
    if ( !domain ) {
      Inputs.alert( "domain", "Please provide a domain to block." );
      return;
    }

    if ( /^\w+\.\w+/.test( domain ) === false ) {
      Inputs.alert( "domain", "This domain is invalid." );
      return;
    }

    const url = "https://" + domain;
    try {
      new URL( url );
    } catch ( error ) {
      Inputs.alert( "domain", "This domain is invalid." );
      return;
    }

    context.configuration = {
      value: context.domain
    };
    
    return context;
  };



  const Submit = {};

  Submit.validate = () => {
    const context = Validate[ category ]();
    const isValid = form.reportValidity();
    if ( isValid === true ) {
      return context;
    } else {
      return;
    }
  };

  Submit.request = async ( context ) => {
    try {
      const { category, configuration } = context;
      await Filter.add( category, configuration );
      await Feed.refresh();
      state = "success";
    } catch ( error ) {
      console.error( error );
      state = "error";
    }
  };

  Submit.flow = async () => {
    let context = Submit.validate();
    if ( context == null ) {
      return;
    }

    await Submit.request( context );
  };


  const Handle = {};

  Handle.select = ( event ) => {
    category = event.target.value;
  };

  Handle.submit = async ( event ) => {
    event.preventDefault();
    if ( button.loading === true ) {
      return;
    }
    
    button.loading = true;
    state = "ready";
    await Submit.flow();
    button.loading = false;
    
    if ( state === "error" ) {
      filterStores.addFailure.put({ failure: true });
      replaceState( `/settings/filters/add?failure=true` );
      return;
    }
    
    if ( state === "success" ) {
      state = "ready";
      goto( "/settings/filters" );
      return;
    }
  };


  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });
</script>

<section class="gobo-form">
  
  <sl-select
    on:sl-change={Handle.select}
    name="category"
    value="block-keyword"
    label="Category"
    size="medium"
    pill>
    <sl-option value="block-keyword">Block Keyword</sl-option>
    <sl-option value="block-username">Block Username</sl-option>
    <sl-option value="block-domain">Block Domain</sl-option>
  </sl-select>


  {#if category === "block-keyword"}
    <form bind:this={form} on:submit={Handle.submit}>
      <sl-input
        bind:this={inputs.keyword}
        on:input={Validate.clear}
        name="keyword"
        label="Keyword"
        help-text="Gobo will exclude posts from your feed that include this word or phrase."
        autocomplete="off"
        size="medium">
      </sl-input>

      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Filter
        </sl-button>
      </div>
    </form>
  {/if}


  {#if category === "block-username"}
    <form bind:this={form} on:submit={Handle.submit}>
      <sl-input
        bind:this={inputs.username}
        on:input={Validate.clear}
        name="username"
        label="Username"
        help-text="Gobo will exclude posts from your feed by this username (e.g., @gobo.bsky.social or r/idpi)."
        autocomplete="off"
        size="medium">
      </sl-input>

      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Filter
        </sl-button>
      </div>
    </form>
  {/if}


  {#if category === "block-domain"}
    <form bind:this={form} on:submit={Handle.submit}>
      <sl-input
        bind:this={inputs.domain}
        on:input={Validate.clear}
        name="domain"
        label="Domain"
        help-text="Gobo will exclude posts from your feed that include links to this domain (e.g., publicinfrastructure.com)."
        autocomplete="off"
        size="medium">
      </sl-input>

      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Filter
        </sl-button>
      </div>
    </form>
  {/if}

</section>


<style>
  .gobo-form sl-select {
    width: 12rem;
  }
</style>