<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPage from "$lib/components/layouts/NavPage.svelte";
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte"
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { guard } from "$lib/helpers/guard";
  
  guard();
</script>

<MainHeader></MainHeader>

<NavPage>
  <slot></slot>
</NavPage>

<FooterNav></FooterNav>