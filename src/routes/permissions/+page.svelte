<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import * as Account from "$lib/helpers/account.js";

  const logout = async function ( event ) {
    event.preventDefault();
    await Account.logout();
  };

</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <section slot="left" class="gobo-copy">
    <h1>GOBO Is In Closed Beta</h1>
    <p>
      We need copy here to indicate that this person, who successfully authenticated,
      does not have permissions associated with the closed testing phase.
      Because the application will not function for them, we should not show
      them dynamic pages that rely on API acccess.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
      commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>

    <sl-divider class="gobo-divider"></sl-divider>

    <div class="button-panel">
      <sl-button
        on:click={logout}
        on:keypress={logout}
        class="submit"
        size="medium"
        pill>
        Logout
      </sl-button>
    </div>
    
  </section>
  
  <Fascinator slot="right"></Fascinator>
</LeftRight>
<FooterNav></FooterNav>


<style>
  sl-divider {
    margin-top: 2rem;
  }

  .button-panel {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    margin-top: 1rem;
  }
</style>