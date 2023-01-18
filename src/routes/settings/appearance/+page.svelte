<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import SettingsMenu from "$lib/components/settings/SettingsMenu.svelte";
  import Divider from "$lib/components/primitives/Divider.svelte"
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import { onMount } from "svelte";
  let darkModeSwitch;

  onMount(() => {
    darkModeSwitch.addEventListener( "sl-change", function( event ) {
      console.log( event.target.checked );  
    
    });
  });

</script>

<MainHeader></MainHeader>
<NestedMenu>
  <SettingsMenu slot="left"></SettingsMenu>
  <section slot="right" class="frame">
    <h1>Appearance</h1>

    <section class="panel dark-mode">
      <h2>Dark Mode</h2>
      <p>Controls Dark Mode</p>
      
      <sl-checkbox
        size="medium">
        Use OS Preference
      </sl-checkbox>
  
      <sl-switch
        bind:this={darkModeSwitch}
        size="medium">
        Dark Mode
      </sl-switch>
    </section>
    

    <Divider top="2rem" bottom="4rem"></Divider>
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

  h2 {
    font-size: var(--sl-font-size-large);
    margin-bottom: 1rem;
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