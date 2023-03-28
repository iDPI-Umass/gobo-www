<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import { onMount } from "svelte";

  export let lens;
  
  let activeSwitch, activeState;

  activeState = true;


  onMount( function () {
    activeSwitch.addEventListener( "sl-change", function ( event ) {
      if ( event.target.checked === true ) {
        console.log( "TBD activate lens" );
      } else {
        console.log( "TBD deactivate lens" );
      }
    });
  });
</script>

<section>

  <header>
    <h3>{ lens.name }</h3>
    <sl-switch
      bind:this={activeSwitch}
      checked={activeState}
      size="medium">
    </sl-switch>
  </header>

  <p>{ lens.description }</p>

</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    margin-bottom: var(--gobo-height-spacer-flex);
  }

  section > header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--gobo-height-spacer-flex);
  }

  sl-switch {
    align-self: flex-start;
  }

  h3 {
    font-weight: var(--gobo-font-weight-black);
    font-size: 1.125rem;
    text-transform: capitalize;
  }

  p {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
  }

</style>


