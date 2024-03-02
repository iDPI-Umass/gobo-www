<script>
  import Reply from "$lib/components/reply/Reference.svelte";
  import Quote from "$lib/components/quote/Reference.svelte";
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";

  let state;
  const Render = State.make();

  Render.cycle = ( draft ) => {
    if ( draft.reply != null ) {
      state = "reply";
    } else if ( draft.quote != null ) {
      state = "quote";
    } else {
      state = "empty";
    }
  };

  Render.cleanup = () => state = "emtpy";

  Render.reset();
  onMount(() => {
    Render.listen( "reply", Render.cycle );
    Render.listen( "quote", Render.cycle );
    return () => {
      Render.reset();
    };
  });
</script>


{#if state === "reply"}
  <Reply></Reply>
{:else if state === "quote"}
  <Quote></Quote>
{/if}