<script>
  // Base themes and fonts for project.
  import "$lib/styles/themes.css";
  import "$lib/styles/gobo-light-theme.css";
  import "$lib/styles/gobo-dark-theme.css";
  import "$lib/styles/fonts.css";

  // Pull in more application specific CSS stylings.
  import "$lib/styles/reset.css";
  import "$lib/styles/config-panel.css";
  import "$lib/styles/copy.css";
  import "$lib/styles/divider.css";
  import "$lib/styles/form.css";
  import "$lib/styles/radio-button.css";
  import "$lib/styles/brand.css";
  import "$lib/styles/keyword-table.css";

  // Now we can setup the store stuff with Svelte
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { beforeUpdate, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { themeStore } from "$lib/stores/theme.js";
  import { handleCallbacks } from "$lib/helpers/callback.js";

  if ( browser ) {
    let unsubscribeTheme;
    
    beforeUpdate( function() {
      unsubscribeTheme = themeStore.subscribe( function ( config ) {

        const html = document.querySelector( "html" )
        if ( config.dark === true ) {
          html.classList.add( "gobo-theme-dark", "sl-theme-dark" );
        } else {
          html.classList.remove( "gobo-theme-dark", "sl-theme-dark" );
        }

        if ( config.arial === true ) {
          html.classList.add( "gobo-font-arial" );
        } else {
          html.classList.remove( "gobo-font-arial" );
        }

        switch( config.fontSize ) {
          case "1":
            html.style.fontSize = "12px";
            break;
          case "2":
            html.style.fontSize = "14px";
            break;
          case "3":
            html.style.fontSize = "16px";
            break;
          case "4":
            html.style.fontSize = "18px";
            break;
          case "5":
            html.style.fontSize = "20px";  
            break;
        }
      });

    });

    onDestroy( function () {
      unsubscribeTheme();
    });

  }
</script>

<div class="page-wrapper">
  {#await handleCallbacks()}
    <Spinner></Spinner>
  {:then}
    <slot></slot>
  {:catch}
    <p>There was a problem with your login.</p>
  {/await}
</div>


<style>
</style>