<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
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
<LeftRight>
  <div slot="left" class="main-child">
    <header>
      <h1>GOBO Is In Closed Beta</h1>
    </header>

    <section class="gobo-copy">
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
  
  <Fascinator slot="right"></Fascinator>
</LeftRight>


<style>

</style>