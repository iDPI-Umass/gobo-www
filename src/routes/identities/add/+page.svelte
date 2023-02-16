<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { sleep } from "@dashkite/joy/time";
  let form, button;

  const validate = function() {
    return form.reportValidity();  
  };

  const login = async function () {
    console.log( "HTTP request goes here..." );
    await sleep( 500 );
  };

  const submit = async function () {
    const isValid = validate();
    if ( isValid === true ) {
      await login();
      form.reset();
      button.loading = false;
      goto( "/identities" );
    } else {
      button.loading = false;
    }
  };

  onMount(() => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        submit();
      }
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
    value="mastodon"
    help-text="Select a social media platform. You'll be sent to that platform to sign in."
    size="medium">
    <sl-option value="mastodon">Mastodon</sl-option>
    <sl-option value="reddit">Reddit</sl-option>
    <sl-option value="twitter">Twitter</sl-option>
  </sl-select>

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