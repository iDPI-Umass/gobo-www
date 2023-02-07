<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
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
      goto( "/home" );
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

<PlainHeader></PlainHeader>
<LeftRight>
  <form slot="left" class="gobo-form" bind:this={form}>
    <h1>Log In To Your Account</h1>
  
    <sl-input 
      name="username" 
      label="Email address or username"
      inputmode="text"
      autocomplete="username"
      size="medium"
      required>
    </sl-input>
    
    <sl-input
      class="password-helper" 
      name="password" 
      label="Password"
      inputmode="text"
      type="password"
      placeholder="Password"
      size="medium"
      autocomplete="current-password"
      password-toggle
      required>
  
      <p slot="help-text" style="font-size: var(--sl-font-size-small);">
        <a
          href="/password-recovery">
          Forgot your password?
        </a>
      </p>
    </sl-input>
  
    <sl-checkbox
      size="medium">
      Remember me
    </sl-checkbox>
  
    <sl-button
      bind:this={button}
      type="submit"
      variant="primary"
      size="medium"
      width="100%">
      Login
    </sl-button>
  
    <sl-divider class="gobo-divider"></sl-divider>
  
    <p>
      New to GOBO? 
      <a href="/create-account">
        Create an account.
      </a>
    </p>
  </form>  
  
  <Fascinator slot="right"></Fascinator>
</LeftRight>



<style>
  form {
    max-width: 24rem;
  }

  form > sl-divider {
    margin-bottom: 1rem;
  }

  .password-helper::part(form-control) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  /*
    Shoelace wants to place the help-text underneath the input and 
    left-justify it. It exposes CSS parts to apply custom styling. Below
    is a re-ordering with a flexbox techinque, but it's not general. It
    only works because of how the login is constrained.
  */
  .password-helper::part(form-control-label) {
    order: 0
  }

  .password-helper::part(form-control-help-text) {
    order: 1;
    flex: 1 0 67%;
    text-align: right;
  }

  .password-helper::part(form-control-input) {
    order: 2;
    width: 100%
  }
</style>