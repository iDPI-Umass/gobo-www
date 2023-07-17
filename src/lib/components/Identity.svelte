<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import * as Identity from "$lib/resources/identity.js";
  import * as Feed from "$lib/helpers/feed.js";
  import { onMount } from "svelte";


  export let identity;
  
  let deleteButton, activeSwitch;
  let logo = `/icons/${ identity.type }.svg`;
  let nameSlot1 = identity.name;
  let nameSlot2 = identity.prettyName;


  const deleteIdentity = async function ( event ) {
    event.preventDefault();
    if ( deleteButton.loading === true ) {
      return;
    }

    deleteButton.loading = true;
    await Feed.removeIdentity( identity );
    await Identity.remove( identity );

    // TODO: Figure out how to do this in svelte. I keep getting search results
    // for invalidate, but I don't think it's what we need.
    location.reload();
  };

  onMount( function () {
    const listener = async function ( event ) {
      await Feed.setIdentityActive( identity, event.target.checked );
    };

    activeSwitch.addEventListener( "sl-change", listener );

    return function () {
      activeSwitch.removeEventListener( "sl-change", listener );
    };
  });
</script>

<section>
  
  <section>
    <sl-switch
      bind:this={activeSwitch}
      checked={identity.active}
      size="medium">
      Active
    </sl-switch>


    <sl-icon-button
      bind:this={deleteButton}
      variant="danger"
      on:click={deleteIdentity}
      on:keypress={deleteIdentity}
      size="medium"
      src="/icons/trash.svg">
    </sl-icon-button>

  </section>

  <figure>
    <h2>
      <sl-icon src={logo} class="{identity.type}"></sl-icon>
      { identity.type }
    </h2>

    
    <img 
      src={identity.profile_image} 
      alt="profile picture for {identity.prettyName}">
    
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

  figure {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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

  figure h2 {
    flex: 1 0 100%;
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-black);
    text-transform: capitalize;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: var(--gobo-height-spacer-flex);
  }

  figure h2 sl-icon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }


  figcaption .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    text-transform: capitalize;
  }

  figcaption .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }


  section > section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: var(--gobo-height-spacer-half) var(--gobo-width-spacer-flex);
    margin-bottom: 0;
    border: none;
    border-bottom: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius) var(--gobo-border-radius) 0 0;
  }

  section > section > sl-switch {
    margin-bottom: 0;
    /* Allow switch to have better alignment with below image. */
    margin-left: 0.25rem
  }

  section > section > sl-icon-button::part(base),
  section > section > sl-icon-button::part(base):hover {
    color: var(--gobo-color-danger);
  }

</style>


