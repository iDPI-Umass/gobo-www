<script>
  import "@shoelace-style/shoelace/dist/themes/light.css";
  import "@shoelace-style/shoelace/dist/themes/dark.css";
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import "$lib/styles/top.css"
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