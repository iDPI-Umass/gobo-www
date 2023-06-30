<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "$lib/styles/buttons.css";
  import { profileStore } from "$lib/stores/profile";
  import { getGOBOClient } from "$lib/helpers/account";
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  let form, button;

  const validate = function() {
    return form.reportValidity();  
  };

  const issueRequest = async function () {
    const client = await getGOBOClient();
    const profile = client.me.get();
    const data = new FormData( form );
    profile.name = data.get( "name" );

    await client.person.put(profile);
    profileStore.updateProfile(profile);
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
  <div class="main-child">
    <section bind:this={form} class="gobo-copy">
      <header>
        <h1>Welcome to GOBO!</h1>
      </header>

      <h2>TBD Tagline</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
        
      <ul>
        <li>Quis nostrud exercitation ullamco laboris</li>
        <li>Nisi ut aliquip ex ea commodo consequat.</li>
        <li>Duis aute irure dolor in reprehenderit in voluptate</li>
      </ul>
    </section>

    
    <form bind:this={form} class="gobo-form">
      <sl-input 
        name="name" 
        label="Profile Name"
        inputmode="text"
        autocomplete="off"
        maxlength=32
        size="medium">
      </sl-input>
        
      <div class="buttons two-button">
        <sl-button      
          href="/identities"
          class="cancel"
          size="medium"
          width="100%"
          pill>
          Skip
        </sl-button>
    
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Save and Continue
        </sl-button>
      </div>
    
    
    </form>
  </div>
  
</Center>


<style>
  .gobo-copy, .gobo-form {
    margin-top: var(--gobo-height-spacer);
  }

  .gobo-form sl-input {
    margin-bottom: 0;
  }

</style>