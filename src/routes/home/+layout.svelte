<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPageTriple from "$lib/components/layouts/NavPageTriple.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
    import IdentityFilters from "$lib/components/IdentityFilters.svelte";
    import LensFilters from "$lib/components/LensFilters.svelte";
  
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <NavPageTriple current="home">
    <slot slot="main"></slot>
    <div slot="aside">
      <IdentityFilters></IdentityFilters>
      <LensFilters></LensFilters>
    </div>
  </NavPageTriple>
  <FooterNav current="home"></FooterNav>
</GuardFrame>

<style>
  div[slot="aside"] {
    display: none;
  }

  @media ( min-width: 1150px ) {
    div[slot="aside"] {
      display: inherit;
      margin-top: var(--gobo-height-spacer);
      margin-right: var(--gobo-width-spacer);
    }
  }
  
</style>