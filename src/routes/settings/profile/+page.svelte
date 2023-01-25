<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { onMount } from "svelte";
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


<section class="frame">
  <h1>Your Profile</h1>

  <form bind:this={form} class="gobo-form">
    <h2>Update Profile Name</h2>
    
    <sl-input 
      name="name" 
      label="Profile Name"
      help-text="You can control how you appear to others."
      inputmode="text"
      autocomplete="off"
      size="medium">
    </sl-input>

    <sl-button
      bind:this={button}
      type="submit"
      variant="primary"
      size="medium">
      Update Profile
    </sl-button>
  </form>

  <sl-divider class="gobo-divider"></sl-divider>
</section>
  


<style>
  .frame {
    max-width:  36rem;
    margin: 0;
  }

  .frame > h1 {
    font-size: var(--sl-font-size-x-large);
    margin-bottom: 2rem;
  }

  form > sl-button {
    align-self: flex-start;
    margin-bottom: 0;
  }

  .frame > sl-divider {
    margin-top: 1rem;
    margin-bottom: 4rem;
  }

</style>