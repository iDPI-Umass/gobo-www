<script>
  import Post from "$lib/components/Post.svelte"
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";

  let reference, state;
  const Render = State.make();

  const styleOverrides = {
    marginTop: "0"
  };

  Render.cycle = async ( draft ) => {
    if ( draft.quote == null ) {
      state = "waiting";
      return;
    }
    reference = draft.quote;
    state = "ready";
  };

  Render.cleanup = () => {
    reference = null;
    state = "waiting";
  };

  Render.reset();
  onMount(() => {
    Render.listen( "quote", Render.cycle );
    return () => {
      return;
    };
  });
</script>


<section>
  {#if state !== "ready"}
    <Spinner></Spinner>
  {:else}
    <Post
      identity={reference.identity}
      id={reference.id}
      fullPage={true}
      {styleOverrides}>
    </Post>
  {/if}
</section>


<style>
</style>