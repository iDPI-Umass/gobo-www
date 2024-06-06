<script>
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { humanize } from "$lib/helpers/humanize.js";

  export let delivery;

  let current, created;
  const Render = State.make();
  Render.cleanup = () => {
    current = "";
  };

  Render.current = () => {
    current = delivery;
    created = humanize( current.created );
  };

  Render.reset();
  onMount(() => {
    Render.current();
    return () => {
      Render.reset();
    };
  });
</script>


<div class="header">
  <time datetime="delivered">{ created }</time>
</div>


<style>
  .header {
    display: flex;
    justify-content: end;
  }

  .gobo-copy .header time {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
  }
</style>