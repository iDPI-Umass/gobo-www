<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
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


<section class="gobo-config-frame">
  <BackLink
    href="/settings"
    heading="Your Profile">
  </BackLink>
  

  <section class="panel">
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
  </section>
  
  <sl-divider class="gobo-divider"></sl-divider>
</section>
  


<style>
</style>