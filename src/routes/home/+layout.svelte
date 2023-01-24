<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte"
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte"
  import NavLink from "$lib/components/primitives/NavLink.svelte"
</script>

<MainHeader></MainHeader>
<NestedMenu>

  <VerticalNav slot="left">
    <NavLink href="/home">Home</NavLink>
    <NavLink href="/home/settings">Feed Settings</NavLink>
    <NavLink href="/home/search">Search</NavLink>
    <NavLink href="/home/new-post">New Post</NavLink>
  </VerticalNav>
  
  <slot slot="right"></slot>

</NestedMenu>

