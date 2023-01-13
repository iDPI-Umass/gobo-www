<script>
  import PlainHeader from "$lib/components/PlainHeader.svelte"
  import LeftRight from "$lib/components/LeftRight.svelte"
  import Login from "$lib/components/Login.svelte"
  import Fascinator from "$lib/components/Fascinator.svelte"
</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <Login slot="left"></Login>
  <Fascinator slot="right"></Fascinator>
</LeftRight>