<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Feed from "$lib/components/delivery/Feed.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  const Render = State.make();
  Render.cleanup = () => {
  };

  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    }
  });
</script>
  

<div>
  <BackLink heading="Posts"></BackLink>
</div>
<Feed></Feed>


<style>
  /* 
    This is messy, but this is an edge case because the infinite notification
    feed has us avoiding using the "main-child" pattern. Correct this and
    the main case when we get a chance to refactor the layout.
  */
  @media( min-width: 680px ) {
    div {
      padding: var(--gobo-height-spacer) var(--gobo-width-spacer) 0 var(--gobo-width-spacer); 
    }
  }

  @media ( max-width: 680px ) {
    div {
      padding: var(--gobo-height-spacer) 0 0 0;
    }
  }
</style>