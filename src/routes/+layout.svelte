<script>
  // Start with the CSS from Shoelace.
  import "@shoelace-style/shoelace/dist/themes/light.css";
  import "@shoelace-style/shoelace/dist/themes/dark.css";

  // Add in classes created for this project.
  import "$lib/styles/top.css";
  import "$lib/styles/config-panel.css";
  import "$lib/styles/copy.css";
  import "$lib/styles/divider.css";
  import "$lib/styles/form.css";
  import "$lib/styles/radio-button.css";
  import "$lib/styles/brand.css";
  import "$lib/styles/keyword-table.css";

  // Now we can setup the store stuff with Svelte
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { theme } from "$lib/stores/theme.js";
  import { handleAuthCallback } from "$lib/helpers/auth-callback.js";

  if ( browser ) {
    let unsubscribeTheme;
    
    onMount( async function() {
      unsubscribeTheme = theme.subscribe( function ( config ) {

        const html = document.querySelector( "html" )
        if ( config.dark === true ) {
          html.classList.add( "sl-theme-dark" );
        } else {
          html.classList.remove( "sl-theme-dark" );
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

      // try {
      //   await handleAuthCallback();
      // } catch (error) {
      //   console.error( error );
      // }

    });

    onDestroy( function () {
      unsubscribeTheme();
    });

  }
</script>

<div class="page-wrapper">
  <slot></slot>
</div>