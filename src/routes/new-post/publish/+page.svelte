<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Alerts from "$lib/components/delivery/Alerts.svelte";
  import Uploads from "$lib/components/delivery/Uploads.svelte";
  import Targets from "$lib/components/delivery/Targets.svelte";
  import Buttons from "$lib/components/delivery/Buttons.svelte";
</script>


<div class="main-child">
  <BackLink heading="Publish Status"></BackLink>
  
  <form class="gobo-form">

    <section class="panel">
      <Alerts></Alerts>
    </section>

    <section class="panel">
      <Uploads></Uploads>
    </section>

    <section class="panel">
      <Targets></Targets>
    </section>
  
    <section class="panel">
      <Buttons></Buttons>
    </section>

  </form>
</div>


<style>
  .gobo-form {
    margin-top: var(--gobo-height-spacer-flex);
    padding: 0;
  }

  .gobo-form .panel {
    padding: var(--gobo-width-spacer-flex) var(--gobo-height-spacer-flex);
    margin: 0;
    border-bottom: var(--gobo-border-panel);
  }

  .gobo-form .panel:empty {
    padding: 0;
    margin: 0;
    border-bottom: none;
  }

  .gobo-form .panel:last-child {
    border-bottom: none;
  }

  .gobo-form .panel :global(h2) {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-medium);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-form .panel :global(h3) {
    font-size: var(--gobo-font-size-large);
    font-weight: var(--gobo-font-weight-black);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-form .panel :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .gobo-form .panel :global(*):first-child {
    margin-top: 0;
  }
</style>