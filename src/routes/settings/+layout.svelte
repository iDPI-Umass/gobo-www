<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { guard } from "$lib/helpers/guard";
  import { getClient } from "$lib/helpers/auth0.js";

  guard();

  const logout = async function ( event ) {
    event.preventDefault();
    const client = await getClient();
    client.logout()
  };

</script>

<MainHeader></MainHeader>
<NestedMenu>

  <VerticalNav slot="left">
    <NavLink href="/settings/profile">Profile</NavLink>
    <NavLink href="/settings/appearance">Apperance</NavLink>
    <NavLink href="/settings/feed">Feed</NavLink>
    <NavLink href="#" action={logout}>Logout</NavLink>
  </VerticalNav>

  <slot slot="right"></slot>

</NestedMenu>