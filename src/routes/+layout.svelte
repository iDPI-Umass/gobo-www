<script>
  // Start with the CSS from Shoelace.
  import "@shoelace-style/shoelace/dist/themes/light.css";
  import "@shoelace-style/shoelace/dist/themes/dark.css";

  // Add in classes created for this project.
  import "$lib/styles/top.css";
  import "$lib/styles/copy.css";
  import "$lib/styles/divider.css";
  import "$lib/styles/form.css";

  // Now we can setup the store stuff with Svelte
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { theme } from "$lib/stores/theme.js";

  let unsubscribeTheme;

  unsubscribeTheme = theme.subscribe( function ( config ) {
    if ( browser ) {
      const html = document.querySelector( "html" )
      if ( config.dark === true ) {
        html.classList.add( "sl-theme-dark" );
      } else {
        html.classList.remove( "sl-theme-dark" );
      }
    }
  });

  onDestroy( function () {
    unsubscribeTheme();
  });
</script>

<div class="page-wrapper">
  <slot></slot>
</div>