<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
  import "@shoelace-style/shoelace/dist/components/radio-button/radio-button.js";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { theme } from "$lib/stores/theme";
  let darkModeSwitch, darkModeState, unsubscribeTheme;
  let fontSizeGroup, fontSizeState;

  if ( browser ) {
    onMount(() => {
      unsubscribeTheme = theme.subscribe( function ( config ) {
        darkModeState = config.dark;
        fontSizeState = config.fontSize;
      });

      darkModeSwitch.addEventListener( "sl-change", function ( event ) {
        if ( event.target.checked === true ) {
          theme.setDark();
        } else {
          theme.setLight();
        }
      });

      fontSizeGroup.addEventListener( "sl-change", function ( event ) {
        theme.setFontSize( event.target.value );
      });
    });

    onDestroy( function () {
      unsubscribeTheme();
    });
  }
  

</script>


<section class="gobo-config-frame">
  <h1>Appearance</h1>

  <section class="panel dark-mode">
    <h2>Dark Mode</h2>
    <p>
      Dark Mode is Gobo's light-on-dark color scheme. By default, Gobo tries
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
  
  <sl-divider class="gobo-divider"></sl-divider>

  <section class="panel dark-mode">
    <h2>Text Size</h2>
    <p>
      Adjust the text size according to your preference. Changes will be
      applied throughout the Gobo interface.
    </p>
    

    <sl-radio-group bind:this={fontSizeGroup} name="fontSize" value="{fontSizeState}">
      <sl-radio-button value="1" size="medium">Smallest</sl-radio-button>
      <sl-radio-button value="2" size="medium">Samller</sl-radio-button>
      <sl-radio-button value="3" size="medium">Medium</sl-radio-button>
      <sl-radio-button value="4" size="medium">Larger</sl-radio-button>
      <sl-radio-button value="5" size="medium">Largest</sl-radio-button>
    </sl-radio-group>
  </section>
  
  <sl-divider class="gobo-divider"></sl-divider>

</section>


<style>
</style>