<script>
  import { isImage, isVideo } from "$lib/helpers/type.js";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { getPost } from "$lib/resources/post.js";
  
  export let data;
  
  let post, media;

  const loadMedia = async function () {
    post = await getPost( data.bindings.post );
    media = post?.attachments[ Number(data.bindings.media) ];
    if ( media == null ) {
      media = {};
    }
  };

</script>

<GuardFrame>
  {#await loadMedia()}
    <Spinner></Spinner>
  {:then}

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

  {/await}
</GuardFrame>

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