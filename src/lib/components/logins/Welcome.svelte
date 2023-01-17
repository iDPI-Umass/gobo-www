<script>
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

<form bind:this={form}>
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

  <sl-divider></sl-divider>

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

<style>
  form {
    flex: 1 1 100%;
    max-width: 30rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  form > * {
    margin-bottom: 2rem;
  }

  form > h1 {
    font-size: var(--sl-font-size-3x-large);
  }

  form > h2 {
    font-size: var(--sl-font-size-x-large);
  }

  form > sl-input:focus {
    box-shadow: none;
  }

  form > sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin: 2rem 0 1rem 0;
  }

  section.buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }




</style>