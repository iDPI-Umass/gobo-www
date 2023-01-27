<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
</script>

<MainHeader></MainHeader>
<NestedMenu>

  <VerticalNav slot="left">
    <NavLink href="/settings/profile">Profile</NavLink>
    <NavLink href="/settings/appearance">Apperance</NavLink>
    <NavLink href="/settings/feed">Feed</NavLink>
  </VerticalNav>

  <slot slot="right"></slot>

</NestedMenu>