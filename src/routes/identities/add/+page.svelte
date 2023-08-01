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
  let form, select, button;
  let targetingBluesky = true;
  let targetingMastodon = false;


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
          baseURL = data.get( "mastodonURL" );
          if ( !baseURL.startsWith("https://") ) {
            baseURL = `https://${ baseURL }`;
          }
          break;
        case "reddit":
          baseURL = "https://www.reddit.com";
          break;
        default:
          throw new Error( "unknown platform specified" );
      }

      LS.write( "gobo-baseURL", baseURL );
      
      const result = await client.actionOnboardIdentityStart.post({ content: {
        base_url: baseURL
      }});

      console.log(result);

      if ( platform !== "bluesky" ) {
        window.location = result.redirect_url;
      } else {
        let login = data.get( "blueskyLogin" );
        if ( !login.endsWith(".bsky.social") ) {
          login += ".bsky.social";
        }
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
      targetingMastodon = ( event.target.value === "mastodon" );
      targetingBluesky = ( event.target.value === "bluesky" );
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
  <BackLink
    href="/identities"
    heading="Add Identity">
  </BackLink>

  <form class="gobo-form" bind:this={form}>
    
    <h2>Select Platform</h2>

    <p>
      GOBO can connect an identity for you once you grant consent. When you 
      press "Add Identity" below, you will be sent to the social media platform
      that hosts the identity. Once there, please sign in and authorize GOBO to
      connect your new identity.
    </p>
      
    <p>
      If you would like to learn more about identies,
      please see <a href="/identities/about">About Identities</a>.
    </p>

    <sl-select
      bind:this={select}
      name="platform"
      value="bluesky"
      size="medium"
      pill>
      <sl-option value="bluesky">Bluesky</sl-option>
      <sl-option value="mastodon">Mastodon</sl-option>
      <sl-option value="reddit">Reddit</sl-option>
    </sl-select>

    {#if targetingBluesky === true}
      <sl-input
        name="blueskyLogin"
        label="Bluesky Username"
        help-text="Your full name, like gobo.bsky.social, or your abreviated name, like gobo"
        autocomplete="off"
        size="medium">
      </sl-input>

      <sl-input
        name="blueskySecret"
        label="Bluesky Secret"
        help-text='This is an special "App Password" you create just for GOBO. Do NOT use your regular password'
        autocomplete="off"
        password
        size="medium">
      </sl-input>
    {/if}


    {#if targetingMastodon === true}
      <sl-input
        name="mastodonURL"
        label="Mastodon URL"
        help-text="This is the URL of your Mastodon server."
        autocomplete="off"
        size="medium">
      </sl-input>
    {/if}

    <sl-divider class="gobo-divider"></sl-divider>

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

  .gobo-form sl-divider {
    margin-bottom: 1rem;
  }
</style>