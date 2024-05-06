<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Media } from "$lib/engines/draft.js"
  import { previewStore } from "$lib/stores/image-preview.js";

  let attachment, url;
  const Render = State.make();

  Render.cleanup = () => {
    attachment = null;
    Render.url( null );
  };

  Render.url = ( file ) => {
    if ( url != null ) {
      URL.revokeObjectURL( url );
    }
    if ( file == null ) {
      url = null;
    } else {
      url = URL.createObjectURL( file );
    }
  };

  Render.attachment = ( value ) => {
    attachment = value;
    Render.url( attachment.file );
  };

  Render.reset();
  onMount(() => {
    Render.listen( previewStore, Render.attachment );
    return () => {
      Render.reset();
    }
  });
</script>

<div class="outer">
  <BackLink heading="Preview"></BackLink>

  <div class="frame">
    {#if attachment}
      {#if Media.isImage(attachment.file)}
        <img
          src={url}
          alt="preview of upload"/>
      {:else if Media.isAudio(attachment.file)}
        <audio
          src={url}
          controls>
        </audio>
      {:else if Media.isVideo(attachment.file)}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video controls>
          <source src={url} type={attachment.file.type} />
        </video>
      {/if}
    {/if}
  </div>
</div>

<style>
  .outer {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    background: #333;
    padding: 1rem;
  }

  .frame {
    flex: 1 1 100%;
    min-height: 0;
    width: 100%;
    padding-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: 50% 50%;
  }

  video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: 50% 50%;
  }
</style>