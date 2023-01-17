<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import IdentitiesAbout from "$lib/components/identities/IdentitiesAbout.svelte"
  import IdentitiesMenu from "$lib/components/identities/IdentitiesMenu.svelte";
</script>

<MainHeader></MainHeader>
<NestedMenu>
  <IdentitiesMenu slot="left"></IdentitiesMenu>
  <IdentitiesAbout slot="right"></IdentitiesAbout>
</NestedMenu>