<script>
  import { Media } from "$lib/engines/draft.js";

  export let attachment;
  export let identity;
  export let post;
  export let id;
  export let isSingle = false;

  const mediaFallback = "/images/gobo-media-fallback.png";

  const handleSingleLoad = function ( event ) {
    if ( isSingle !== true ) {
      return;
    }

    let previewWidth = event.target.width;
    let naturalWidth = event.target.naturalWidth || event.target.videoWidth;
    let naturalHeight = event.target.naturalHeight || event.target.videoHeight;
    let ratio = naturalHeight / naturalWidth;
    let previewHeight = Math.round( previewWidth * ratio );


    if ( previewHeight > 512 ) {
      event.target.style.height = "512px";
    } else {
      event.target.style.height = "unset";
    }    
  }
</script>

{#if Media.isImage( attachment )}
  <a href="{`/display/${ identity }/${ post }/${ id }`}">
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
    margin: 0;
    padding: 0;
    max-width: 36rem;
    display: flex;
    justify-content: center;
  }

  figure > img {
    object-fit: contain;
    border-radius: var(--gobo-border-radius);
    border: var(--gobo-border-panel);
  }

  figure > video {
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
    border-radius: var(--gobo-border-radius);
  }

  a, figure {
    height: 100%;
    width: 100%;
    border-radius: var(--gobo-border-radius);
  }

  figure > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: var(--gobo-border-radius);
  }

  figure > video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
    border-radius: var(--gobo-border-radius);
  }
</style>