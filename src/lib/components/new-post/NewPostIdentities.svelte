<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State, Draft, Lock, Name } from "$lib/engines/draft.js";

  let state, visual, identities, lockedIdentity;
  const Render = State.make();

  Render.cleanup = () => {
    state = "start";
    visual = "waiting";
    identities = [];
    lockedIdentity = null;
  };

  Render.identities = ( draft ) => {
    identities = draft.identities;
    lockedIdentity = Lock.getIdentity();
    if ( identities.length === 0 ) {
      state = "no identities";
    } else if ( lockedIdentity != null ) {
      state = "locked"
    } else {
      state = "normal"
    }
    visual = "ready";
  };


  const Handle = {};
  Handle.switchIdentity = ( identity ) => {
    return ( event ) => {
      identity.active = event.target.checked;
      Draft.updateAspect( "identities", identities );
    };
  };

 
  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.identities );
    return () => {
      Render.reset();
    };
  });
</script>

<section>
  <h2>Choose Identities</h2>

  {#if visual === "waiting"}
    <Spinner></Spinner>
  {:else}

    {#if state === "no identities"}

      <p>No identities currently registered.</p>

    {:else if state === "locked"}

      <p>You cannot alter your identity for replies and quotes.</p>

      <div class="identities">
        <div class="identity">
          
          <div class="label">
            <sl-icon 
              src="/icons/{lockedIdentity.platform}.svg" 
              class="{lockedIdentity.platform}"
              size="medium">
            </sl-icon>
            <span>
              {#each Name.split(lockedIdentity.prettyName) as part}
                <span>{ part }</span>
              {/each}
            </span>
          </div>

          <sl-switch
            checked={true}
            disabled={true}
            size="medium">
          </sl-switch>
          
        </div>
      </div>

    {:else}
      {#each identities as identity (identity.key)}
        <div class="identity">
          
          <div class="label">
            <sl-icon 
              src="/icons/{identity.platform}.svg" 
              class="{identity.platform}"
              size="medium">
            </sl-icon>
            <span>
              {#each Name.split(identity.prettyName) as part}
                <span>{ part }</span>
              {/each}
            </span>
          </div>

          <sl-switch
            checked={identity.active}
            disabled={false}
            on:sl-change={Handle.switchIdentity( identity )}
            size="medium">
          </sl-switch>
        
        </div>
      {/each}

    {/if}

  {/if}

</section>

 
<style>
  .identities {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .identity {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    max-width: 100%;
    margin-bottom: 0;
    border-radius: var(--gobo-border-radius);
    border: var(--gobo-border-panel);
    margin-top: var(--gobo-height-spacer-half);
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }

  .identity:first-of-type {
    margin-top: var(--gobo-height-spacer-flex);
  }

  .identity > * {
    margin-bottom: 0;
  }

  .identity .label {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  .identity .label sl-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    min-width: max-content;
  }

  .identity .label span {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
  }

  .identity .label span span {
    flex: 0 0 auto;
    margin: 0;
    word-break: break-all;
  }

  .identity sl-switch {
    flex: 0 0 auto;
    margin-left: 1rem;
    margin-right: 0;
    min-width: max-content;
  }

</style>