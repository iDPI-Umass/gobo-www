<script>
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
  import "@shoelace-style/shoelace/dist/components/radio-button/radio-button.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import  "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Failure from "$lib/components/add-filter/Failure.svelte";
  import Form from "$lib/components/add-filter/Form.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import * as filterStores from "$lib/stores/filter.js";

  export let data;

  let failure
  const Render = State.make();
  Render.cleanup = () => {
    failure = null;
  };

  Render.form = () => {
    failure = data.bindings?.failure === "true";
    filterStores.addFailure.put({ failure });
  };

  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.form( data.bindings );
</script>

<div class="main-child">
  <BackLink heading="Add Filter"></BackLink>
  <Failure></Failure>
  <Form></Form>
</div>


<style>
</style>