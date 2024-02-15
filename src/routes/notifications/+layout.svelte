<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPageTriple from "$lib/components/layouts/NavPageTriple.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
  import IdentityFilters from "$lib/components/IdentityFilters.svelte";  
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <NavPageTriple current="notifications">
    <slot slot="main"></slot>
    <div slot="aside">
      <IdentityFilters></IdentityFilters>
    </div>
  </NavPageTriple>
  <FooterNav current="notifications"></FooterNav>
</GuardFrame>

<style>
  div {
    max-height: calc(100dvh - 4rem);
    overflow-y: scroll;
  }
</style>