<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Alerts from "$lib/components/delivery/Alerts.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Draft } from "$lib/engines/draft.js";
  import * as deliveryStore from "$lib/stores/delivery.js";

  let uploads;
  const Render = State.make();
  Render.cleanup = () => {
    uploads = [];
  };

  Render.publish = (  ) => {
  };


  const Handle = {};
  

  Render.reset();
  onMount(() => {
    Render.listen( "attachments", Render.attachments );
    return () => {
      Render.reset();
    };
  });
</script>

<div class="main-child">

  <div class="main-child">
    <BackLink heading="Publish Status"></BackLink>
    
    <form class="gobo-form">
  
      <section class="panel">
        <Alerts></Alerts>
      </section>
    
      <section class="panel">
        <p>Stuff goes here.</p>
      </section>

    </form>
  </div>
</div>


<style>

</style>