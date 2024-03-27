<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "$lib/styles/buttons.css";
  import { App } from "$lib/engines/account.js";

  const logout = async function ( event ) {
    await App.logout();
  };

  const resend = async ( event ) => {
    console.log("resend request is TBD");
  }

</script>

<PlainHeader></PlainHeader>
<Center>
  <div class="main-child">

    <section class="gobo-copy">
      <h1>Gobo Requires Email Verification</h1>
      <p>
        In order to use Gobo, you'll need to first verify your email address.
        You should have gotten an email containing a verification request when
        you signed up. Click the verify link in that email, then login again
        to Gobo.
      </p>

      <p>
        If you'd like us to send us to send you another verification email, 
        you can click the "Resend" button below.
      </p>

      <div class="buttons">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <sl-button
          on:click={resend}
          class="cancel"
          size="medium"
          pill>
          Resend Verification
        </sl-button>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <sl-button
          on:click={logout}
          class="submit"
          size="medium"
          pill>
          Logout
        </sl-button>
      </div>
      
    </section>
  </div>
  
</Center>


<style>
  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    border-top: none;
    padding-top: 0;
  }

  .buttons sl-button {
    margin-bottom: 0;
    width: 10rem;
  }
</style>