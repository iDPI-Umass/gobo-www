<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte"
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { guard } from "$lib/helpers/guard";
  
  guard();
</script>

<MainHeader></MainHeader>
<NestedMenu>

  <VerticalNav slot="left">
    <NavLink href="/identities">Your Identities</NavLink>
    <NavLink href="/identities/add">Add Identity</NavLink>
    <NavLink href="/identities/about">About Identities</NavLink>
  </VerticalNav>

  <slot slot="right"></slot>

</NestedMenu>