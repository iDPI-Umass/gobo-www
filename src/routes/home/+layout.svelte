<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { marker } from "$lib/stores/feed-marker.js";

  const checkHome = function ( path ) {
    return function ( event ) {
      if ( window.location.pathname === path ) {
        marker.reset();
      }
    };    
  };
</script>

<MainHeader></MainHeader>
<NestedMenu>

  <VerticalNav slot="left">
    <NavLink href="/home" action="{ checkHome( "/home" ) }" >Home</NavLink>
    <NavLink href="/home/search">Search</NavLink>
    <NavLink href="/settings/feed">Feed Settings</NavLink>
    <NavLink href="/home/new-post">New Post</NavLink>
  </VerticalNav>
  
  <slot slot="right"></slot>

</NestedMenu>

