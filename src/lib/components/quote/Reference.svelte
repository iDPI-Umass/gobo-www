<script>
  import Post from "$lib/components/Post.svelte"
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";

  let reference, state;
  const Render = State.make();

  Render.cycle = async ( draft ) => {
    if ( draft.quote?.data == null ) {
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
      {...reference.data}
      fullPage={true}>
    </Post>
  {/if}
</section>


<style>
  section {
    padding-top: var(--gobo-height-spacer);
  }
</style>