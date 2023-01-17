<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte";
  import IdentitiesMenu from "$lib/components/identities/IdentitiesMenu.svelte";
  import IdentitiesAdd from "$lib/components/identities/IdentitiesAdd.svelte"
</script>

<MainHeader></MainHeader>
<NestedMenu>
  <IdentitiesMenu slot="left"></IdentitiesMenu>
  <IdentitiesAdd slot="right"></IdentitiesAdd>
</NestedMenu>
