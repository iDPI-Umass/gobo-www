<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { State, Identity, Media } from "$lib/engines/draft.js";
  import { getConverter } from "$lib/helpers/markdown.js";

  export let threadItem;

  const toHTML = getConverter( "reddit" )

  let identity, options, subreddit, content, attachments;
  let displayedFiles, mediaFrame, mediaFrameChildren;
  let spoilerOverride;
  const Render = State.make();

  Render.cleanup = () => {
    identity = {};
    options = {};
    subreddit = "";
    content = null;
    attachments = [];
    displayedFiles = [];
    spoilerOverride = false;
    mediaFrameChildren = {};
  };


  Render.identity = ( draft ) => {
    identity = Identity.findActive( "reddit" ) ?? {};
  };

  Render.options = ( draft ) => {
    options = {
      ...draft.options.reddit,
      ...draft.options.attachments
    };

    let value = options.subreddit;
    if ( value != null && !value.startsWith( "r/" )) {
      subreddit = "r/" + value;
    } else {
      subreddit = value;
    }
  };

  Render.attachments = ( draft ) => {
    attachments = draft.attachments;
    Item.attachments( mediaFrame, threadItem );
  }

  Render.item = ( mediaFrame, raw ) => {
    Item.content( raw );
    Item.attachments( mediaFrame, raw );
  };



  const Item = {};

  Item.content = ( raw ) => {    
    let html = toHTML( raw.content );
    for ( const mention of Object.values(raw.mentions ?? {})) {
      if ( mention.type === "handle" ) {
        const target = `<a data-skip-glamor="true" href="#">${ mention.value }</a>`;
        html = html.replaceAll( mention.name, target );
      } else {
        html = html.replaceAll( mention.name, mention.value );
      }
    }
    content = html;
  };

  Item.attachments = ( mediaFrame, raw ) => {    
    let files = [];
    const ids = raw.attachments.slice( 0, 20 );
    for ( const id of ids ) {
      const match = attachments.find( file => file.id === id );
      if ( match ) {
        files.push( match );
      }
    }

    let videoFile = files.find( f => Media.isVideo( f ) );
    if ( videoFile != null ) {
      displayedFiles = [ videoFile ];
    } else {
      displayedFiles = files;
    }

    if ( !mediaFrame ) {
      return;
    }

    for ( const file of displayedFiles ) {
      const frame = mediaFrameChildren[ file.name ];
      let previewWidth = frame.width;
      let naturalWidth = frame.naturalWidth;
      let naturalHeight = frame.naturalHeight;
      let ratio = naturalHeight / naturalWidth;
      let previewHeight = Math.round( previewWidth * ratio );

      if ( previewHeight > 512 ) {
        mediaFrame.style.height = "512px";
        return;
      }
    }

    mediaFrame.style.height = "unset";
  };

  
  
  
  const Handle = {};
  Handle.singleImage = ( event ) => {
    let previewWidth = event.target.width;
    let naturalWidth = event.target.naturalWidth;
    let naturalHeight = event.target.naturalHeight;
    let ratio = naturalHeight / naturalWidth;
    let previewHeight = previewWidth * ratio;

    if ( previewHeight > 512 ) {
      mediaFrame.style.height = "512px";
    } else {
      mediaFrame.style.height = "unset";
    }
  };

  Handle.spoiler = () => {
    spoilerOverride = !spoilerOverride;
  };
 


  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.identity );
    Render.listen( "options", Render.options );
    Render.listen( "attachments", Render.attachments );
    return () => {
      Render.reset();
    };
  });

  $: Render.item( mediaFrame, threadItem );
</script>

