<script>
  import posts from "$lib/stores/posts.js";
  import { isImage, isVideo } from "$lib/helpers/type.js";
  import { guard } from "$lib/helpers/guard";
  export let data;

  let id = Number( data.bindings.post );
  const post = posts.find( post => post.id === id );
  
  id = Number( data.bindings.media ); 
  let media = post?.media[ id ];

  if ( media == null ) {
    media = {};
  }

  guard();
</script>

<div class="frame">
  {#if isImage( media ) }
    <img 
      src="{media.url}"
      alt="full size">
  {:else if isVideo( media ) }
    <!-- svelte-ignore a11y-media-has-caption -->
    <video loop controls>
      <source 
        src={media.url}
        type={media.type}>
    </video>
  {/if}
</div>

<style>
  .frame {
    height: 100vh;
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