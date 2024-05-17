<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Identity } from "$lib/engines/identity.js";
  import { Feed } from "$lib/engines/feed/index.js";
  import { Feed as Notifications } from "$lib/engines/notification.js";

  export let identity;
  
  let activeSwitch;
  let logo = `/icons/${ identity.platform }.svg`;
  let isStale;
  const Render = State.make();
  
  Render.cleanup = () => {
    isStale = false;
  };

  Render.identity = async () => {
    isStale = identity.stale === true;

    if ( isStale === true && identity.active === true ) {
      identity.active = false;
      await Identity.update( identity );
      return;
    }
  };
  
  const Handle = {};
  Handle.toggle = async ( event ) => {
    const active = event.target.checked
    await Identity.update({ ...identity, active });
    Feed.refresh();
    Notifications.refresh();
  };


  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.identity( identity );
</script>

<section>

  <sl-icon
    src={logo}
    class="{identity.platform}"
    class:disabled={isStale}>
  </sl-icon>
  
  {#if isStale}
    <sl-icon
      src="/icons/exclamation-triangle.svg"
      class="warning">
    </sl-icon>
  {/if}

  <p>
    { identity.prettyName }
  </p>

  <sl-switch
    bind:this={activeSwitch}
    checked={identity.active}
    on:sl-change={Handle.toggle}
    disabled={isStale}
    size="medium">
  </sl-switch>

</section>

<style>
  section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: var(--gobo-height-spacer-flex);
  }

  section sl-icon {
    flex: 0 0 auto;
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }

  section p {
    flex: 1 1 100%;
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 0.5rem;
  }

  section sl-switch {
    flex: 0 0 auto;
  }
</style>


