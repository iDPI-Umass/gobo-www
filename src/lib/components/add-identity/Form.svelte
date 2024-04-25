<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { onMount } from "svelte";
  import { replaceState } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import * as LS from "$lib/helpers/local-storage.js";
  import { Gobo } from "$lib/engines/account.js";
  import * as identityStores from "$lib/stores/identity.js";

  let button, inputs;
  let state, platform;
  const Render = State.make();
  Render.cleanup = () => {
    state = "ready";
    platform = "bluesky";
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
    const context = {};
    for ( const key in inputs ) {
      const input = inputs[ key ];
      if ( input != null ) {
        context[ key ] = input.value;
      }
    }
    return context;
  };

  Validate.report = () => {
    const results = [];
    for ( const key in inputs ) {
      const input = inputs[ key ];
      if ( input != null ) {
        results.push( input.reportValidity() );
      }
    }
    return results.every( r => r === true );
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

  Validate.bluesky = () => {
    const context = Validate.context();
    context.baseURL = "https://bsky.app";
    
    let login = context.blueskyLogin;
    if ( !login ) {
      Inputs.alert( "blueskyLogin", "Please provide a Bluesky username." );
      return;
    }
    
    if ( login.startsWith("@") ) {
      login = login.slice(1);
      context.blueskyLogin = login;
    }
    
    if ( login.length < 1 ) {
      Inputs.alert( "blueskyLogin", "This is an invalid Bluesky username." );
      return;
    }

    if ( !context.blueskySecret ) {
      Inputs.alert( "blueskySecret", "Please provide a Bluesky secret." );
      return;
    }
    
    return context;
  };

  Validate.mastodon = () => {
    const context = Validate.context();
    
    if ( !context.mastodonURL ) {
      Inputs.alert( "mastodonURL", "Please provide a Mastodon server URL." );
      return;
    }

    const url = Validate.url( context.mastodonURL );
    if ( url == null ) {
      Inputs.alert( "mastodonURL", "This is an invalid URL." );
      return;
    }

    context.mastodonURL = url.href;
    context.baseURL = url.origin;
    return context;
  };

  // No fields to validate, so mostly a no-op.
  Validate.reddit = () => {
    const context = Validate.context();
    context.baseURL = "https://www.reddit.com";
    return context;
  };

  Validate.smalltown = () => {
    const context = Validate.context();
    
    if ( !context.smalltownURL ) {
      Inputs.alert( "smalltownURL", "Please provide a Smalltown server URL." );
      return;
    }

    const url = Validate.url( context.smalltownURL );
    if ( url == null ) {
      Inputs.alert( "smalltownURL", "This is an invalid URL." );
      return;
    }

    context.smalltownURL = url.href;
    context.baseURL = url.origin;
    return context;
  };



  const Submit = {};

  Submit.validate = () => {
    const context = Validate[ platform ]();
    const isValid = Validate.report();
    if ( isValid === true ) {
      return context;
    } else {
      return;
    }
  };

  Submit.stow = ( context ) => {
    LS.write( "gobo-platform", context.platform );
    LS.write( "gobo-baseURL", context.baseURL );
    LS.write( "gobo-bluesky-login", context.blueskyLogin );
    LS.write( "gobo-bluesky-secret", context.blueskySecret );
  };

  Submit.onboard = async ( context ) => {
    const client = await Gobo.get();
    let result;

    try {
      result = await client.actionOnboardIdentityStart.post({ 
        content: {
          platform: context.platform,
          base_url: context.baseURL
        }
      });
    } catch ( error ) {
      console.error( error );
      return;
    }
    
    console.log( result );
    context.onboard = result;
    return context;
  };

  Submit.getRedirectURL = ( context ) => {
    if ( context.platform === "bluesky" ) {
      // For Bluesky, we handle the app password flow differently than OAuth.      
      return `/add-identity-callback?state=${ context.onboard.state }`;
    }
    
    // Default
    return context.onboard.redirect_url;
  };


  Submit.flow = async () => {
    let context = Submit.validate();
    if ( context == null ) {
      return;
    }

    Submit.stow( context );
    await Submit.onboard( context );
    if ( context.onboard == null ) {
      state = "error";
      return;
    }

    const url = Submit.getRedirectURL( context );
    window.location = url;
  };


  const Handle = {};

  Handle.select = ( event ) => {
    platform = event.target.value;
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
      identityStores.onboardFailure.put({ failure: true });
      replaceState( `/identities/add?failure=true` );
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
  
  <h2>Select Platform</h2>

  <sl-select
    on:sl-change={Handle.select}
    name="platform"
    value="bluesky"
    size="medium"
    pill>
    <sl-option value="bluesky">Bluesky</sl-option>
    <sl-option value="mastodon">Mastodon</sl-option>
    <sl-option value="reddit">Reddit</sl-option>
    <sl-option value="smalltown">Smalltown</sl-option>
  </sl-select>

  {#if platform === "bluesky"}
    <sl-input
      bind:this={inputs.blueskyLogin}
      on:input={Validate.clear}
      name="blueskyLogin"
      label="Bluesky Username"
      help-text="Your full username, like gobo.bsky.social"
      autocomplete="off"
      size="medium"
      class="required">
    </sl-input>

    <sl-input
      bind:this={inputs.blueskySecret}
      on:input={Validate.clear}
      name="blueskySecret"
      label="Bluesky Secret"
      help-text='On Bluesky, go to Settings > App Passwords and click "Add App Password" to get a secret for Gobo'
      autocomplete="off"
      password
      size="medium"
      class="required">
    </sl-input>
  {/if}


  {#if platform === "mastodon"}
    <sl-input
      bind:this={inputs.mastodonURL}
      on:input={Validate.clear}
      name="mastodonURL"
      label="Mastodon Server URL"
      help-text="For example, https://mastodon.social or mastodon.social (you can omit the prefix for convenience)"
      autocomplete="off"
      size="medium"
      class="required">
    </sl-input>
  {/if}


  {#if platform === "smalltown"}
    <sl-input
      bind:this={inputs.smalltownURL}
      on:input={Validate.clear}
      name="smalltownURL"
      label="Smalltown Server URL"
      help-text="For example, https://community.publicinfrastructure.org or community.publicinfrastructure.org (you can omit the prefix for convenience)"
      autocomplete="off"
      size="medium"
      class="required">
    </sl-input>
  {/if}


  <sl-button
    bind:this={button}
    on:click={Handle.submit}
    class="submit"
    size="medium"
    pill>
    Add Identity
  </sl-button>
</section>


<style>
  .gobo-form sl-select {
    width: 100%;
    align-self: flex-start;
  }
</style>