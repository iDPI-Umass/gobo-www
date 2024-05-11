<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";


  const Render = State.make();

  Render.cleanup = () => {
  };


  const Handle = {};
  
  Handle.done = () => {
    goto( "/home" );
  }


  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });
</script>


<div class="buttons">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <sl-button
    on:click={Handle.done}
    class="submit"
    size="medium"
    pill>
    OK
  </sl-button>
</div>



<style>
  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: end;
    align-items: center;
    margin-top: 2rem;
    border-top: none;
    padding-top: 0;
  }

  .buttons sl-button {
    margin-bottom: 0;
    width: 10rem;
  }
</style>