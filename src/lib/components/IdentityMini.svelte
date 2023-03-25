<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import { onMount } from "svelte";

  export let identity;
  
  let activeSwitch, activeState;
  let logo = `/icons/${ identity.type }.svg`;

  activeState = true;


  onMount( function () {
    activeSwitch.addEventListener( "sl-change", function ( event ) {
      if ( event.target.checked === true ) {
        console.log( "TBD activate identity" );
      } else {
        console.log( "TBD deactivate identity" );
      }
    });
  });
</script>

<section>

  <span>
    <sl-icon src={logo} class="{identity.type}"></sl-icon>
    <p>{ identity.fullUsername }</p>
  </span>

  <sl-switch
    bind:this={activeSwitch}
    checked={activeState}
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
    margin-right: var(--gobo-width-spacer-flex);
  }

  section > span > p {
    font-size: 0.75rem;
    max-width: 10rem;
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


