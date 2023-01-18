<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
  import Divider from "$lib/components/primitives/Divider.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { sleep } from "@dashkite/joy/time";
  let form, button, confirmation;

  const validate = function() {
    // Start with validation based on HTML declarations.
    const isValid = form.reportValidity();
    if ( isValid !== true ) {
      return isValid;
    }

    // Apply password confirmation check.
    const formData = new FormData( form );
    const A = formData.get( "password" );
    const B = formData.get( "confirm password" );
    if ( A !== B ) {
      confirmation.setCustomValidity( "password fields must match." );
      return form.reportValidity();
    }

    // Validated successfully.
    return true;
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
      goto( "/welcome" );
    } else {
      button.loading = false;
    }
    return true;
  };

  onMount(() => {
    form.addEventListener( "submit", function (event) {
      event.preventDefault();
      console.log({ buttonLoading: button.loading });
      if ( button.loading !== true ) {
        button.loading = true;
        submit();
      }
    });

    // Resets the custom validation so submit event fires after a validation error. 
    confirmation.addEventListener( "input", function () {
      confirmation.setCustomValidity( "" );
    });
  });
</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <form slot="left" bind:this={form}>
    <h1>Create Your Account</h1>
  
    <sl-input 
      name="username" 
      label="Username"
      size="medium"
      help-text="This is your ID on GOBO. You'll be able to pick a different display name later."
      inputmode="text"
      autocomplete="off"
      minLength=3
      required>
    </sl-input>
  
    <sl-input 
      name="email" 
      label="Email"
      type="email"
      size="medium"
      help-text="This email anchors your acocunt, but it's always kept private."
      inputmode="email"
      autocomplete="email"
      required>
    </sl-input>
    
    <sl-input
      name="password" 
      label="Password" 
      type="password"
      placeholder="Password"
      size="medium"
      help-text="Your password needs at least 16 characters."
      minlength=16
      inputmode="text"
      autocomplete="new-password"
      password-toggle
      required>
    </sl-input>
  
    <sl-input
      bind:this={confirmation}
      name="confirm password" 
      label="Confirm Password" 
      type="password"
      placeholder="Password"
      size="medium"
      help-text="Enter your password again to confirm."
      minlength=16
      inputmode="text"
      autocomplete="new-password"
      password-toggle
      required>
    </sl-input>
  
    <p>
      These <a href="/terms-of-service">Terms of Service</a> describe acceptable
      behavior and our mutual responsibilities to make GOBO a worthy place to 
      spend time. You'll need to agree to the items below to create a GOBO account.
    </p>
  
    <sl-checkbox
      size="medium"
      required>
      You agree to GOBO's Code of Conduct.
    </sl-checkbox>
  
    <sl-button 
      bind:this={button}
      type="submit"
      variant="primary"
      size="medium"
      width="100%">
      Create Account
    </sl-button>
  
    <Divider></Divider>
  
    <p>
      Already have an account?
      <a href="/login">
        Login.
      </a>
    </p>
  </form>
  
  <Fascinator slot="right"></Fascinator>
</LeftRight>


<style>
  form {
    max-width: 20rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  form > * {
    margin-bottom: 2rem;
  }

  form > h1 {
    font-size: var(--sl-font-size-x-large);
  }
</style>
