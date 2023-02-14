<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { getClient } from "$lib/helpers/auth0.js";

  const redirect = async function ( event ) {
    event.preventDefault();
    const client = await getClient();
    client.loginWithRedirect()
  };
</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <section slot="left" class="outer-section">
    <h1>Gobo Public Homepage</h1>
    <section class="button-column">
      <sl-button
        variant="primary"
        size=medium
        on:click={redirect}
        on:keypress={redirect}>
        Login
      </sl-button>

      <sl-button
        variant="primary"
        size=medium
        href="/home">
        Home
      </sl-button>
    </section>
  </section>
  
  <Fascinator slot="right"></Fascinator>
</LeftRight>




<style>
  .outer-section {
    max-width: 36rem;
  }

  .outer-section h1 {
    margin-bottom: 2rem;
  }

  .outer-section .button-column {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .outer-section .button-column sl-button {
    margin: 0 0 1rem 0;
  }
</style>