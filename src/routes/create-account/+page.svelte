<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import CreateAccount from "$lib/components/logins/CreateAccount.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <CreateAccount slot="left"></CreateAccount>
  <Fascinator slot="right"></Fascinator>
</LeftRight>
