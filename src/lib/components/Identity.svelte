<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { getGOBOClient } from "$lib/helpers/account.js";
  import { goto } from "$app/navigation";
  import { invalidate } from '$app/navigation';
 
  export let type;
  export let base_url;
  export let display_name;
  export let identity_id;
  export let profile_image;
  export let username;
  
  let button;

  let colors = {
    mastodon: "#6364FF",
    reddit: "#ff4500",
    twitter: "#1d9bf0"
  };

  let logo = `/icons/${ type }.svg`;
  let brandColor = colors[ type ];

  const deleteIdentity = async function ( event ) {
    event.preventDefault();
    button.loading = true;
    const client = await getGOBOClient();
    await client.removeIdentity({
      parameters: { base_url, identity_id }
    });

    // TODO: Figure out how to do this in svelte. I keep getting search results
    // for invalidate, but I don't think it's what we need.
    location.reload();
  };
</script>

<section>
  <header>
    <sl-icon src={logo} style="color: {brandColor};"></sl-icon>
    <h2>{type}</h2>
  </header>
  <sl-divider></sl-divider>
  <p>{ username }</p>
  <footer>
    <sl-button
      bind:this={button}
      variant="danger"
      on:click={deleteIdentity}
      on:keypress={deleteIdentity}
      size="medium">
      <sl-icon src="/icons/trash.svg" slot="prefix"></sl-icon>
      Delete
    </sl-button>
  </footer>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 1rem 0 1rem 0;
    padding: 0;
    max-width: 30rem;
    border: 2px solid var(--sl-color-neutral-400);
    border-radius: var(--sl-border-radius-medium);
  }

  section > header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  section > header > sl-icon {
    flex: 0 0 auto;
    font-size: var(--sl-font-size-x-large);
    margin: 0.5rem 0.5rem 0.5rem 1rem;
  }

  section > header > h2 {
    flex: 1 1 auto;
    font-size: var(--sl-font-size-large);
    text-transform: capitalize;
    margin: 0.5rem 0 0.5rem 0;
  }

  sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin: 0 1rem 0 1rem;
  }

  p {
    margin: 1rem 0 1rem 2rem;
    font-size: var(--sl-font-size-large);
  }

  section > footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
  }

  section > footer > sl-button {
    flex: 0 0 auto;
    margin: 0.5rem 1rem 0.5rem 1rem;
  }

</style>


