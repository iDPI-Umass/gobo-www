<script>
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { previewStore } from "$lib/stores/image-preview.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";

  let previewImage, unsubscribePreview;

  if ( browser ) {
    onMount( function() {
      unsubscribePreview = previewStore.subscribe( function ( attachment ) {
        if ( attachment.file.name != null ) {
          if ( previewImage.src !== "#" ) {
            URL.revokeObjectURL( previewImage.src );
          }
          previewImage.src = URL.createObjectURL( attachment.file );
        }
      });
    });

    onDestroy( function () {
      unsubscribePreview();
    });
  }

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

  header {
    width: 95%;
  }

  img {
    height: 90%;
    width: 95%;
    object-fit: contain;
  }
</style>