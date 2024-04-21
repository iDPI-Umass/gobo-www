<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import LinkPreview from "$lib/components/new-post/previews/LinkPreview.svelte";
  import { onMount } from "svelte";
  import { State, Identity, Media, Bluesky } from "$lib/engines/draft.js";
  import * as markdown from "$lib/helpers/markdown.js";

  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  let identity, options, content;
  let displayedFiles, sensitiveOverride;
  const Render = State.make();
  Render.cleanup = () => {
    identity = {};
    options = {};
    content = null;
    displayedFiles = [];
    sensitiveOverride = false;
  };

  Render.identity = ( draft ) => {
    identity = Identity.findActive( "bluesky" ) ?? {};
  };

  Render.options = ( draft ) => {
    options = draft.options;
  };

  Render.content = ( draft ) => {
    if ( draft.content == null || draft.content == "" ) {
      content = null;
      return;
    }

    const html = markdown.render( draft.content );

    const dom = parser.parseFromString( `<div>${ html }</div>`, "text/html" );    
    const links = dom.querySelectorAll( "a" );
    for ( const link of links ) {
      link.text = Bluesky.urlGlamor( link.text );
    }
    
    content = serializer.serializeToString( dom.querySelector( "div" ));
  };

  Render.attachments = ( draft ) => {
    displayedFiles = draft.attachments
      .slice( 0, 4 )
      .map( attachment => attachment.file );
  };



  const Handle = {};
  Handle.singleImage = ( event ) => {
    const previewWidth = event.target.width;
    const naturalWidth = event.target.naturalWidth || event.target.videoWidth;
    const naturalHeight = event.target.naturalHeight || event.target.videoHeight;
    const ratio = naturalHeight / naturalWidth;
    const previewHeight = Math.round( previewWidth * ratio );

    if ( previewHeight > 512 ) {
      event.target.style.height = "512px";
    } else {
      event.target.style.height = "unset";
    }    
  }

  Handle.sensitive = () => {
    sensitiveOverride = !sensitiveOverride;
  };
 


  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.identity );
    Render.listen( "options", Render.options );
    Render.listen( "content", Render.content );
    Render.listen( "attachments", Render.attachments );
    return () => {
      Render.reset();
    }
  });
</script>

