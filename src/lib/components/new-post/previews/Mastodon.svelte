<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import LinkPreview from "$lib/components/new-post/previews/LinkPreview.svelte";
  import { onMount } from "svelte";
  import { Source } from "$lib/engines/post";
  import { State, Identity, Media } from "$lib/engines/draft.js";
  import { Mastodon } from "$lib/engines/platforms/mastodon.js";
  import * as markdown from "$lib/helpers/markdown.js";

  export let rawContent

  let identity, options, content, avatar;
  let displayedFiles, sensitiveOverride, spoilerOverride;
  const Render = State.make();
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  Render.cleanup = () => {
    identity = {};
    options = {};
    content = null;
    displayedFiles = [];
    sensitiveOverride = false;
    spoilerOverride = false;
  };

  Render.identity = ( draft ) => {
    identity = Identity.findActive( "mastodon" ) ?? {};
    avatar = identity.profile_image ?? Source.fallback( identity );
  };

  Render.options = ( draft ) => {
    options = {
      ...draft.options.mastodon,
      ...draft.options.attachments
    };
  };

  Render.content = ( raw ) => {
    if ( raw.content == null || raw.content == "" ) {
      content = null;
      return;
    }

    const html = markdown.toHTML( raw.content );

    const dom = parser.parseFromString( `<div>${ html }</div>`, "text/html" );    
    const links = dom.querySelectorAll( "a" );
    for ( const link of links ) {
      link.text = Mastodon.urlGlamor( link.text );
    }
    
    content = serializer.serializeToString( dom.querySelector( "div" ));
  };

  Render.attachments = ( draft ) => {
    displayedFiles = draft.attachments
      .slice( 0, 4 );
  };



  const Handle = {};
  
  Handle.sensitive = () => {
    sensitiveOverride = !sensitiveOverride;
  };

  Handle.spoiler = () => {
    spoilerOverride = !spoilerOverride;
  }



  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.identity );
    Render.listen( "options", Render.options );
    Render.listen( "attachments", Render.attachments );
    return () => {
      Render.reset();
    }
  });

  $: Render.content( rawContent );
</script>

