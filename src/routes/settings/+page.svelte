<script>
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { auth } from "$lib/stores/auth.js";
  import { getClient } from "$lib/helpers/auth0.js";

  const logout = async function ( event ) {
    event.preventDefault();
    auth.logout();
    const client = await getClient();
    client.logout()
  };
</script>

<h1>Settings</h1>

<VerticalNav slot="left">
  <NavLink href="/settings/profile">Profile</NavLink>
  <NavLink href="/settings/appearance">Apperance</NavLink>
  <NavLink href="/settings/feed">Feed</NavLink>
  <NavLink href="#" action={logout}>Logout</NavLink>
</VerticalNav>

<style>
  h1 {
    font-size: var(--sl-font-size-x-large);
    font-weight: var(--sl-font-weight-bold);
    margin-bottom: 2rem;
  }
</style>