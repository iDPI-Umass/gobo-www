<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import { Identity, Name } from "$lib/engines/identity.js";
  import { Onboard } from "$lib/engines/onboarding.js";
  import * as identityStores from "$lib/stores/identity.js";

  export let identity;

  const writeOnlys = [
    "linkedin"
  ];

  const prettyNames = {
    bluesky: "Bluesky",
    linkedin: "LinkedIn",
    mastodon: "Mastodon",
    reddit: "Reddit",
    smalltown: "Smalltown"
  };

  let deleteButton, reauthorizeButton;
  let logo = `/icons/${ identity.platform }.svg`;
  let state, names, avatar, fallback, isWriteOnly, isStale;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    names = [];
    avatar = "";
    fallback = "";
    isWriteOnly = false;
    isStale = false;
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
    isWriteOnly = writeOnlys.includes( match.platform );
    isStale = match.stale === true;
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

  // Here we use some of the abstract model used to onboard people to trigger
  // a re-authorization flow. This needs some work to better abstract the flow
  // so it's not this pile of loose parts.
  Handle.reauthorize = async () => {
    if ( reauthorizeButton.loading === true ) {
      return;
    }
    reauthorizeButton.loading = true;

    // For Bluesky, we don't use a login-redirect flow. So the only thing we
    // can do is send the Gobo member to the add-identity page.
    if ( identity.platform === "bluesky" ) {
      return goto("/identities/add");
    }

    const context = {
      platform: identity.platform,
      baseURL: identity.base_url
    };

    Onboard.stow( context );
    await Onboard.start( context );
    if ( context.onboard == null ) {
      reauthorizeButton.loading = false;
      return;
    }

    const url = Onboard.makeLoginURL( context );
    window.location = url;
  };


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


    <div class="inner">
      <header>
        <sl-icon src={logo} class="{identity.platform}"></sl-icon>
        <h2>
          { prettyNames[identity.platform] }
        </h2>
  
        {#if isWriteOnly}
          <div class="badge">
            Write-Only
          </div>
        {/if}
      </header>
  
      {#if isStale === true}
        <sl-alert variant="warning" open>
          <sl-icon slot="icon" src="/icons/exclamation-triangle.svg"></sl-icon>
          <p class="message">
            Gobo is not able to access this identity.
            To restore access, please re-authorize Gobo.
          </p>
          <sl-button
            bind:this={reauthorizeButton}
            on:click={Handle.reauthorize}
            variant="primary"
            class="submit"
            pill>
            Reauthorize
          </sl-button>
        </sl-alert>
      {/if}
  
  
      <figure>
  
        <img
          src="{avatar}" 
          alt="profile picture for {identity.prettyName}"
          onerror="this.onerror=null;this.src='{fallback}'">
        
        <figcaption>
  
          {#if names[0] }
            <p class="slot1">{ names[0] }</p>
          {/if}
  
          <p class="slot2">
            {#each names[1] as part}
              <span>{ part }</span>
            {/each}
          </p>
        </figcaption>
        
      </figure>
    
    
    </div>
    
  
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    margin-top: var(--gobo-height-spacer-flex);
  }

  @media ( max-width: 680px ) {
    section {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
  }

  header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  header sl-icon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }

  header h2 {
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-black);
    text-transform: capitalize;
    margin-right: var(--gobo-width-spacer-flex);
  }
  
  header .badge {
    background-color: var(--gobo-color-null);
    color: var(--gobo-color-text);
    font-weight: var(--gobo-font-weight-black);
    font-size: 14px;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
  }

  .inner {
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--gobo-height-spacer-flex);
  }

  .inner sl-alert::part(message) {
    display: flex;
    justify-content: end;
    flex-wrap: wrap;
    gap: var(--gobo-width-spacer-flex) var(--gobo-height-spacer-flex);
  }

  .inner sl-alert sl-button {
    align-self: center;
  }

  @media ( min-width: 500px ) {
    .inner sl-alert::part(message) {
      flex-wrap: nowrap;
    }
  }

  .inner figure {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
    align-items: center;
  }

  .inner figure > img {
    height: 3.125rem;
    width: 3.125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-flex);
  }

  .inner figcaption {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }


  .inner figcaption .slot1 {
    font-size: var(--gobo-font-size-copy);
    text-transform: capitalize;
  }

  .inner figcaption .slot2 {
    font-size: var(--gobo-font-size-copy);
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  .inner figcaption p {
    font-weight: var(--gobo-font-weight-regular);
  }
  
  .inner figcaption p:first-of-type {
    font-weight: var(--gobo-font-weight-bold);
  }

  .inner figcaption .slot2 span {
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


