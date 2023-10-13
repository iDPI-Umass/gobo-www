<script>
  import { isImage, isVideo } from "$lib/helpers/type.js";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { getPost } from "$lib/resources/post.js";
  
  export let data;
  let { identity, post: id, media: mediaID } = data.bindings;
  
  let post, media;

  const loadMedia = async function () {
    post = await getPost({ identity, id });
    let attachments = post.attachments.filter( a => /^(image|video)\//.test(a.type) );
    media = attachments[ Number(mediaID) ];
    if ( media == null ) {
      media = {};
    }
  };

</script>

<GuardFrame>

  <BackLink heading="Media"></BackLink>

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
  header {
    height: 4rem;
    padding: 1rem 1rem 0 1rem;
  }

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