<article class="outer-frame">
  
  <div class="gutter">
    <sl-icon
      src="/icons/caret-up.svg">
    </sl-icon>
    <span>Vote</span>
    <sl-icon
      src="/icons/caret-down.svg">
    </sl-icon>
  </div>
  
  
  <div class="main">
    <header>
      <div class="pfp"></div>
      {#if subreddit != null}
        <span class="subreddit">{subreddit}</span>
      {/if}
      <span class="interpunct">·</span>
      <span class="account">Posted by {identity.prettyName}</span>
      <span class="timestamp">just now</span>
    </header>

    {#if options.title != null}
      <h2 class="title">
        {options.title}
      </h2>
    {/if}
  
    {#if displayedFiles.length === 0}
      {#if options.spoiler === true && spoilerOverride !== true}
        <div class="text-sensitive">
          <div
            on:click={Handle.spoiler}>
            CLICK TO SEE SPOILER
          </div>
        </div>
      {:else}
        <section on:click={Handle.spoiler}>
          {#if content != null}
            {@html content}
          {/if}
        </section>
      {/if}

    {:else}

      <div
        bind:this={mediaFrame}
        class="media {options.sensitive === true ? "frozen" : ""}">

        {#if options.sensitive === true}
          <div class="media-sensitive">
          </div>
        {/if}

        {#each displayedFiles as file (file.name)}
          <div class="image-box">
            {#if Media.isImage( file )}
              <img
                bind:this={mediaFrameChildren[ file.name ]}
                src={file.url}
                alt="uploaded"
                on:load={Handle.singleImage}>
            {/if}
            {#if Media.isVideo( file )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video 
                loop 
                controls
                bind:this={mediaFrameChildren[ file.name ]}>
                <source 
                src={file.url}
                type={file.type}>
              </video>
            {/if}
          </div>
        {/each}
      </div>
  
    {/if}
  
    <footer>

      <sl-icon 
        class="vote"
        src="/icons/caret-up.svg">
      </sl-icon>
      <span class="vote">0</span>
      <sl-icon
        class="vote down"
        src="/icons/caret-down.svg">
      </sl-icon>

      <sl-icon
        src="/icons/chat.svg">
      </sl-icon>
      <span>0 Comments</span>
  
      <sl-icon class="desktop"
        src="/icons/gift.svg">
      </sl-icon>
      <span class="desktop">Award</span>
  
      <sl-icon class="desktop"
        src="/icons/arrow-90deg-right.svg">
      </sl-icon>
      <span class="desktop">Share</span>
  
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
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    padding: 0;
    max-width: 640px;
    background: #fff;
    border: 1px solid var(--sl-color-neutral-400);
    border-radius: var(--sl-border-radius-medium);
  }

  .outer-frame > .gutter {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 40px;
    padding: 8px 4px 8px 4px;
    background: #eee;
    border-top-left-radius: var(--sl-border-radius-medium);
    border-bottom-left-radius: var(--sl-border-radius-medium);
  }

  .outer-frame > .gutter > sl-icon {
    color: #878a8c;
    font-size: 20px;
  }

  .outer-frame > .gutter > span {
    color: #000;
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: var(--sl-font-weight-bold);
    margin: 8px 0 8px 0;
  }

  .outer-frame > .main {
    flex: 1;
  }



  .outer-frame > .main > header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin: 8px 0 0 8px;
    margin-bottom: 10px;
  }

  .outer-frame > .main > header > .pfp {
    height: 20px;
    width: 20px;
    border-radius: 20px;
    background: var(--sl-color-neutral-400);
    margin-right: 10px;
  }

  .outer-frame > .main > header > span {
    margin-right: 4px;
    font-family: Arial, sans-serif;
  }

  .outer-frame > .main > header > .subreddit {
    font-size: 12px;
    font-weight: var(--sl-font-weight-bold);
    color: #000;
  }

  .outer-frame > .main > header > .interpunct {
    font-size: 12px;
    font-weight: var(--sl-font-weight-bold);
    color: #4B5D44;
  }

  .outer-frame > .main > header > .account {
    font-size: 12px;
    color: #4B5D44;
  }

  .outer-frame > .main > header > .timestamp {
    font-size: 12px;
    min-width: max-content;
    color: #4B5D44;
  }



  .outer-frame > .main > .title {
    font-size: 20px;
    color: #000;
    margin-left: 8px;
  }

  .outer-frame > .main > .text-sensitive {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 10px 8px 10px 8px;
  }

  .outer-frame > .main > .text-sensitive > div {
    font-size: 14px;
    padding: 10px 20px;
    border: 1px solid #000;
    color: #000
  }

  .outer-frame > .main > section {
    font-family: var(--sl-font-family-sans);
    font-size: 14px;
    color: #000;
    margin-bottom: 16px;
    padding: 10px 8px 10px 8px;
    min-height: 1.5rem;
    max-height: 512px;
    overflow-y: hidden;
  }

  .outer-frame > .main > section :global(a) {
    color: var(--gobo-color-preview-link);
  }

  .outer-frame > .main > section :global(blockquote) {
    margin-top: var(--gobo-height-spacer-half);
    margin-bottom: var(--gobo-height-spacer-half);
    margin-left: var(--gobo-width-spacer-half);
    padding-left: var(--gobo-width-spacer-half);
    border-left: 3px solid #ccc;
  }

  .outer-frame > .main > .media {
    position: relative;
    margin: 10px 0 0 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
  }

  .outer-frame > .main > .media.frozen {
    overflow-x: hidden;
  }

  .outer-frame > .main > .media > .media-sensitive {
    position: absolute;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(40px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .outer-frame > .main > .media > .image-box {
    flex: 1 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    scroll-snap-align: center;
    background: #000;
  }

  .outer-frame > .main > .media > .image-box > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .outer-frame > .main > .media > .image-box > video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .outer-frame > .main > footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: left;
    align-items: center;
    height: 40px;
    padding-left: 12px;
  }

  .outer-frame > .main > footer > sl-icon {
    font-size: 18px;
    color: #606984;
    margin-right: 6px;
  }

  .outer-frame > .main > footer > span {
    font-family: Arial;
    font-size: 12px;
    font-weight: var(--sl-font-weight-bold);
    color: #606984;
    margin-right: 20px;
    padding-top: 4px;
  }

  .vote {
    display: none;
  }

  .outer-frame > .main > footer > span.vote {
    margin-right: 6px;
  }

  .outer-frame > .main > footer > sl-icon.vote.down {
    margin-top: 2px;
    margin-right: 20px;
    margin-left: -1px;
  }

  @media ( max-width: 680px ) {
    .outer-frame > .gutter {
      display: none;
    }

    .desktop {
      display: none;
    }

    .vote {
      display: unset;
    }
  }

</style>


