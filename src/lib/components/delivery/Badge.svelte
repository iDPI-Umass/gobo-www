<script>
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Name } from "$lib/engines/draft.js";
  
  export let label
  export let family = "neutral";

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
  {label}
</div>


<style>
  .badge {
    flex: 0 0 auto;
    font-weight: var(--gobo-font-weight-black);
    font-size: 14px;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    padding-top: 0.1rem;
    border-radius: 1rem;
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
</style>