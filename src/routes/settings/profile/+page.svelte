<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import "$lib/styles/buttons.css";
  import { profileStore } from "$lib/stores/profile";
  import { getGOBOClient } from "$lib/helpers/account";
  import { onMount } from "svelte";
  let profile;
  let form, button, nameInput;

  const validate = function() {
    return form.reportValidity();  
  };

  const issueRequest = async function () {
    const client = await getGOBOClient();
    const data = new FormData( form );
    profile.name = data.get( "name" );
    profile.person_id = profile.id;

    await client.personProfile.put( profile );
    profileStore.updateProfile( profile );
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
    const listener = function(event) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        submit();
      }
    }

    form.addEventListener('submit', listener );

    const unsubscribeProfileStore = profileStore.subscribe( function ( _profile ) {
      profile = _profile
      nameInput.value = profile.name;
    });

    return function () {
      form.removeEventListener( "submit", listener );
      unsubscribeProfileStore()
    }
  });
</script>

<div class="main-child">
  <BackLink
    href="/settings"
    heading="Profile">
  </BackLink>
    

  <form bind:this={form} class="gobo-form">
    
    <sl-input
      bind:this={nameInput}
      name="name" 
      label="Profile Name"
      inputmode="text"
      autocomplete="off"
      maxlength=32
      size="medium">
    </sl-input>

    <div class="buttons">
      <sl-button
        bind:this={button}
        class="submit"
        type="submit"
        variant="primary"
        size="medium"
        pill>
        Update Profile
      </sl-button>
    </div>
   
  </form>

</div>


<style>
  sl-input {
    margin-bottom: 0;
  }
</style>