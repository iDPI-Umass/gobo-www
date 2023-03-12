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
  let targetingMastodon = true;


  const submit = async function () {
    try {
      let baseURL;
      const client = await getGOBOClient();
      const data = new FormData( form );
      const platform = data.get( "platform" );

      switch ( platform ) {
        case "mastodon":
          baseURL = data.get( "mastodonURL" );
          break;
        case "reddit":
          baseURL = "www.reddit.com";
          break;
        case "twitter":
          baseURL = "twitter.com";
          break;
        default:
          throw new Error( "unknown platform specified" );
      }

      LS.write( "gobo-baseURL", baseURL );
      
      const result = await client.addIdentity({
        parameters: {
          base_url: baseURL
        }
      });

      window.location = result.redirectURL;
    } catch ( error ) {
      // TODO: Figure out how we'd like to represent an error visually here.
      console.error( error );
    }

    button.loading = false;
  };

  onMount(() => {
    form.addEventListener( "submit", function( event ) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        submit();
      }
    });

    select.addEventListener( "sl-change", function( event ) {
      targetingMastodon = ( event.target.value === "mastodon" );
    });
  });
</script>


<form class="gobo-form" bind:this={form}>

  <BackLink
    href="/identities"
    heading="Add Identity">
  </BackLink>

  <h2>Select a Platform</h2>
  
  <p>
    Select a platform below. You'll need to grant Gobo consent to establish an
    identity. The identities you establish allow Gobo to construct feeds you control.
  </p>

  <sl-select
    bind:this={select}
    name="platform"
    value="mastodon"
    help-text="Select a social media platform. You'll be sent to that platform to sign in."
    size="medium">
    <sl-option value="mastodon">Mastodon</sl-option>
    <sl-option value="reddit">Reddit</sl-option>
    <sl-option value="twitter">Twitter</sl-option>
  </sl-select>

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
    type="submit"
    variant="primary"
    size="medium">
    Add Identity
  </sl-button>
</form>

<style>
  form > sl-divider {
    margin-bottom: 1rem;
  }
</style>