<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <slot></slot>
</GuardFrame>