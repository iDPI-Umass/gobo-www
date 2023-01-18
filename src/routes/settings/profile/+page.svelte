<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import SettingsMenu from "$lib/components/settings/SettingsMenu.svelte";
  import Form from "$lib/components/primitives/Form.svelte";
  import Divider from "$lib/components/primitives/Divider.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
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

  // onMount(() => {
  //   form.addEventListener('submit', function(event) {
  //     event.preventDefault();
  //     if ( button.loading !== true ) {
  //       button.loading = true;
  //       submit();
  //     }
  //   });
  // });

</script>

<MainHeader></MainHeader>
<NestedMenu>
  <SettingsMenu slot="left"></SettingsMenu>
  <section slot="right">
    <h1>Your Profile</h1>

    <Form>
      <h2>Update Profile Name</h2>
      
      <sl-input 
        name="name" 
        label="Profile Name"
        help-text="You can control how you appear to others."
        inputmode="text"
        autocomplete="off"
        size="medium">
      </sl-input>
    
      <Divider></Divider>

      <sl-button
        bind:this={button}
        type="submit"
        variant="primary"
        size="medium">
        Add Identity
      </sl-button>
    </Form>
  </section>
  
</NestedMenu>


<style>
  section {
    max-width: 32rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  section > * {
    margin-bottom: 4rem;
  }

  section > h1 {
    font-size: var(--sl-font-size-x-large);
    margin-bottom: 2rem;
  }

</style>