<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import MainFooter from "$lib/components/headers/MainFooter.svelte";
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { marker } from "$lib/stores/feed-marker.js";
  import { guard } from "$lib/helpers/guard";

  const checkHome = function ( path ) {
    return function ( event ) {
      if ( window.location.pathname === path ) {
        marker.reset();
      }
    };    
  };

  guard();
</script>

<MainHeader></MainHeader>
<NestedMenu melting="true">

  <VerticalNav slot="left">
    <NavLink href="/home" action="{ checkHome( "/home" ) }" >Home</NavLink>
    <NavLink href="/home/search">Search</NavLink>
    <NavLink href="/home/new-post">New Post</NavLink>
    <NavLink href="/identities">Identities</NavLink>
  </VerticalNav>
  
  <slot slot="right"></slot>

</NestedMenu>
<MainFooter></MainFooter>

