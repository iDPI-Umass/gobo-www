<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import CenterAlt from "$lib/components/layouts/CenterAlt.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { Clients } from "$lib/engines/account.js";

  const login = async function ( event ) {
    event.preventDefault();
    const client = await Clients.getAuth0();
    client.loginWithRedirect();
  };

  const signup = async function ( event ) {
    event.preventDefault();
    const client = await Clients.getAuth0();
    client.loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  };
</script>

<PlainHeader></PlainHeader>
<CenterAlt>
  <section>
    <h1>All your (open) social media in one&nbsp;place</h1>
    <section class="buttons">
      <sl-button
        variant="primary"
        size=medium
        on:click={login}
        on:keydown={login}>
        Log in
      </sl-button>

      <sl-button
        variant="primary"
        size=medium
        on:click={signup}
        on:keydown={signup}>
        Sign up
      </sl-button>
    </section>
  </section>
  
</CenterAlt>




<style>
  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    margin-top: 2rem;
  }

  h1 {
    text-align: center;
    text-transform: capitalize;
  }
</style>