<script>
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
</script>


<h1>Identities</h1>

<VerticalNav>
  <NavLink href="/identities/list">Your Identities</NavLink>
  <NavLink href="/identities/add">Add Identity</NavLink>
  <NavLink href="/identities/about">About Identities</NavLink>
</VerticalNav>


<style>
  h1 {
    font-size: var(--sl-font-size-x-large);
    font-weight: var(--sl-font-weight-bold);
    margin-bottom: 2rem;
  }
</style>