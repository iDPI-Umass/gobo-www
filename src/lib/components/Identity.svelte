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

  let nameSlot1 = display_name;
  let nameSlot2;
  let hostname;
  switch ( type ) {
    case "twitter":
      nameSlot2 = `@${ username }`;
      break;
    case "reddit":
      nameSlot2 = `u/${ username }`;
      break;
    case "mastodon":
      // We just want the hostname to form a fully specified Mastodon reference.
      if ( base_url.startsWith( "https://" ) === true ) {
        let url = new URL( base_url );
        hostname = url.hostname;
      } else {
        hostname = base_url;
      }
      
      nameSlot2 = `@${ username }@${ hostname }`;
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
  
  <div class="profile-display">
    
    <img src={profile_image} alt="profile picture for {username}">
    
    <div class="names">
      {#if nameSlot1 != null}
        <div class="slot1">{ nameSlot1 }</div>
      {/if}
      <div class="slot2">{ nameSlot2 }</div>
    </div>
    
  </div>

</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: var(--gobo-height-spacer);
    width: 100%;
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
  }

  section > header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin: var(--gobo-height-spacer) var(--gobo-width-spacer);
  }

  section > header > sl-icon {
    flex: 0 0 auto;
    font-size: 1.5625rem;
    margin: 0 0.5rem 0 0;
  }

  section > header > h2 {
    flex: 1 1 auto;
    font-size: 1.1875rem;
    text-transform: capitalize;
  }

  section > header > sl-icon-button::part(base),
  section > header > sl-icon-button::part(base):hover {
    color: var(--gobo-color-danger);
  }



  section > sl-divider {
    margin: 0;
    --color: var(--gobo-color-border-panel);
  }


  .profile-display {
    margin: var(--gobo-height-spacer) var(--gobo-width-spacer);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .profile-display > img {
    height: 3.125rem;
    width: 3.125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer);
  }

  .names {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .names .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    text-transform: capitalize;
  }

  .names .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
  }

</style>


