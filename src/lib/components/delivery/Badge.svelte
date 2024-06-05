<script>
  import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Name } from "$lib/engines/draft.js";
  
  export let label = "";
  export let family = "neutral"
  export let loading = false;

  const Render = State.make();
  Render.cleanup = () => {
  };

  Render.label = () => {
  };

  Render.reset();
  onMount(() => {
    Render.label();
    return () => {
      Render.reset();
    };
  })

  $: Render.label( label, family );
</script>

<div class="badge {family}">
  {#if loading === true}
    <sl-spinner />
  {:else}
    <div class="text">
      {label}
    </div>
  {/if}
</div>


<style>
  .badge {
    flex: 0 0 auto;
    font-weight: var(--gobo-font-weight-black);
    font-size: 14px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0.75rem;
    border-radius: 1rem;
    min-width: 4rem;
  }

  .badge.neutral {
    background-color: var(--gobo-color-null);
    color: var(--gobo-color-text);
    border: var(--gobo-border-panel);
  }

  .badge.success {
    background-color: var(--sl-color-success-300);
    color: var(--gobo-color-text);
  }

  .badge.danger {
    background-color: var(--sl-color-danger-300);
    color: var(--gobo-color-text);
  }

  .badge.inert {
    background-color: var(--gobo-color-panel);
    color: var(--gobo-color-text);
  }

  .badge .text {
    padding-top: 0.1rem;
  }

  .badge sl-spinner {
    font-size: 14px;
    --indicator-color: var(--gobo-color-text);
  }
</style>