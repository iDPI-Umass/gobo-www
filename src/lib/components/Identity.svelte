<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { getGOBOClient } from "$lib/helpers/account.js";
 
  export let type;
  export let base_url;
  export let profile_url;
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

  let fullName, url;
  switch ( type ) {
    case "twitter":
      fullName = `@${ username }`;
      break;
    case "reddit":
      fullName = `u/${ username }`;
      break;
    case "mastodon":
      url = new URL(  base_url );
      fullName = `@${ username }@${ url.hostname }`;
      break;
  }

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
    <sl-icon-button
      bind:this={button}
      variant="danger"
      on:click={deleteIdentity}
      on:keypress={deleteIdentity}
      size="medium"
      src="/icons/trash.svg">
    </sl-icon-button>
  </header>
  <sl-divider></sl-divider>
  <span class="profile-display">
    {#if profile_image != null}
    <img src={profile_image} alt="profile picture for {username}">
    {/if}
    <a href="{profile_url}">{ fullName }</a>
  </span>
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

  section > header > sl-icon-button {
    margin-right: 1rem;
  }

  section > header > sl-icon-button::part(base),
  section > header > sl-icon-button::part(base):hover {
    color: var(--sl-color-danger-500);
  }

  sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin: 0 1rem 0 1rem;
  }

  .profile-display {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin: 1rem;
  }

  .profile-display > img {
    height: 3rem;
    width: 3rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: 1rem;
  }

  .profile-display > a {
    font-size: var(--sl-font-size-large);
  }

  .profile-display > a:focus {
    margin: -2px;
  }

</style>


