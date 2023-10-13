<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
  import "@shoelace-style/shoelace/dist/components/radio/radio.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { themeStore } from "$lib/stores/theme";
  let darkModeSwitch, darkModeState;
  let fontSwitch, fontState;
  let fontSizeGroup, fontSizeState;

  if ( browser ) {
    onMount(() => {
      const unsubscribeTheme = themeStore.subscribe( function ( config ) {
        darkModeState = config.dark;
        fontSizeState = config.fontSize;
        fontState = config.arial
      });

      const darkModeListener = function ( event ) {
        if ( event.target.checked === true ) {
          themeStore.setDark();
        } else {
          themeStore.setLight();
        }
      };

      const fontListener = function ( event ) {
        if ( event.target.checked === true ) {
          themeStore.setArial();
        } else {
          themeStore.setRoboto();
        }
      };

      const fontSizeListener = function ( event ) {
        themeStore.setFontSize( event.target.value );
      };

      darkModeSwitch.addEventListener( "sl-change", darkModeListener );
      fontSwitch.addEventListener( "sl-change", fontListener );
      fontSizeGroup.addEventListener( "sl-change", fontSizeListener );

      return function () {
        unsubscribeTheme();
        darkModeSwitch.removeEventListener( "sl-change", darkModeListener );
        fontSwitch.removeEventListener( "sl-change", fontListener );
        fontSizeGroup.removeEventListener( "sl-change", fontSizeListener );
      };
    });
  }
  

</script>


<div class="main-child">
  <BackLink heading="Appearance"></BackLink>

  <form class="gobo-form">
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
  </form>

  <form class="gobo-form">
    <h2>System Font</h2>
    <p>
      Use Arial instead of Roboto.
    </p>
    
    <sl-switch
      bind:this={fontSwitch}
      checked={fontState}
      size="medium">
      System Font
    </sl-switch>
  </form>
    
  <form class="gobo-form">
    <h2>Text Size</h2>
    <p>
      Adjust the text size according to your preference. Changes will be
      applied throughout the Gobo interface.
    </p>
    

    <sl-radio-group bind:this={fontSizeGroup} name="fontSize" value="{fontSizeState}">
      <sl-radio value="1" size="medium">Smallest</sl-radio>
      <sl-radio value="2" size="medium">Smaller</sl-radio>
      <sl-radio value="3" size="medium">Medium</sl-radio>
      <sl-radio value="4" size="medium">Larger</sl-radio>
      <sl-radio value="5" size="medium">Largest</sl-radio>
    </sl-radio-group>
  </form>
</div>


<style>
</style>