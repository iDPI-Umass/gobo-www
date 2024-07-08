<script>
  import { goto } from "$app/navigation";
  import { Media } from "$lib/engines/draft.js";
  import { previewStore } from "$lib/stores/image-preview.js";

  export let attachment;

  const Handle = {};

  Handle.preview = ( attachment ) => {
    return ( event ) => {
      event.preventDefault();
      previewStore.set( attachment );
      goto( "/upload-preview" );
    }
  };

  const mediaFallback = "/images/gobo-media-fallback.png";

  const handleSingleLoad = function ( event ) {
    let previewWidth = event.target.width;
    let naturalWidth = event.target.naturalWidth || event.target.videoWidth;
    let naturalHeight = event.target.naturalHeight || event.target.videoHeight;
    let ratio = naturalHeight / naturalWidth;
    let previewHeight = Math.round( previewWidth * ratio );


    if ( previewHeight > 64 ) {
      event.target.style.height = "64px";
    } else {
      event.target.style.height = "unset";
    }    
  }
</script>

{#if Media.isImage( attachment )}
  <a
    href="/upload-preview"
    on:click={Handle.preview( attachment )}
    on:keydown={Handle.preview( attachment )}>
    <figure>
      <img 
        src={attachment.url}
        alt="uploaded"
        on:load={handleSingleLoad}
        onerror="this.onerror=null;this.src='{mediaFallback}'">
    </figure>
  </a>
{:else if Media.isAudio( attachment )}
  <figure>
    <audio  
      controls
      preload="metadata">
      <source 
        src={attachment.url}
        type={attachment.type}/>
      <img src={mediaFallback} alt="audio failed to load" />
    </audio>
  </figure>
{:else if Media.isVideo( attachment )}
  <figure>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video 
      loop
      controls
      preload="metadata"
      on:loadedmetadata={handleSingleLoad}>
      <source 
        src={attachment.url}
        type={attachment.type}>
      <img src={mediaFallback} alt="video failed to load" />
    </video>
  </figure>
{/if}

<style>
  figure {
    flex: 1 1 25%;
    margin: 0;
    padding: 0;
    max-width: 10rem;
    display: flex;
    justify-content: center;
  }

  figure > img {
    object-fit: contain;
    border-radius: 0.25rem;
    border: var(--gobo-border-panel);
  }

  figure > video {
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
    border-radius: 0.25rem;
  }

  a, figure {
    border-radius: 0.25rem;
  }

  figure > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: 0.25rem;
  }

  figure > video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
    border-radius: 0.25rem;
  }
</style>