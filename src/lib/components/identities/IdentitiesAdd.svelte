<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
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



<form bind:this={form}>

  <h1>Add Identity</h1>

  <h2>Select a Platform</h2>
  
  <p>
    Select a platform below. You'll need to grant GOBO consent to establish an
    identity. The identities you establish allow GOBO to construct feeds you control.
  </p>

  <sl-select
    value="mastodon"
    help-text="Select a social media platform. You'll be sent to that platform to sign in."
    size="medium">
    <sl-option value="mastodon">Mastodon</sl-option>
    <sl-option value="reddit">Reddit</sl-option>
    <sl-option value="twitter">Twitter</sl-option>
  </sl-select>

  <sl-button
    bind:this={button}
    type="submit"
    variant="primary"
    size="medium">
    Add Identity
  </sl-button>
</form>


<style>
  form {
    max-width: 32rem;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  sl-button {
    align-self: flex-end;
  }

  h1 {
    margin: 0 0 2rem 0;
  }

  h2 {
    margin: 2rem 0 1rem 0;
  }

  p {
    margin-bottom: 1rem;
  }

  sl-select {
    margin: 1rem 0 2rem 0;
  }
</style>