<article class="outer-frame">
  <header>
    <div class="pfp">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src={avatar}>
    </div>
    <div class="id">
      <span>{identity.name}</span>
      <span>{identity.prettyName}</span>
    </div>   
    <p class="timestamp">1 s</p>
  </header>

  {#if options.spoilerText != null && spoilerOverride !== true }
    <div class="spoiler">
      <p>
        {options.spoilerText}
        <span on:click={Handle.spoiler}>SHOW MORE</span>
      </p>
    </div>
  
  {:else}
    {#if options.spoilerText != null && spoilerOverride === true }
      <div class="spoiler">
        <p>
          {options.spoilerText}
          <span on:click={Handle.spoiler}>SHOW LESS</span>
        </p>
      </div>
    {/if}

    <section>
      {#if content != null}
        {@html content}
      {/if}
    </section>
  

    {#if displayedFiles.length === 0}
      <LinkPreview height="300px"></LinkPreview>

    {:else if displayedFiles.length === 1}
      <div class="media">
        {#if (options.sensitive === true) && ( sensitiveOverride === true )}
          <div 
            class="media-hide"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
          </div>
        {/if}
        {#if (options.sensitive === true) && ( sensitiveOverride === false )}
          <div 
            class="media-sensitive"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <div>
              Sensitive content
            </div>
          </div>
        {/if}

        <div class="left">
          <div class="image-box">
            {#if Media.isImage( displayedFiles[0] )}
              <img 
                src={displayedFiles[0].url}
                alt={displayedFiles[0].alt}>
            {:else if Media.isAudio( displayedFiles[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <audio controls>
                <source 
                  src={displayedFiles[0].url}
                  type={displayedFiles[0].type}>
              </audio>
            {:else if Media.isVideo( displayedFiles[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={displayedFiles[0].url}
                  type={displayedFiles[0].type}>
              </video>
            {/if}
          </div>
        </div>
      </div>
    {:else if displayedFiles.length === 2}
      <div class="media">
        {#if (options.sensitive === true) && ( sensitiveOverride === true )}
          <div 
            class="media-hide"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
          </div>
        {/if}
        {#if (options.sensitive === true) && ( sensitiveOverride === false )}
          <div 
            class="media-sensitive"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <div>
              Sensitive content
            </div>
          </div>
        {/if}

        <div class="left">
          <div class="image-box">
            {#if Media.isImage( displayedFiles[0] )}
              <img 
                src={displayedFiles[0].url}
                alt={displayedFiles[0].alt}>
            {:else if Media.isVideo( displayedFiles[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={displayedFiles[0].url}
                  type={displayedFiles[0].type}>
              </video>
            {/if}
          </div>
        </div>

        <div class="right">
          <div class="image-box">
            {#if Media.isImage( displayedFiles[1] )}
              <img 
                src={displayedFiles[1].url}
                alt={displayedFiles[1].alt}>
            {:else if Media.isVideo( displayedFiles[1] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={displayedFiles[1].url}
                  type={displayedFiles[1].type}>
              </video>
            {/if}
          </div>
        </div>
      </div>
    {:else if displayedFiles.length === 3}
      <div class="media">
        {#if (options.sensitive === true) && ( sensitiveOverride === true )}
          <div 
            class="media-hide"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
          </div>
        {/if}
        {#if (options.sensitive === true) && ( sensitiveOverride === false )}
          <div 
            class="media-sensitive"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <div>
              Sensitive content
            </div>
          </div>
        {/if}

        <div class="left">
          <div class="image-box">
            {#if Media.isImage( displayedFiles[0] )}
              <img 
                src={displayedFiles[0].url}
                alt={displayedFiles[0].alt}>
            {:else if Media.isVideo( displayedFiles[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={displayedFiles[0].url}
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
                  src={displayedFiles[1].url}
                  alt={displayedFiles[1].alt}>
              {:else if Media.isVideo( displayedFiles[1] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={displayedFiles[1].url}
                    type={displayedFiles[1].type}>
                </video>
              {/if}
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[2] )}
                <img 
                  src={displayedFiles[2].url}
                  alt={displayedFiles[2].alt}>
              {:else if Media.isVideo( displayedFiles[2] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={displayedFiles[2].url}
                    type={displayedFiles[2].type}>
                </video>
              {/if}
            </div>
          </div>
        </div>
      </div>

    {:else if displayedFiles.length === 4}
      <div class="media">
        {#if (options.sensitive === true) && ( sensitiveOverride === true )}
          <div 
            class="media-hide"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
          </div>
        {/if}
        {#if (options.sensitive === true) && ( sensitiveOverride === false )}
          <div 
            class="media-sensitive"
            on:click={Handle.sensitive}
            on:keydown={Handle.sensitive}
            tabindex="0"
            role="button">
            <div>
              Sensitive content
            </div>
          </div>
        {/if}

        <div class="left">
          <div class="top">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[0] )}
                <img 
                  src={displayedFiles[0].url}
                  alt={displayedFiles[0].alt}>
              {:else if Media.isVideo( displayedFiles[0] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={displayedFiles[0].url}
                    type={displayedFiles[0].type}>
                </video>
              {/if}
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[2] )}
                <img 
                  src={displayedFiles[2].url}
                  alt={displayedFiles[2].alt}>
              {:else if Media.isVideo( displayedFiles[2] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={displayedFiles[2].url}
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
                  src={displayedFiles[1].url}
                  alt={displayedFiles[1].alt}>
              {:else if Media.isVideo( displayedFiles[1] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={displayedFiles[1].url}
                    type={displayedFiles[1].type}>
                </video>
              {/if}
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              {#if Media.isImage( displayedFiles[3] )}
                <img 
                  src={displayedFiles[3].url}
                  alt={displayedFiles[3].alt}>
              {:else if Media.isVideo( displayedFiles[3] )}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video loop controls>
                  <source 
                    src={displayedFiles[3].url}
                    type={displayedFiles[3].type}>
                </video>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}
  {/if}

  <footer>
    <sl-icon
      src="/icons/reply-fill.svg">
    </sl-icon>

    <sl-icon
      src="/icons/repeat.svg">
    </sl-icon>

    <sl-icon
      src="/icons/star-fill.svg">
    </sl-icon>

    <sl-icon
      src="/icons/bookmark-fill.svg">
    </sl-icon>

    <sl-icon
      src="/icons/three-dots.svg">
    </sl-icon>
  </footer>
</article>

<style>
  .outer-frame {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    padding: 1rem;
    max-width: 580px;
    background: #fff;
    border: 1px solid var(--sl-color-neutral-400);
    border-top: none;
    border-bottom: none;
  }

  .outer-frame:first-child {
    border-top-left-radius: var(--sl-border-radius-medium);
    border-top-right-radius: var(--sl-border-radius-medium);
    border-top: 1px solid var(--sl-color-neutral-400);
  }

  .outer-frame:last-child {
    border-bottom-left-radius: var(--sl-border-radius-medium);
    border-bottom-right-radius: var(--sl-border-radius-medium);
    border-bottom: 1px solid var(--sl-color-neutral-400);
  }

  .outer-frame > header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 10px;
  }

  .outer-frame > header > .pfp {
    height: 46px;
    width: 46px;
    border-radius: 0.25rem;
    margin-right: 10px;
    overflow: hidden;
  }

  .outer-frame header .pfp img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .outer-frame > header > .id {
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
  }

  .outer-frame > header > .id > span:first-child {
    font-size: 15px;
    font-weight: var(--sl-font-weight-bold);
    color: #000;
  }

  .outer-frame > header > .id > span:last-child {
    font-size: 15px;
    color: #4B5D44;
  }

  .outer-frame > header > .timestamp {
    font-size: 15px;
    min-width: max-content;
    color: #4B5D44;
  }

  .outer-frame > .spoiler {
    margin-bottom: 16px;
  }

  .outer-frame > .spoiler > p {
    font-size: 15px;
    font-family: var(--sl-font-family-sans);
    color: #000;
    margin: 0;
  }

  .outer-frame > .spoiler > p > span {
    display: inline-flex;
    height: 20px;
    width: max-content;
    flex-direction: column;
    justify-content: center;
    font-size: 11px;
    font-weight: var(--sl-font-weight-bold);
    background: #d9e1e8;
    color: #000;
    padding: 0 6px;
    cursor: pointer;
  }

  .outer-frame > section {
    font-size: 15px;
    font-family: var(--sl-font-family-sans);
    color: #000;
    margin-bottom: 16px;
    min-height: 1.5rem;
  }

  .outer-frame > section :global(a) {
    color: var(--gobo-color-preview-link);
  }

  .outer-frame > .media {
    position: relative;
    width: 100%;
    height: 308px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 16px;
    border-radius: 12px;
  }

  .outer-frame > .media > .media-hide {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 27px;
    height: 27px;
    backdrop-filter: blur(40px);
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
  }

  .outer-frame > .media > .media-hide > sl-icon {
    font-size: 14px;
    font-weight: var(--sl-font-weight-bold);
    color: #000;
  }

  .outer-frame > .media > .media-sensitive {
    position: absolute;
    width: 100%;
    height: 308px;
    backdrop-filter: blur(40px);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .outer-frame > .media > .media-sensitive > div {
    font-size: 14px;
    font-weight: var(--sl-font-weight-bold);
    color: #000;
    background: rgba(255, 255, 255, 0.5);
    padding: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
  }

  

  .outer-frame > .media > .left {
    flex: 1;
    margin-right: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .outer-frame > .media > .right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .outer-frame > .media .top {
    height: 152px;
    margin-bottom: 4px;
  }
    
  .outer-frame > .media .bottom {
    height: 152px;
  }

  .outer-frame > .media .image-box {
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .outer-frame > .media .image-box > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: 4px;
  }

  .outer-frame > .media .image-box > video {
    width: 100%;
    object-fit: contain;
    object-position: center center;
    border-radius: 4px;
  }

  .outer-frame > .media > .left > .image-box > video,
  .outer-frame > .media > .right > .image-box > video {
    height: 308px;
  }

  .outer-frame > .media > .left > .top .image-box > video,
  .outer-frame > .media > .left > .bottom .image-box > video,
  .outer-frame > .media > .right > .top .image-box > video,
  .outer-frame > .media > .right > .bottom .image-box > video {
    height: 152px;
  }

  .outer-frame > footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .outer-frame > footer > sl-icon {
    font-size: 18px;
    color: #606984;
  }

</style>


