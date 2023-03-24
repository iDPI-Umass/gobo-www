<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { getGOBOClient } from "$lib/helpers/account.js";

  
  export let identity;  
  
  let button;
  let logo = `/icons/${ identity.type }.svg`;
  let nameSlot1 = identity.display_name;
  let nameSlot2 = identity.fullUsername;


  const deleteIdentity = async function ( event ) {
    event.preventDefault();
    button.loading = true;
    const client = await getGOBOClient();
    await client.removeIdentity({
      parameters: identity
    });

    // TODO: Figure out how to do this in svelte. I keep getting search results
    // for invalidate, but I don't think it's what we need.
    location.reload();
  };
</script>

<section>

  <header>
    
    <sl-icon src={logo} class="{identity.type}"></sl-icon>
    
    <h2>{identity.type}</h2>
    
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
  
  <figure>
    
    <img 
      src={identity.profile_image} 
      alt="profile picture for {identity.fullUsername}">
    
    <figcaption>
      {#if nameSlot1 != null}
        <p class="slot1">{ nameSlot1 }</p>
      {/if}
      <p class="slot2">{ nameSlot2 }</p>
    </figcaption>
    
  </figure>

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
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
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


  figure {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  figure > img {
    height: 3.125rem;
    width: 3.125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-flex);
  }

  figcaption {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }

  figcaption .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    text-transform: capitalize;
  }

  figcaption .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
  }

</style>


