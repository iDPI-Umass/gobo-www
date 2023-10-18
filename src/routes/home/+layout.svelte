<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPageTriple from "$lib/components/layouts/NavPageTriple.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
  import IdentityFilters from "$lib/components/IdentityFilters.svelte";  
  import GeneralFilters from "$lib/components/GeneralFilters.svelte";
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <NavPageTriple current="home">
    <slot slot="main"></slot>
    <div slot="aside">
      <IdentityFilters></IdentityFilters>
      <GeneralFilters></GeneralFilters>
    </div>
  </NavPageTriple>
  <FooterNav current="home"></FooterNav>
</GuardFrame>

<style></style>