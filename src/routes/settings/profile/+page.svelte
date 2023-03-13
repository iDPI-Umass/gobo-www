<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { profileStore } from "$lib/stores/profile";
  import { getGOBOClient } from "$lib/helpers/account";
  import { onDestroy, onMount } from "svelte";
  let form, button, nameInput;
  let currentName, unsubscribeProfileStore;

  const validate = function() {
    return form.reportValidity();  
  };

  const issueRequest = async function () {
    const client = await getGOBOClient();
    const data = new FormData( form );
    const display_name = data.get( "name" );

    await client.updateProfile({
      parameters: { display_name }
    });

    profileStore.updateProfile({ display_name });
  };

  const submit = async function () {
    const isValid = validate();
    if ( isValid === true ) {
      await issueRequest();
      button.loading = false;
    } else {
      button.loading = false;
    }
  };

  onMount( function () {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        submit();
      }
    });

    unsubscribeProfileStore = profileStore.subscribe( function ( profile ) {
      console.log("settting", profile.display_name);
      nameInput.value = profile.display_name;
      console.log(nameInput.value)
    });
  });

  onDestroy( function () {
    unsubscribeProfileStore();
  });

</script>


<section class="gobo-config-frame">
  <BackLink
    href="/settings"
    heading="Your Profile">
  </BackLink>
  

  <section class="panel">
    <form bind:this={form} class="gobo-form">
      <h2>Update Profile</h2>
      
      <sl-input
        bind:this={nameInput}
        name="name" 
        label="Profile Name"
        inputmode="text"
        autocomplete="off"
        maxlength=32
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