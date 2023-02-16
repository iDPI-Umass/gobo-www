<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPage from "$lib/components/layouts/NavPage.svelte";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { marker } from "$lib/stores/feed-marker.js";
  import { guard } from "$lib/helpers/guard";

  // const checkHome = function ( path ) {
  //   return function ( event ) {
  //     if ( window.location.pathname === path ) {
  //       marker.reset();
  //     }
  //   };    
  // };

  guard();
</script>

<MainHeader></MainHeader>
<NavPage>
  <slot></slot>
</NavPage>
<FooterNav></FooterNav>

