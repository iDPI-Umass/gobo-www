<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  export let top = "0rem";
  export let bottom = "0rem";
</script>

<sl-divider
  style="--top:{top}; --bottom:{bottom}"
  ></sl-divider>

<style>
  sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin-top: var(--top);
    margin-bottom: var(--bottom);
  }
</style>
