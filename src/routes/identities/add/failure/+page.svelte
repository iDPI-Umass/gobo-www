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
    <h1>Identity Onboarding Error</h1>
    <p>
      There was a problem adding this new identity to your profile.
      If you choose to try again, please carefully confirm that your
      information is correct. You can contact us if you're still 
      having problems. 
    </p>
    
    <div class="buttons">
      <sl-button
        href="/identities"
        class="submit"
        size="medium"
        pill>
        Identities
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