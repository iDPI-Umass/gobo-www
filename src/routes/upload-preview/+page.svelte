<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { previewStore } from "$lib/stores/image-preview.js";

  let previewImage;
  const Render = State.make();

  Render.attachment = ( attachment ) => {
    if ( attachment.file.name != null ) {
      if ( previewImage.src !== "#" ) {
        URL.revokeObjectURL( previewImage.src );
      }
      previewImage.src = URL.createObjectURL( attachment.file );
    }
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
    <img
      bind:this={previewImage}
      src="#"
      alt="preview of upload">
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
</style>