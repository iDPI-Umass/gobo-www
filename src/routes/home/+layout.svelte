<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPage from "$lib/components/layouts/NavPage.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";

  // import { feedMarkerStore } from "$lib/stores/feed-marker.js";

  // const checkHome = function ( path ) {
  //   return function ( event ) {
  //     if ( window.location.pathname === path ) {
  //       marker.reset();
  //     }
  //   };    
  // };
  
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <NavPage>
    <slot></slot>
  </NavPage>
  <FooterNav></FooterNav>
</GuardFrame>