<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Failure from "$lib/components/add-identity/Failure.svelte";
  import Form from "$lib/components/add-identity/Form.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import * as identityStores from "$lib/stores/identity.js";

  export let data;

  let failure
  const Render = State.make();
  Render.cleanup = () => {
    failure = null;
  };

  Render.form = () => {
    failure = data.bindings?.failure === "true";
    identityStores.onboardFailure.put({ failure });
  };

  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.form( data.bindings );

</script>

<div class="main-child">
  <BackLink heading="Add Identity"></BackLink>
  <Failure></Failure>
  <Form></Form>
</div>

<style>
</style>