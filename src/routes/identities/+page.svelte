<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import NestedMenu from "$lib/components/layouts/NestedMenu.svelte"
  import IdentitiesMenu from "$lib/components/identities/IdentitiesMenu.svelte"
  import Identities from "$lib/components/identities/Identities.svelte"
</script>

<MainHeader></MainHeader>
<NestedMenu>
  <IdentitiesMenu slot="left"></IdentitiesMenu>
  <Identities slot="right"></Identities>
</NestedMenu>