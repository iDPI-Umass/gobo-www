<script>
  import PlainHeader from "$lib/components/PlainHeader.svelte"
  import LeftRight from "$lib/components/LeftRight.svelte"
  import CreateAccount from "$lib/components/CreateAccount.svelte"
  import Fascinator from "$lib/components/Fascinator.svelte"
</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <CreateAccount slot="left"></CreateAccount>
  <Fascinator slot="right"></Fascinator>
</LeftRight>
