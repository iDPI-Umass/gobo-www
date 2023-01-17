<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Login from "$lib/components/logins/Login.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
</script>

<PlainHeader></PlainHeader>
<LeftRight>
  <Login slot="left"></Login>
  <Fascinator slot="right"></Fascinator>
</LeftRight>