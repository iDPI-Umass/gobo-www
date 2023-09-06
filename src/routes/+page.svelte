<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import CenterAlt from "$lib/components/layouts/CenterAlt.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { getAuth0Client } from "$lib/helpers/auth0.js";

  const login = async function ( event ) {
    event.preventDefault();
    const client = await getAuth0Client();
    client.loginWithRedirect();
  };

  const signup = async function ( event ) {
    event.preventDefault();
    const client = await getAuth0Client();
    client.loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  };
</script>

<PlainHeader></PlainHeader>
<CenterAlt>
  <section>
    <h1>A loyal social media client</h1>
    <section class="buttons">
      <sl-button
        variant="primary"
        size=medium
        on:click={login}
        on:keypress={login}>
        Log in
      </sl-button>

      <sl-button
        variant="primary"
        size=medium
        on:click={signup}
        on:keypress={signup}>
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
</style>