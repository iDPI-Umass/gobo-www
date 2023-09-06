<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "$lib/styles/buttons.css";
  import * as Account from "$lib/helpers/account.js";

  const logout = async function ( event ) {
    event.preventDefault();
    await Account.logout();
  };

</script>

<PlainHeader></PlainHeader>
<Center>
  <div class="main-child">

    <section class="gobo-copy">
      <h1>Gobo is in a Closed Beta</h1>
      <p>
        We are currently testing Gobo with a small group of friends and colleagues. 
        We’ve saved your account information for when we open up Gobo to the public. 
        If you think you should have access, please reach out to us. 
        Thank you for your interest!
      </p>

      <nav>
        <sl-button
          on:click={logout}
          on:keypress={logout}
          class="submit"
          size="medium"
          pill>
          Logout
        </sl-button>
      </nav>
      
    </section>
  </div>
  
</Center>


<style>
  .gobo-copy nav {
    justify-content: flex-start;
  }

</style>