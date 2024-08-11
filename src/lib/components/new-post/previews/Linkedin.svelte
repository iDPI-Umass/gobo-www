<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import LinkPreview from "$lib/components/new-post/previews/LinkedinLinkPreview.svelte";
  import { onMount } from "svelte";
  import { Source } from "$lib/engines/post";
  import { State, Identity, Media } from "$lib/engines/draft.js";
  import { Linkedin } from "$lib/engines/platforms/linkedin.js";
  import { Mentions } from "$lib/engines/mention/index.js";
  import { getConverter } from "$lib/helpers/markdown.js";

  export let threadItem;

  const toHTML = getConverter( "linkedin" )
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  let identity, options, content, attachments, avatar;
  let displayFiles;
  const Render = State.make();
  Render.cleanup = () => {
    identity = {};
    options = {};
    content = null;
    attachments = [];
    displayFiles = [];
  };

  Render.identity = ( draft ) => {
    identity = Identity.findActive( "linkedin" ) ?? {};
    avatar = identity.profile_image ?? Source.fallback( identity );
  };

  Render.options = ( draft ) => {
    options = draft.options.linkedin;
  };

  Render.attachments = ( draft ) => {
    attachments = draft.attachments;
    Item.attachments( threadItem );
  }

  Render.item = ( raw ) => {
    Item.content( raw );
    Item.attachments( raw );
  };



  const Item = {};

  Item.content = ( raw ) => {
    if ( raw.content == null || raw.content == "" ) {
      content = null;
      return;
    }

    let html = toHTML( raw.content );
    html = Mentions.renderHTML( raw, html );

    const dom = parser.parseFromString( `<div>${ html }</div>`, "text/html" );    
    const links = dom.querySelectorAll( "a" );
    
    // From: https://www.linkedin.com/help/linkedin/answer/a521889/short-urls-in-shared-posts
    // If you're sharing an article and there’s no text after the link,
    // the URL will be hidden from the share.
    if ( links[0] != null && links[0]?.parentElement?.nextElementSibling == null ) {
      links[0].remove();
    } else {  
      for ( const link of links ) {
        if ( link.dataset.skipGlamor !== "true") {
          link.text = Linkedin.urlGlamor( link.text );
        }        
      }
    }
    
    content = serializer.serializeToString( dom.querySelector( "div" ));
  };

  Item.attachments = ( raw ) => {
    const ids = raw.attachments ?? [];
    const files = []
    for ( const id of ids ) {
      const match = attachments.find( file => file.id === id );
      if ( match ) {
        files.push( match );
      }
    }

    displayFiles = files.slice( 0, 4 );
  };



  const Handle = {};
  Handle.singleImage = ( event ) => {
    const previewWidth = event.target.width;
    const naturalWidth = event.target.naturalWidth;
    const naturalHeight = event.target.naturalHeight;
    const ratio = naturalHeight / naturalWidth;
    const previewHeight = Math.round( previewWidth * ratio );

    if ( previewHeight > 512 ) {
      event.target.style.height = "512px";
    } else {
      event.target.style.height = "unset";
    }    
  };

  Handle.singleVideo = ( event ) => {
    if ( event.target.videoWidth > 512 ) {
      event.target.style.height = "512px";
    } else {
      event.target.style.height = "unset";
    }  
  };
 


  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.identity );
    Render.listen( "options", Render.options );
    Render.listen( "attachments", Render.attachments );
    return () => {
      Render.reset();
    }
  });

  $: Render.item( threadItem );
</script>