<article class="outer-frame">
  
  <div class="gutter">
    <div class="pfp"></div>
  </div>
  
  
  <div class="main">
    <header>
      <span class="name">{identity.name}</span>
      <span class="account">{identity.prettyName}</span>
      <span class="interpunct">·</span>
      <span class="timestamp">1s</span>
      <div class="spacer"></div>
    </header>


    <section>
      {#if content != null}
        {@html content}
      {/if}
    </section>

    {#if displayedFiles.length === 0}
      <LinkPreview height="200px"></LinkPreview>

    {:else if displayedFiles.length === 1}
      <div class="media-single">
        <div class="image-box">
          {#if (options.sensitive === true) && (sensitiveOverride === true)}
            <div class="media-hide">
              <div
                on:click={Handle.sensitive}
                on:keydown={Handle.sensitive}
                tabindex="0"
                role="button">
                <span>Hide</span>
              </div>
            </div>
          {/if}

          {#if (options.sensitive === true) && (sensitiveOverride === false)}
            <div class="media-sensitive">
              <sl-icon src="/icons/eye-slash.svg"></sl-icon>
              <p>Content warning: Sensitive content</p>
              <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
              <div
                on:click={Handle.sensitive}
                on:keydown={Handle.sensitive}
                tabindex="0"
                role="button">
                <span>Show</span>
              </div>
            </div>
          {/if}

          {#if Media.isImage( displayedFiles[0] )}
            <img 
              src={URL.createObjectURL( displayedFiles[0] )}
              alt="uploaded"
              on:load={Handle.singleImage}>
          {:else if Media.isVideo( displayedFiles[0] )}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video 
              loop 
              controls
              on:loadedmetadata={Handle.singleImage}>
              <source 
                src={URL.createObjectURL( displayedFiles[0] )}
                type={displayedFiles[0].type}>
            </video>
          {/if}

        </div>
      </div>
    {:else if displayedFiles.length === 2}
      <div class="media">
        {#if (options.sensitive === true) && (sensitiveOverride === true)}
          <div class="media-hide">
            <div
              on:click={Handle.sensitive}
              on:keydown={Handle.sensitive}
              tabindex="0"
              role="button">
              <span>Hide</span>
            </div>
          </div>
        {/if}

        {#if (options.sensitive === true) && (sensitiveOverride === false)}
          <div class="media-sensitive">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
            <p>Content warning: Sensitive content</p>
            <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
            <div
              on:click={Handle.sensitive}
              on:keydown={Handle.sensitive}
              tabindex="0"
              role="button">
              <span>Show</span>
            </div>
          </div>
        {/if}

        <div class="left">
          <div class="image-box">
            {#if Media.isImage( displayedFiles[0] )}
              <img 
                src={URL.createObjectURL( displayedFiles[0] )}
                alt="uploaded">
            {:else if Media.isVideo( displayedFiles[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={URL.createObjectURL( displayedFiles[0] )}
                  type={displayedFiles[0].type}>
              </video>
            {/if}
          </div>
        </div>
  
        <div class="right">
          <div class="image-box">
            {#if Media.isImage( displayedFiles[1] )}
              <img 
                src={URL.createObjectURL( displayedFiles[1] )}
                alt="uploaded">
            {:else if Media.isVideo( displayedFiles[1] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={URL.createObjectURL( displayedFiles[1] )}
                  type={displayedFiles[1].type}>
              </video>
            {/if}
          </div>
        </div>
      </div>
    {:else if displayedFiles.length === 3}
      <div class="media">
        {#if (options.sensitive === true) && (sensitiveOverride === true)}
          <div class="media-hide">
            <div
              on:click={Handle.sensitive}
              on:keydown={Handle.sensitive}
              tabindex="0"
              role="button">
              <span>Hide</span>
            </div>
          </div>
        {/if}

        {#if (options.sensitive === true) && (sensitiveOverride === false)}
          <div class="media-sensitive">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
            <p>Content warning: Sensitive content</p>
            <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
            <div
              on:click={Handle.sensitive}
              on:keydown={Handle.sensitive}
              tabindex="0"
              role="button">
              <span>Show</span>
            </div>
          </div>
        {/if}

        <div class="left">
          <div class="image-box">
            {#if Media.isImage( displayedFiles[0] )}
              <img 
                src={URL.createObjectURL( displayedFiles[0] )}
                alt="uploaded">
            {:else if Media.isVideo( displayedFiles[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={URL.createObjectURL( displayedFiles[0] )}
                  type={displayedFiles[0].type}>
              </video>
            {/if}
          </div>
        </div>
  
        <div class="right">
          <div class="top">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[1] )}
                <img 
                  src={URL.createObjectURL( displayedFiles[1] )}
                  alt="uploaded">
              {:else if Media.isVideo( displayedFiles[1] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={URL.createObjectURL( displayedFiles[1] )}
                    type={displayedFiles[1].type}>
                </video>
              {/if}
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[2] )}
                <img 
                  src={URL.createObjectURL( displayedFiles[2] )}
                  alt="uploaded">
              {:else if Media.isVideo( displayedFiles[2] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={URL.createObjectURL( displayedFiles[2] )}
                    type={displayedFiles[2].type}>
                </video>
              {/if}
            </div>
          </div>
        </div>
      </div>
  
    {:else if displayedFiles.length === 4}
      <div class="media">
        {#if (options.sensitive === true) && (sensitiveOverride === true)}
          <div class="media-hide">
            <div
              on:click={Handle.sensitive}
              on:keydown={Handle.sensitive}
              tabindex="0"
              role="button">
              <span>Hide</span>
            </div>
          </div>
        {/if}

        {#if (options.sensitive === true) && (sensitiveOverride === false)}
          <div class="media-sensitive">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
            <p>Content warning: Sensitive content</p>
            <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
            <div
              on:click={Handle.sensitive}
              on:keydown={Handle.sensitive}
              tabindex="0"
              role="button">
              <span>Show</span>
            </div>
          </div>
        {/if}

        <div class="left">
          <div class="top">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[0] )}
                <img 
                  src={URL.createObjectURL( displayedFiles[0] )}
                  alt="uploaded">
              {:else if Media.isVideo( displayedFiles[0] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={URL.createObjectURL( displayedFiles[0] )}
                    type={displayedFiles[0].type}>
                </video>
              {/if}
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[2] )}
                <img 
                  src={URL.createObjectURL( displayedFiles[2] )}
                  alt="uploaded">
              {:else if Media.isVideo( displayedFiles[2] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={URL.createObjectURL( displayedFiles[2] )}
                    type={displayedFiles[2].type}>
                </video>
              {/if}
            </div>
          </div>
        </div>
  
        <div class="right">
          <div class="top">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[1] )}
                <img 
                  src={URL.createObjectURL( displayedFiles[1] )}
                  alt="uploaded">
              {:else if Media.isVideo( displayedFiles[1] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={URL.createObjectURL( displayedFiles[1] )}
                    type={displayedFiles[1].type}>
                </video>
              {/if}
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[3] )}
                <img 
                  src={URL.createObjectURL( displayedFiles[3] )}
                  alt="uploaded">
              {:else if Media.isVideo( displayedFiles[3] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={URL.createObjectURL( displayedFiles[3] )}
                    type={displayedFiles[3].type}>
                </video>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}
  
    <footer>
      <sl-icon
        src="/icons/chat.svg">
      </sl-icon>

      <sl-icon
        src="/icons/repeat.svg">
      </sl-icon>
  
      <sl-icon
        src="/icons/heart.svg">
      </sl-icon>
  
      <sl-icon
        src="/icons/three-dots.svg">
      </sl-icon>
    </footer>
  </div>
  
</article>

<style>
  .outer-frame {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 2rem;
    padding: 12px 16px 0 16px;
    max-width: 566px;
    background: #fff;
    border: 1px solid var(--sl-color-neutral-400);
    border-radius: var(--sl-border-radius-medium);
  }

  .outer-frame > .gutter {
    flex: 0 0 48px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-right: 12px;
  }

  .outer-frame > .gutter > .pfp {
    height: 48px;
    width: 48px;
    border-radius: 48px;
    background: var(--sl-color-neutral-400);
  }

  .outer-frame > .main {
    flex: 1 1 0;
    min-width: 0;
    margin-bottom: 12px;
  }

  .outer-frame > .main > header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 4px;
  }

  .outer-frame > .main > header > span {
    margin-right: 4px;
    font-family: Arial, sans-serif;
  }

  .outer-frame > .main > header > .name {
    font-size: 15px;
    font-weight: var(--sl-font-weight-bold);
    color: #000;
  }

  .outer-frame > .main > header > .interpunct {
    font-size: 15px;
    font-weight: var(--sl-font-weight-bold);
    color: #536471;
  }

  .outer-frame > .main > header > .account {
    font-size: 15px;
    color: #536471;
  }

  .outer-frame > .main > header > .timestamp {
    font-size: 15px;
    min-width: max-content;
    color: #536471;
  }

  .outer-frame > .main > header > .spacer {
    flex: 1 1 auto;
  }

  .outer-frame > .main :global(a) {
    color: var(--gobo-color-preview-link);
  }


  .outer-frame > .main > section {
    font-family: var(--sl-font-family-sans);
    font-size: 14px;
    color: #0f1419;
    margin-bottom: 12px;
    min-height: 1.5rem;
  }

  .outer-frame > .main > .media-single {
    position: relative;
    max-width: 100%;
    margin-bottom: 12px;
    border-radius: 12px;
  }

  .outer-frame > .main > .media-single > .image-box {
    position: relative;
    max-width: 100%;
    height: max-content;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 12px;
  }

  .outer-frame > .main > .media-single > .image-box > img {
    object-fit: contain;
    object-position: top left;
    border-radius: 12px;
    border: 1px solid #cfd9de;
  }

  .outer-frame > .main > .media-single > .image-box > video {
    object-fit: contain;
    object-position: top left;
    border-radius: 12px;
    border: 1px solid #cfd9de;
  }

  .outer-frame > .main .media-sensitive {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(40px);
    background-color: rgba( 0, 0, 0, 0.5 );
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 16px 28px;
    border-radius: 12px;
  }

  .outer-frame > .main .media-sensitive > sl-icon {
    align-self: center;
    font-size: 22px;
    color: #fff;
    margin-bottom: 12px;
  }

  .outer-frame > .main .media-sensitive > p {
    font-size: 15px;
    color: #fff;
    margin-bottom: 12px;
  }

  .outer-frame > .main .media-sensitive > p:first-of-type {
    font-weight: var(--sl-font-weight-bold);
  }

  .outer-frame > .main .media-sensitive > div {
    align-self: flex-end;
    background: rgba( 255, 255, 255, 0.25 );
    backdrop-filter: blur(4px);
    height: 32px;
    padding: 0 16px;
    border-radius: 9999px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  .outer-frame > .main .media-sensitive div > span {
    color: #fff;
    font-size: 14px;
    font-weight: var(--sl-font-weight-bold);
  }

  .outer-frame > .main .media-hide {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba( 0, 0, 0, 0.5 );
    backdrop-filter: blur(4px);
    height: 32px;
    padding: 0 16px;
    border-radius: 9999px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  .outer-frame > .main .media-hide > div {
    color: #fff;
    font-size: 14px;
    font-weight: var(--sl-font-weight-bold);
  }

  .outer-frame > .main > .media {
    position: relative;
    height: 286px;
    width: 100%;
    border-radius: 12px;
    border: 1px solid #cfd9de;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }


  .outer-frame > .main > .media > .left {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    margin-right: 2px;
  }

  .outer-frame > .main > .media > .right {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .outer-frame > .main > .media > .left > .image-box {
    height: 100%;
    width: 100%;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    background: #000;
  }

  .outer-frame > .main > .media > .left > .image-box > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  .outer-frame > .main > .media > .left > .image-box > video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center center;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .image-box {
    height: 100%;
    width: 100%;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    background: #000;
  }

  .outer-frame > .main > .media > .right > .image-box > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .image-box > video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center center;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .outer-frame > .main > .media > .left > .top {
    height: 141px;
    border-top-left-radius: 12px;
    margin-bottom: 2px;
  }

  .outer-frame > .main > .media > .left > .bottom {
    height: 141px;
    border-bottom-left-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .top {
    height: 141px;
    border-top-right-radius: 12px;
    margin-bottom: 2px;
  }

  .outer-frame > .main > .media > .right > .bottom {
    height: 141px;
    border-bottom-right-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .top video,
  .outer-frame > .main > .media > .right > .bottom video,
  .outer-frame > .main > .media > .left > .top video,
  .outer-frame > .main > .media > .left > .bottom video {
    height: 141px;
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
  }

  .outer-frame > .main > .media .image-box {
    height: 100%;
    width: 100%;
  }

  .outer-frame > .main > .media .image-box > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .outer-frame > .main > .media > .left > .top > .image-box > img,
  .outer-frame > .main > .media > .left > .top > .image-box > video {
    border-top-left-radius: 12px;
  }

  .outer-frame > .main > .media > .left > .bottom > .image-box > img,
  .outer-frame > .main > .media > .left > .bottom > .image-box > video {
    border-bottom-left-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .top > .image-box > img,
  .outer-frame > .main > .media > .right > .top > .image-box > video {
    border-top-right-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .bottom > .image-box > img,
  .outer-frame > .main > .media > .right > .bottom > .image-box > video {
    border-bottom-right-radius: 12px;
  }



  .outer-frame > .main > footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    max-width: 425px;
    margin-top: 12px;
  }

  .outer-frame > .main > footer > sl-icon {
    font-size: 15px;
    color: #536471;
    stroke-width: 2px;
  }

</style>


