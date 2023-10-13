<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import FixedNavPageTriple from "$lib/components/layouts/FixedNavPageTriple.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
  import IdentityFilters from "$lib/components/IdentityFilters.svelte";
  import LensFilters from "$lib/components/LensFilters.svelte";
  
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <FixedNavPageTriple current="home">
    <slot slot="main"></slot>
    <div slot="aside">
      <IdentityFilters></IdentityFilters>
      <LensFilters></LensFilters>
    </div>
  </FixedNavPageTriple>
  <FooterNav current="home"></FooterNav>
</GuardFrame>

<style></style>