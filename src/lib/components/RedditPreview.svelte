<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { draft } from "$lib/stores/post-draft.js";

  let draftData, unsubscribeDraft;
  let identity = {};
  let options = {};
  let content;
  let displayedFiles = [];

  const setIdentities = function () {
    for ( const key in draftData.identities ) {
      const value = draftData.identities[ key ];
      if (( value.platform === "reddit" ) && ( value.active === true )) {
        identity = value;
        return;
      }
    }
  };

  const setOptions = function () {
    options = draftData.options;
  };

  const setContent = function () {
    content = draftData.content;
  };

  const setFiles = function () {
    displayedFiles = draftData.files.slice( 0, 20 );
  };
 
  if ( browser ) {
    onMount( function () {
      unsubscribeDraft = draft.subscribe( function ( draft ) {
        draftData = draft;
        setIdentities();
        setOptions();
        setContent();
        setFiles();
      });
    });;

    onDestroy( function () {
      unsubscribeDraft();
    });
  }

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
      <span class="subreddit">{options.subreddit}</span>
      <span class="interpunct">·</span>
      <span class="account">Posted by {identity.account}</span>
      <span class="timestamp">just now</span>
    </header>

    <h2 class="title">
      {options.title}
    </h2>
  
    {#if displayedFiles.length === 0}
      {#if options.sensitive === true}
        <div class="text-sensitive">
          <div>CLICK TO SEE NSFW</div>
        </div>
      {:else}
        <section>
          {@html content}
        </section>
      {/if}

    {:else}

      <div class="media">

        {#if options.sensitive === true}
          <div class="media-sensitive">
            <div>CLICK TO SEE NSFW</div>
          </div>
        {/if}

        {#each displayedFiles as file (file.name)}
          <div class="image-box">
            <img 
              src={URL.createObjectURL( file )}
              alt="uploaded">
          </div>
        {/each}
      </div>
  
    {/if}
  
    <footer>
      <sl-icon
        src="/icons/chat.svg">
      </sl-icon>
      <span>0 Comments</span>
  
      <sl-icon
        src="/icons/gift.svg">
      </sl-icon>
      <span>Award</span>
  
      <sl-icon
        src="/icons/arrow-90deg-right.svg">
      </sl-icon>
      <span>Share</span>
  
      <sl-icon
        src="/icons/bookmark.svg">
      </sl-icon>
      <span>Save</span>
  
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
    margin-bottom: 2rem;
    padding: 0;
    max-width: 640px;
    border: 1px solid var(--sl-color-neutral-400);
    border-radius: 0;
    background: #fff;
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
    max-height: 512px;
    overflow-y: hidden;
  }

  .outer-frame > .main > .media {
    position: relative;
    margin: 10px 0 0 0;
    height: 512px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
  }

  .outer-frame > .main > .media > .media-sensitive {
    position: absolute;
    height: 512px;
    width: 100%;
    backdrop-filter: blur(40px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .outer-frame > .main > .media > .media-sensitive > div {
    font-size: 14px;
    padding: 10px 20px;
    border: 1px solid #000;
    background: #fff;
    color: #000;
  }

  .outer-frame > .main > .media > .image-box {
    flex: 1 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    scroll-snap-align: center;
  }

  .outer-frame > .main > .media > .image-box > img {
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

</style>


