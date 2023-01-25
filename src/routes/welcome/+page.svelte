<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { sleep } from "@dashkite/joy/time";
  let form, button;

  const validate = function() {
    return form.reportValidity();  
  };

  const issueRequest = async function () {
    console.log( "HTTP request goes here..." );
    await sleep( 500 );
  };

  const submit = async function () {
    const isValid = validate();
    if ( isValid === true ) {
      await issueRequest();
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

<PlainHeader></PlainHeader>
<Center>
  <form bind:this={form} class="gobo-form">
    <h1>Welcome to GOBO!</h1>
  
    <h2>TBD Tagline</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
      
    <ul>
      <li>Quis nostrud exercitation ullamco laboris</li>
      <li>Nisi ut aliquip ex ea commodo consequat.</li>
      <li>Duis aute irure dolor in reprehenderit in voluptate</li>
    </ul>
  
    <sl-input 
      name="name" 
      label="Profile Name"
      help-text="You can control how you appear to others with this custom profile name."
      inputmode="text"
      autocomplete="off"
      size="medium">
    </sl-input>
  
    <sl-divider class="gobo-divider"></sl-divider>
  
    <section class="buttons">
      <sl-button      
        variant="text"
        href="/home"
        size="medium"
        width="100%">
        SKIP
      </sl-button>
  
      <sl-button
        bind:this={button}
        type="submit"
        variant="primary"
        size="medium"
        width="100%">
        Save and Continue
      </sl-button>
    </section>
  
  
  </form>
</Center>


<style>
  form {
    max-width: 36rem;
  }

  form > section.buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin: 0;
  }

  form > sl-divider {
    margin-bottom: 1rem;
  }
</style>