<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { getClient } from "$lib/helpers/auth0.js";

  const logout = async function ( event ) {
    event.preventDefault();
    const client = await getClient();
    client.logout()
  };


</script>


<section class="gobo-config-frame">
  <h1>Log Out Of Your Account</h1>

  <section class="panel">
    <form class="gobo-form">      
      <sl-button
        variant="primary"
        size="medium"
        on:click={logout}
        on:keypress={logout}>
        Logout GOBO
      </sl-button>
    </form>
  </section>
  
  <sl-divider class="gobo-divider"></sl-divider>
</section>
  


<style>
  sl-button {
    align-self: flex-start;
  }

</style>