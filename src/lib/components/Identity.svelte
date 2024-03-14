<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Identity, Name } from "$lib/engines/identity.js";
  import { Filter } from "$lib/engines/filter";
  import * as identityStores from "$lib/stores/identity.js";

  export let identity;
  
  let deleteButton;
  let logo = `/icons/${ identity.platform }.svg`;
  let state, names, avatar, fallback;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    names = [];
    avatar = "";
    fallback = "";
  };

  Render.identity = ( list ) => {
    const match = list.find( i => i.id === identity.id );
    if ( match == null ) {
      return;
    }

    names = [
      identity.name,
      Name.split( identity.prettyName ),
    ];

    avatar = Identity.avatar( match );
    fallback = Identity.fallback( match );
    state = "ready";
  };

  
  const Handle = {};
  Handle.error = ( f ) => {
    return async ( event ) => {
      try {
        await f( event );
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );        
      }
    }
  };

  Handle.remove = Handle.error( async ( event ) => {
    if ( deleteButton.loading === true ) {
      return;
    }

    deleteButton.loading = true;
    await Identity.remove( identity );

    // TODO: Check if there's a Svelte preference for this.
    location.reload();
  });

  Handle.toggle = Handle.error( async ( event ) => {
    identity.active = event.target.checked;
    await Identity.update( identity );
  });


  Render.reset();
  onMount(() => {
    Render.listen( identityStores.singleton, Render.identity );
    return () => {
      Render.reset();
    };
  });
</script>

<section>
  {#if state === "error"}
    <p>There was a problem displaying this identity.</p>

  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "ready"}
    <div>
      <sl-switch
        on:sl-change={Handle.toggle}
        checked={identity.active}
        size="medium">
        Active
      </sl-switch>


      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <sl-icon-button
        bind:this={deleteButton}
        variant="danger"
        on:click={Handle.remove}
        size="medium"
        src="/icons/trash.svg">
      </sl-icon-button>

    </div>


    <h2>
      <sl-icon src={logo} class="{identity.platform}"></sl-icon>
      { identity.platform }
    </h2>


    <figure>

      <img
        src="{avatar}" 
        alt="profile picture for {identity.prettyName}"
        onerror="this.onerror=null;this.src='{fallback}'">
      
      <figcaption>

        {#if names[0] != null}
          <p class="slot1">{ names[0] }</p>
        {/if}

        <p class="slot2">
          {#each names[1] as part}
            <span>{ part }</span>
          {/each}
        </p>
      </figcaption>
      
    </figure>
  
  {/if}
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

  @media ( max-width: 680px ) {
    section {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
  }

  figure {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
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

  h2 {
    flex: 1 0 100%;
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-black);
    text-transform: capitalize;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: var(--gobo-height-spacer-flex);
    padding-left: var(--gobo-width-spacer-flex);
  }

  h2 sl-icon {
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
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  figcaption .slot2 span {
    flex: 0 0 auto;
    margin: 0;
    word-break: break-all;
  }

  section > div {
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

  section > div > sl-switch {
    margin-bottom: 0;
    /* Allow switch to have better alignment with below image. */
    margin-left: 0.25rem
  }

  section > div > sl-icon-button::part(base),
  section > div > sl-icon-button::part(base):hover {
    color: var(--gobo-color-danger);
  }

</style>


