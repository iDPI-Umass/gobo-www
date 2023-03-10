<script>
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import * as Account from "$lib/helpers/account.js"; 

  const logout = async function ( event ) {
    event.preventDefault();
    await Account.logout();
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