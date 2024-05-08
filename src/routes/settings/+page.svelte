<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { App } from "$lib/engines/account.js"; 

  const logout = async function ( event ) {
    event.preventDefault();
    await App.logout();
  };
</script>

<div class="main-child" >
  <BackLink heading="Settings"></BackLink>

  <VerticalNav slot="left">
    <NavLink href="/settings/profile">Profile</NavLink>
    <NavLink href="/settings/appearance">Appearance</NavLink>
    <NavLink href="/identities">Identities</NavLink>
    <NavLink href="/settings/filters">Filters</NavLink>
    <NavLink href="#" action={logout}>Logout</NavLink>
  </VerticalNav>
</div>