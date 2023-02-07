<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { getClient } from "$lib/helpers/auth0.js";

  const redirect = async function ( event ) {
    event.preventDefault();
    const client = await getClient();
    client.loginWithRedirect()
  };

</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <form slot="left" class="gobo-form">
    <h1>Log In To Your Account</h1>
  
    <sl-button
      type="submit"
      variant="primary"
      size="medium"
      on:click={redirect}
      on:keypress={redirect}>
      Login
    </sl-button>
  
    <sl-divider class="gobo-divider"></sl-divider>
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