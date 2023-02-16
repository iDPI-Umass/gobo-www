<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPage from "$lib/components/layouts/NavPage.svelte";
  import { guard } from "$lib/helpers/guard";

  guard();
</script>

<MainHeader></MainHeader>

<NavPage>
  <slot></slot>
</NavPage>

<FooterNav></FooterNav>

<style>
</style>