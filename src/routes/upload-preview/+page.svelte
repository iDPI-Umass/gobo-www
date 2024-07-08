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
  };

  Render.attachment = ( value ) => {
    attachment = value;
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
  <BackLink heading="Preview" styles={{color: "#fff"}}></BackLink>

  <div class="frame">
    {#if attachment}
      {#if Media.isImage(attachment)}
        <img
          src={attachment.url}
          alt={attachment.alt ?? undefined}/>
      {:else if Media.isAudio(attachment)}
        <audio
          controls
          preload="metadata">
          <source 
            src={attachment.url}
            type={attachment.type} />
        </audio>
      {:else if Media.isVideo(attachment)}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video
          controls
          preload="metadata">
          <source
            src={attachment.url}
            type={attachment.type} />
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