<script>
  import { page } from "$app/stores"
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte";
  import CenterAlt from "$lib/components/layouts/CenterAlt.svelte";
</script>

<PlainHeader></PlainHeader>
<CenterAlt>
  <h1>{$page.status}</h1>
  <h2>{$page.error.message}</h2>
</CenterAlt>