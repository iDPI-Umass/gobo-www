<script>
  import Divider from "$lib/components/primitives/Divider.svelte"
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import { onMount, onDestroy } from "svelte";
  import { theme } from "$lib/stores/theme";
  let darkModeSwitch, darkModeState, unsubscribeTheme;

  unsubscribeTheme = theme.subscribe( function ( config ) {
      darkModeState = config.dark;
    });

  onMount(() => {
    darkModeSwitch.addEventListener( "sl-change", function( event ) {
      if ( event.target.checked === true ) {
        theme.setDark();
      } else {
        theme.setLight();
      }
    });
  });

  onDestroy( function () {
    unsubscribeTheme();
  });

</script>


<section class="frame">
  <h1>Appearance</h1>

  <section class="panel dark-mode">
    <h2>Dark Mode</h2>
    <p>Dark Mode is GOBO's light-on-dark color scheme. By default, GOBO tries
      to respect the preference set in your operating system, but you can
      configure it directly here.
    </p>
    

    <sl-switch
      bind:this={darkModeSwitch}
      checked={darkModeState}
      size="medium">
      Dark Mode
    </sl-switch>
  </section>
  

  <Divider top="1rem" bottom="4rem"></Divider>
</section>


<style>
  .frame {
    max-width: 32rem;
    margin: 0;
  }

  .frame > h1 {
    font-size: var(--sl-font-size-x-large);
    margin-bottom: 2rem;
  }

  .panel > h2 {
    font-size: var(--sl-font-size-large);
    margin-bottom: 1rem;
  }

  .panel > p {
    margin-bottom: 2rem;
  }
</style>