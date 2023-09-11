<script>
  import { isImage, isVideo } from "$lib/helpers/type.js";
  import { render } from "$lib/helpers/markdown.js";

  export let attachments = [];

  const mediaFallback = "/images/gobo-media-fallback.png";

  // TODO: How would we want to approach multiple syndication embeds?
  let attachment = attachments[0];
  let title = attachment.title;
  let content = render( attachment.description );
  let sourceURL = attachment.source;
  let mediaURL = attachment.media;

  const domain = ( new URL(sourceURL) ).hostname;

  if ( !content ) {
    content = `<p>${sourceURL}</p>`;
  }

  const handleSingleLoad = function ( event ) {
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


<a 
  class="syndication-link"
  href="{sourceURL}"
  target="_blank" 
  rel="noopener noreferrer nofollow">
  
  <section class="syndication">
    {#if mediaURL}
      <div class="media">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img 
          src={mediaURL}
          onerror="this.onerror=null;this.src='{mediaFallback}'">
      </div>
    {/if}

    <section>
      <div class="spacer-wrap">
        <span>{domain}</span>

        {#if title}
          <h2>{title}</h2>
        {/if}

        {@html content}
      </div>
    </section>
  
  </section>
</a>


<style>

span {
  color: var(--gobo-color-text-muted);
}

.syndication-link {
  min-width: 100%;
  text-decoration: none;
}

.syndication {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  background: var(--gobo-color-panel);
  border: var(--gobo-border-panel);
  border-radius: var(--gobo-border-radius);
  margin-top: var(--gobo-height-spacer);
  box-sizing: border-box;
  cursor: var(--cursor);
  color: var(--gobo-color-text);
  overflow-y: hidden;
}

.syndication:focus-visible {
  outline: 2px solid var(--gobo-color-primary);
}

@supports not selector(:focus-visible) {
  .syndication:focus {
    outline: 2px solid var(--gobo-color-primary);
  }
}

.syndication .media img {
  width: 100%;
  height: 200px;
  border-radius: var(--gobo-border-radius) var(--gobo-border-radius) 0 0;
  object-fit: cover;
}

.syndication section {
  margin: 0.5rem;
  margin-bottom: 0.25rem;
}

.syndication section h2 {
  font-size: var(--gobo-font-size-large);
  font-weight: var(--gobo-font-weight-black);
}

.syndication section :global(p) {
  font-size: var(--gobo-font-size-detail);
  font-weight: var(--gobo-font-weight-regular);
}
</style>

