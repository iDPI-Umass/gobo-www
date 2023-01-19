<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import SettingsMenu from "$lib/components/settings/SettingsMenu.svelte";
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

<MainHeader></MainHeader>
<NestedMenu>
  <SettingsMenu slot="left"></SettingsMenu>
  <section slot="right" class="frame">
    <h1>Appearance</h1>

    <section class="panel dark-mode">
      <h2>Dark Mode</h2>
      <p>Dark Mode is GOBO's light-on-dark color scheme. By default, GOBO tries
        to respect the preference set in your operating system, but you can set
        it here.
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
</NestedMenu>


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

  .dark-mode {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .dark-mode > * {
    margin-bottom: 1rem;
  }

</style>