<script>
  import { isImage, isVideo } from "$lib/helpers/type.js";

  export let identity;
  export let id;
  export let attachments = [];

  const mediaFallback = "/images/gobo-media-fallback.png";

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


  {#if attachments.length === 1}
    <a href="{`/display/${ identity }/${ id }/0`}">
      <figure>
        {#if isImage( attachments[0] )}
          <img 
            src={attachments[0].url}
            alt="uploaded"
            on:load={handleSingleLoad}
            onerror="this.onerror=null;this.src='{mediaFallback}'">
        {:else if isVideo( attachments[0] )}
          <!-- svelte-ignore a11y-media-has-caption -->
          <video 
            loop 
            controls
            on:loadedmetadata={handleSingleLoad}>
            <source 
              src={attachments[0].url}
              type={attachments[0].type}>
            <img src={mediaFallback} alt="video failed to load" />
          </video>
      {/if}
      </figure>
    </a>    

  {:else if attachments.length === 2}
    <div class="media">
      <div class="left">
        <a href="{`/display/${ identity }/${ id }/0`}">
          <figure>
            {#if isImage( attachments[0] )}
              <img 
                src={attachments[0].url}
                alt="uploaded"
                onerror="this.onerror=null;this.src='{mediaFallback}'">
            {:else if isVideo( attachments[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={attachments[0].url}
                  type={attachments[0].type}
                  on:load={attachments}>
                <img src={mediaFallback} alt="video failed to load" />
              </video>
            {/if}
          </figure>
        </a>
      </div>

      <div class="right">
        <a href="{`/display/${ identity }/${ id }/1`}">
          <figure>
            {#if isImage( attachments[1] )}
              <img 
                src={attachments[1].url}
                alt="uploaded"
                onerror="this.onerror=null;this.src='{mediaFallback}'">
            {:else if isVideo( attachments[1] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={attachments[1].url}
                  type={attachments[1].type}
                  on:load={attachments}>
                  <img src={mediaFallback} alt="video failed to load" />
              </video>
            {/if}
          </figure>
        </a>
      </div>
    </div>

  {:else if attachments.length === 3}
    <div class="media">
      <div class="left">
        <a href="{`/display/${ identity }/${ id }/0`}">
          <figure>
            {#if isImage( attachments[0] )}
              <img 
                src={attachments[0].url}
                alt="uploaded"
                onerror="this.onerror=null;this.src='{mediaFallback}'">
            {:else if isVideo( attachments[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={attachments[0].url}
                  type={attachments[0].type}
                  on:load={attachments}>
                <img src={mediaFallback} alt="video failed to load" />
              </video>
            {/if}
          </figure>
        </a>
      </div>

      <div class="right">
        <div class="top">
          <a href="{`/display/${ identity }/${ id }/1`}">
            <figure>
              {#if isImage( attachments[1] )}
                <img 
                  src={attachments[1].url}
                  alt="uploaded"
                  onerror="this.onerror=null;this.src='{mediaFallback}'">
              {:else if isVideo( attachments[1] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={attachments[1].url}
                    type={attachments[1].type}
                    on:load={attachments}>
                  <img src={mediaFallback} alt="video failed to load" />
                </video>
              {/if}
            </figure>
          </a>
        </div>

        <div class="bottom">
          <a href="{`/display/${ identity }/${ id }/2`}">
            <figure>
              {#if isImage( attachments[2] )}
                <img 
                  src={attachments[2].url}
                  alt="uploaded"
                  onerror="this.onerror=null;this.src='{mediaFallback}'">
              {:else if isVideo( attachments[2] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={attachments[2].url}
                    type={attachments[2].type}
                    on:load={attachments}>
                  <img src={mediaFallback} alt="video failed to load" />
                </video>
              {/if}
            </figure>
          </a>
        </div>
      </div>
    </div>

  {:else if attachments.length === 4}
    <div class="media">
      <div class="left">
        <div class="top">
          <a href="{`/display/${ identity }/${ id }/0`}">
            <figure>
              {#if isImage( attachments[0] )}
                <img 
                  src={attachments[0].url}
                  alt="uploaded"
                  onerror="this.onerror=null;this.src='{mediaFallback}'">
              {:else if isVideo( attachments[0] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={attachments[0].url}
                    type={attachments[0].type}
                    on:load={attachments}>
                  <img src={mediaFallback} alt="video failed to load" />
                </video>
              {/if}
            </figure>
          </a>
        </div>

        <div class="bottom">
          <a href="{`/display/${ identity }/${ id }/2`}">
            <figure>
              {#if isImage( attachments[2] )}
                <img 
                  src={attachments[2].url}
                  alt="uploaded"
                  onerror="this.onerror=null;this.src='{mediaFallback}'">
              {:else if isVideo( attachments[2] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={attachments[2].url}
                    type={attachments[2].type}
                    on:load={attachments}>
                  <img src={mediaFallback} alt="video failed to load" />
                </video>
              {/if}
            </figure>
          </a>
        </div>
      </div>

      <div class="right">
        <div class="top">
          <a href="{`/display/${ identity }/${ id }/1`}">
            <figure>
              {#if isImage( attachments[1] )}
                <img 
                  src={attachments[1].url}
                  alt="uploaded"
                  onerror="this.onerror=null;this.src='{mediaFallback}'">
              {:else if isVideo( attachments[1] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={attachments[1].url}
                    type={attachments[1].type}
                    on:load={attachments}>
                  <img src={mediaFallback} alt="video failed to load" />
                </video>
              {/if}
            </figure>
          </a>
        </div>

        <div class="bottom">
          <a href="{`/display/${ identity }/${ id }/3`}">
            <figure>
              {#if isImage( attachments[3] )}
                <img 
                  src={attachments[3].url}
                  alt="uploaded"
                  onerror="this.onerror=null;this.src='{mediaFallback}'">
              {:else if isVideo( attachments[3] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={attachments[3].url}
                    type={attachments[3].type}
                    on:load={attachments}>
                  <img src={mediaFallback} alt="video failed to load" />
                </video>
              {/if}
            </figure>
          </a>
        </div>
      </div>
    </div>
  
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

  .media {
    /* Must be an even number */
    --gap: 10px;
    position: relative;
    height: min( 40vw, 284px );
    max-width: 36rem;
    border-radius: var(--gobo-border-radius);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  .media > .left,
  .media > .right {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  .media > .left {
    margin-right: var(--gap);
  }

  .media > .left > .top,
  .media > .left > .bottom,
  .media > .right > .top,
  .media > .right > .bottom {
    height: calc( ( 0.5 * min( 40vw, 284px ) ) - calc( 0.5 * var(--gap) ) );
    border-radius: var(--gobo-border-radius);
  }

  .media > .left > .top,
  .media > .right > .top {
    margin-bottom: var(--gap);
  }

  .media a,
  .media figure {
    height: 100%;
    width: 100%;
    border-radius: var(--gobo-border-radius);
  }

  .media figure > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: var(--gobo-border-radius);
  }

  .media figure > video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
    border-radius: var(--gobo-border-radius);
  }

</style>


