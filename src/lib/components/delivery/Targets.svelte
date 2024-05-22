<script>
  import Target from "$lib/components/delivery/Target.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  export let delivery;

  let targets;
  const Render = State.make();

  Render.cleanup = () => {
    targets = [];
  };

  Render.targets = () => {
    targets = delivery.targets;
  };


  Render.reset();
  onMount(() => {
    Render.targets();
    return () => {
      Render.reset();
    };
  });

  $: Render.targets( delivery );
</script>


{#if targets.length > 0 }
  <h2>Identities</h2>

  <div class="gobo-table">
    {#each targets as target (target.id)}
      <Target {target} on:unpublish />
    {/each}
  </div>
{/if}



<style>
  .gobo-table {
    min-height: 3rem;
    margin-top: var(--gobo-height-spacer-flex);
  }
</style>