<article class="outer-frame">
    
  <header>
    <div class="pfp">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src={avatar}>
    </div>
    <div class="rows">
      <div class="row">
        <span class="name">{identity.prettyName}</span>
        <span class="interpunct">·</span>
        <span class="pointer">You</span>
      </div>
      <div class="row">
        <span class="timestamp">now</span>
        <span class="interpunct">·</span>
        {#if options.visibility == "public"}
          <sl-icon class="visibility" src="/icons/globe-americas.svg"></sl-icon>
        {:else if options.visibility == "mutuals"}
          <sl-icon class="visibility" src="/icons/people-fill.svg"></sl-icon>
        {/if}
      </div>
    </div>
    <div class="spacer"></div>
    <sl-icon src="icons/three-dots.svg"></sl-icon>  
  </header>


  <section>
    {#if content != null}
      {@html content}
    {/if}
  </section>

  {#if displayFiles.length === 1}
    <div class="media-single">
      {#if Media.isImage( displayFiles[0] )}
        <img 
          src={displayFiles[0].url}
          alt="uploaded"
          on:load={Handle.singleImage}>
      {:else if Media.isAudio( displayFiles[0] )}
        <!-- svelte-ignore a11y-media-has-caption -->
        <audio controls>
          <source 
            src={displayFiles[0].url}
            type={displayFiles[0].type}>
        </audio>
      {:else if Media.isVideo( displayFiles[0] )}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video 
          loop 
          controls
          on:loadedmetadata={Handle.singleVideo}>
          <source 
            src={displayFiles[0].url}
            type={displayFiles[0].type}>
        </video>
      {/if}
    </div>
  
  {:else if displayFiles.length > 1}
    <div class="media">
      {#each displayFiles as file, index (file.name)}
        <div class="image-box">
          <img 
            src={displayFiles[index].url}
            alt="uploaded" />
        </div>
      {/each}
    </div>
  {/if}
  

  {#if displayFiles.length === 0}
    <LinkPreview previewURL={threadItem.previewURL} />
  {/if}

  <footer>
    <div>
      <sl-icon
        src="/icons/hand-thumbs-up.svg">
      </sl-icon>
      <span>Like</span>
    </div>

    <div>
      <sl-icon
        src="/icons/chat.svg">
      </sl-icon>
      <span>Comment</span>
    </div>

    <div>
      <sl-icon
        src="/icons/repeat.svg">
      </sl-icon>
      <span>Repost</span>
    </div>

    <div>
      <sl-icon
        src="/icons/send-fill.svg">
      </sl-icon>
      <span>Send</span>
    </div>
  </footer>

  
</article>

<style>
  .outer-frame {
    display: flex;
    flex-direction: column;
    max-width: 566px;
    background: #fff;
    border: 1px solid var(--sl-color-neutral-400);
    border-radius: var(--sl-border-radius-medium);
  }

  .outer-frame > header {
    display: flex;
    margin-bottom: 4px;
    padding: 12px 16px 0 16px;
  }

  .outer-frame header .pfp {
    height: 48px;
    width: 48px;
    border-radius: 48px;
    margin-right: 0.5rem;
    overflow: hidden;
  }

  .outer-frame header img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .outer-frame > header .rows {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: start;
    align-items: start;
    margin-bottom: 4px;
  }

  .outer-frame > header > .spacer {
    flex: 1 1 auto;
  }

  .outer-frame > header > sl-icon {
    color: #000;
  }

  .outer-frame > header .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
    align-items: center;
    margin-bottom: 0;
  }

  .outer-frame > header span {
    margin-right: 4px;
    font-family: Arial, sans-serif;
  }

  .outer-frame > header .name {
    font-size: 14px;
    font-weight: var(--sl-font-weight-bold);
    color: #000;
  }

  .outer-frame > header .interpunct {
    font-size: 14px;
    font-weight: var(--sl-font-weight-bold);
    color: rgba(0, 0, 0, 0.6);
  }

  .outer-frame > header .pointer {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
  }

  .outer-frame > header .timestamp {
    font-size: 12px;
    min-width: max-content;
    color: rgba(0, 0, 0, 0.6);
  }

  .outer-frame > header .visibility {
    font-size: 15px;
    color: rgba(0, 0, 0, 0.6);
  }

  .outer-frame :global(a) {
    color: var(--gobo-color-preview-link);
  }


  .outer-frame > section {
    font-family: var(--sl-font-family-sans);
    font-size: 14px;
    color: #0f1419;
    margin-bottom: 12px;
    min-height: 1.5rem;
    padding: 0 1rem;
  }

  .outer-frame > .media-single {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
  }

  .outer-frame > .media-single > img {
    object-fit: contain;
    object-position: center center;
  }

  .outer-frame > .media-single > video {
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background-color: black;
  }

  .outer-frame > .media {
    position: relative;
    display: flex;
    gap: 1px;
    width: 100%;
    max-height: 512px;
  }

  .outer-frame > .media > .image-box {
    flex: 1 1 auto;
    min-width: 0;
  }

  .outer-frame > .media > .image-box > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }



  .outer-frame footer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    color: #536471;
    margin: 0 1rem;
    padding: 1rem 0;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }

  .outer-frame > footer div {
    display: flex;
    align-items: center;
  }

  .outer-frame > footer sl-icon {
    font-size: 20px;
    stroke-width: 2px;
    margin-right: 0.25rem;
  }

  .outer-frame > footer span {
    font-size: 15px;
  }

</style>


