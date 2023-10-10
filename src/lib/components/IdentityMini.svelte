<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import { onMount } from "svelte";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  import { feedStore } from "$lib/stores/feed.js";


  export let identity;
  
  let activeSwitch;
  let logo = `/icons/${ identity.platform }.svg`;


  onMount( function () {
    const listener = async function ( event ) {
      const engine = await FeedSaver.getEngine();
      engine.setActiveState( identity, event.target.checked );
      feedStore.push({ command: "reset" })
    };

    activeSwitch.addEventListener( "sl-change", listener );

    return function () {
      activeSwitch.removeEventListener( "sl-change", listener );
    };
  });
</script>

<section>

  <span>
    <sl-icon src={logo} class="{identity.platform}"></sl-icon>
    <p>{ identity.prettyName }</p>
  </span>

  <sl-switch
    bind:this={activeSwitch}
    checked={identity.active}
    size="medium">
  </sl-switch>

</section>

<style>
  section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: var(--gobo-height-spacer-flex);
  }

  section > span {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-right: 0.5rem;
  }

  section > span > p {
    font-size: var(--gobo-font-size-detail);
    max-width: 11rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  sl-icon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }


  p {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
  }

</style>


