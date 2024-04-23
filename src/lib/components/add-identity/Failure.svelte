<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";;
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State } from "$lib/engines/store.js";

  export let failure = null;

  let text;
  const Render = State.make();
  Render.cleanup = () => {
    text = null;
  };

  Render.failure = () => {
    text = failure;
  };

  const Handle = {};

  Handle.close = () => {
    goto( "/identities/add" );
  };
  
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.failure( failure );
</script>

{#if text != null}
  <div>
    <sl-alert
      on:sl-hide={Handle.close}
      variant="danger"
      open
      closable>
      <sl-icon slot="icon" src="/icons/exclamation-octagon.svg"></sl-icon>
      We were unable to add your identity.
    </sl-alert>
  </div>
  
{/if}

<style>
  div {
    padding: 1rem;
    background-color: var(--gobo-color-panel);
    border-radius: var(--gobo-border-radius);
    margin-top: 2rem;
  }
</style>