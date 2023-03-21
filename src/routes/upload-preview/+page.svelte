<script>
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { previewStore } from "$lib/stores/image-preview.js";
  import GuardFrame from "$lib/components/GuardFrame.svelte";

  let previewImage, unsubscribePreview;

  if ( browser ) {
    onMount( function() {
      unsubscribePreview = previewStore.subscribe( function ( file ) {
        if ( file.name != null ) {
          if ( previewImage.src !== "#" ) {
            URL.revokeObjectURL( previewImage.src );
          }
          previewImage.src = URL.createObjectURL( file );
        }
      });
    });

    onDestroy( function () {
      unsubscribePreview();
    });
  }

</script>

<div class="frame">
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
    height: 95%;
    width: 95%;
    object-fit: contain;
  }
</style>