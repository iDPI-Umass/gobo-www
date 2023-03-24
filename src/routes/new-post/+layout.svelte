<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPage from "$lib/components/layouts/NavPage.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <NavPage current="new post">
    <slot></slot>
  </NavPage>
  <FooterNav current="new post"></FooterNav>
</GuardFrame>