<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
  import "@shoelace-style/shoelace/dist/components/radio/radio.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { themeStore } from "$lib/stores/theme";
  let darkModeSwitch, darkModeState, unsubscribeTheme;
  let fontSwitch, fontState;
  let fontSizeGroup, fontSizeState;

  if ( browser ) {
    onMount(() => {
      unsubscribeTheme = themeStore.subscribe( function ( config ) {
        darkModeState = config.dark;
        fontSizeState = config.fontSize;
        fontState = config.arial
      });

      darkModeSwitch.addEventListener( "sl-change", function ( event ) {
        if ( event.target.checked === true ) {
          themeStore.setDark();
        } else {
          themeStore.setLight();
        }
      });

      fontSwitch.addEventListener( "sl-change", function ( event ) {
        if ( event.target.checked === true ) {
          themeStore.setArial();
        } else {
          themeStore.setRoboto();
        }
      });

      fontSizeGroup.addEventListener( "sl-change", function ( event ) {
        themeStore.setFontSize( event.target.value );
      });
    });

    onDestroy( function () {
      unsubscribeTheme();
    });
  }
  

</script>


<div class="main-child">
  <BackLink
    href="/settings"
    heading="Appearance">
  </BackLink>

  <form class="gobo-form">
    <h2>Dark Mode</h2>
    <p>
      Dark Mode is GOBO's light-on-dark color scheme. By default, GOBO tries
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
      applied throughout the GOBO interface.
    </p>
    

    <sl-radio-group bind:this={fontSizeGroup} name="fontSize" value="{fontSizeState}">
      <sl-radio value="1" size="medium">Smallest</sl-radio>
      <sl-radio value="2" size="medium">Samller</sl-radio>
      <sl-radio value="3" size="medium">Medium</sl-radio>
      <sl-radio value="4" size="medium">Larger</sl-radio>
      <sl-radio value="5" size="medium">Largest</sl-radio>
    </sl-radio-group>
  </form>
</div>


<style>
</style>