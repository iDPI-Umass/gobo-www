<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import * as LS from "$lib/helpers/local-storage.js";
  import { getGOBOClient } from "$lib/helpers/account.js";

  export let data;
  let form, select, button;
  let targetPlatform = "bluesky"

  const parseBaseURL = function ( _url ) {
    let url;
    try {
      url = new URL( _url );
    } catch {
      _url = "https://" + _url;
      url = new URL( _url );
    }
    return `https://${ url.hostname }`;
  }


  const submit = async function () {
    try {
      let baseURL;
      const client = await getGOBOClient();
      const data = new FormData( form );
      const platform = data.get( "platform" );

      switch ( platform ) {
        case "bluesky":
          baseURL = "https://bsky.app";
          break;
        case "mastodon":
          baseURL = parseBaseURL( data.get("mastodonURL") );
          break;
        case "reddit":
          baseURL = "https://www.reddit.com";
          break;
        case "smalltown":
          baseURL = parseBaseURL( data.get("smalltownURL") );
          break;
        default:
          throw new Error( "unknown platform specified" );
      }

      LS.write( "gobo-baseURL", baseURL );
      LS.write( "gobo-platform", platform );
      
      const result = await client.actionOnboardIdentityStart.post({ content: {
        platform,
        base_url: baseURL
      }});

      console.log(result);

      if ( platform !== "bluesky" ) {
        window.location = result.redirect_url;
      } else {
        let login = data.get( "blueskyLogin" );
        if ( login.startsWith("@") ) {
          login = login.slice(1);
        }

        LS.write( "gobo-bluesky-login", login );
        LS.write( "gobo-bluesky-secret", data.get( "blueskySecret" ));
        window.location = `/add-identity-callback?state=${result.state}`;
      }
    } catch ( error ) {
      // TODO: Figure out how we'd like to represent an error visually here.
      console.error( error );
    }

    button.loading = false;
  };

  onMount(() => {
    const submitListener = function( event ) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        submit();
      }
    };

    const changeListener = function( event ) {
      targetPlatform = event.target.value;
    };

    form.addEventListener( "submit", submitListener);
    select.addEventListener( "sl-change", changeListener );

    return function () {
      form.removeEventListener( "submit", submitListener);
      select.removeEventListener( "sl-change", changeListener );
    };
  });
</script>

<div class="main-child">
  <BackLink heading="Add Identity"></BackLink>

  <form class="gobo-form" bind:this={form}>
    
    <h2>Select Platform</h2>
    {#if data.bindings.failure}
      <p class="danger">
        We were unable to add your identity.
      </p>
    {/if}

    <sl-select
      bind:this={select}
      name="platform"
      value="bluesky"
      size="medium"
      pill>
      <sl-option value="bluesky">Bluesky</sl-option>
      <sl-option value="mastodon">Mastodon</sl-option>
      <sl-option value="reddit">Reddit</sl-option>
      <sl-option value="smalltown">Smalltown</sl-option>
    </sl-select>

    {#if targetPlatform === "bluesky"}
      <sl-input
        name="blueskyLogin"
        label="Bluesky Username"
        help-text="Your full username, like gobo.bsky.social"
        autocomplete="off"
        size="medium">
      </sl-input>

      <sl-input
        name="blueskySecret"
        label="Bluesky Secret"
        help-text='On Bluesky, go to Settings > App Passwords and click "Add App Password" to get a secret for Gobo'
        autocomplete="off"
        password
        size="medium">
      </sl-input>
    {/if}


    {#if targetPlatform === "mastodon"}
      <sl-input
        name="mastodonURL"
        label="Mastodon Server URL"
        help-text="For example, https://mastodon.social or mastodon.social (you can omit the prefix for convenience)"
        autocomplete="off"
        size="medium">
      </sl-input>
    {/if}


    {#if targetPlatform === "smalltown"}
      <sl-input
        name="smalltownURL"
        label="Smalltown Server URL"
        help-text="For example, https://community.publicinfrastructure.org or community.publicinfrastructure.org (you can omit the prefix for convenience)"
        autocomplete="off"
        size="medium">
      </sl-input>
    {/if}


    <sl-button
      bind:this={button}
      class="submit"
      type="submit"
      size="medium"
      pill>
      Add Identity
    </sl-button>
  </form>
</div>


<style>
  .gobo-form sl-select {
    width: 10rem;
    align-self: flex-start;
  }

  .danger {
    color: var(--gobo-color-danger);
  }
</style>