<script>
  import Post from "$lib/components/Post.svelte"
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  export let data;

  let identity, id;
  const Render = State.make();
  Render.reset = () => {
    identity = null;
    id = null;
  };

  // TODO: when we update IDs to strings, remove this.
  Render.bindings = () => {
    identity = Number( data.bindings.identity );
    id = Number( data.bindings.id );
  };

  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.bindings( data.bindings );
</script>

<div class="main-child">
  <BackLink heading="Post"></BackLink>

  <Post
    {identity}
    {id}
    fullPage={true}>
  </Post>  
</div>
