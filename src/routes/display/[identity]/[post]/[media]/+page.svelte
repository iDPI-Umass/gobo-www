<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Post } from "$lib/engines/post.js";
  import { isImage, isVideo } from "$lib/helpers/type.js";
  
  export let data;
  
  let state, media;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    media = {};
  };

  Render.media = async () => {
    const post = await Post.get({
      identity: data.bindings.identity,
      id: data.bindings.post
    });
    
    if ( post == null ) {
      state = "error";
      return;
    }

    let id = Number( data.bindings.media );
    let match = post
      .attachments
      .filter( a => /^(image|video)\//.test(a.type) )
      [ id ];

    if ( match != null ) {
      media = match;
      state = "ready";
    } else {
      state = "error";
    }
  };


  Render.reset();
  onMount(() => {
    Render.media();
    return () => {
      Render.reset();
    };
  });
</script>



<BackLink heading="Media"></BackLink>

{#if state === "error"}
  <p>There was a problem loading this media</p>

{:else if state === "loading"}
  <Spinner></Spinner>

{:else if state === "ready"}
  <div class="frame">
    {#if isImage( media )}
      <img 
        src="{ media.url }"
        alt="full size">
    {:else if isVideo( media )}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video loop controls>
        <source 
          src={ media.url }
          type={ media.type }>
      </video>
    {/if}
  </div>

  {/if}



<style>
  .frame {
    height: calc(100vh - 6rem);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  img {
    height: 95%;
    width: 95%;
    object-fit: contain;
  }

  video {
    height: 95%;
    width: 95%;
    object-fit: contain;
  }
</style>