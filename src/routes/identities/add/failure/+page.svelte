<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  export let data;

  let failure
  const Render = State.make();
  Render.cleanup = () => {
    failure = null;
  };

  // TODO: Is there data we should encode in the querystring to change
  // what we display to people?
  Render.form = () => {
    failure = data.bindings?.failure;
  };

  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.form( data.bindings );

</script>

<div class="main-child">
  <section class="gobo-copy">
    <h1>Add Identity Error</h1>
    <p>
      There was a problem with adding your identity.
      Please confirm that the identity information you provided was correct.
      After confirming and retrying, please contact us if you're still
      having problems.
    </p>
    
    <div class="buttons">
      <sl-button
        href="/identities/add"
        class="submit"
        size="medium"
        pill>
        Add Identity
      </sl-button>
    </div>
  </section>
</div>

<style>
  .buttons {
    display: flex;
    justify-content: end;
  }
</style>