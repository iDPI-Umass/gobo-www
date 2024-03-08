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

<div class="frame">
  <BackLink heading="Preview"></BackLink>

  <img
    bind:this={previewImage}
    src="#"
    alt="preview of upload">
</div>

<style>
  .frame {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #333;
  }

  img {
    height: 90%;
    width: 95%;
    object-fit: contain;
  }
</style>