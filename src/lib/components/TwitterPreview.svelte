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
  let singleHeight = 512;

  const setIdentities = function () {
    for ( const key in draftData.identities ) {
      const value = draftData.identities[ key ];
      if (( value.platform === "twitter" ) && ( value.active === true )) {
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
    displayedFiles = draftData.files.slice( 0, 4 );

  };

  const handleSingleLoad = function ( event ) {
    let previewWidth = event.target.width;
    let naturalWidth = event.target.naturalWidth;
    let naturalHeight = event.target.naturalHeight;
    let ratio = naturalHeight / naturalWidth;
    let previewHeight = previewWidth * ratio;


    if ( previewHeight > 512 ) {
      event.target.style.height = "512px";
    } else {
      event.target.style.height = "unset";
    }
  }
 
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
    <div class="pfp"></div>
  </div>
  
  
  <div class="main">
    <header>
      <span class="name">{identity.name}</span>
      <span class="account">{identity.account}</span>
      <span class="interpunct">·</span>
      <span class="timestamp">1s</span>
      <div class="spacer"></div>
      <sl-icon
        src="/icons/three-dots.svg">
      </sl-icon>
    </header>


    <section> {@html content} </section>

    {#if displayedFiles.length === 1}
      <div class="media-single">
        {#if options.sensitive === true}
          <div class="media-sensitive">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
            <p>Content warning: Sensitive content</p>
            <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
            <div><span>Show</span></div>
          </div>
        {/if}

        <div class="image-box">
          <img 
            src={URL.createObjectURL( displayedFiles[0] )}
            alt="uploaded"
            on:load={handleSingleLoad}>
        </div>
      </div>
    {:else if displayedFiles.length === 2}
      <div class="media">
        {#if options.sensitive === true}
          <div class="media-sensitive">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
            <p>Content warning: Sensitive content</p>
            <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
            <div><span>Show</span></div>
          </div>
        {/if}

        <div class="left">
          <div class="image-box">
            <img 
              src={URL.createObjectURL( displayedFiles[0] )}
              alt="uploaded">
          </div>
        </div>
  
        <div class="right">
          <div class="image-box">
            <img 
              src={URL.createObjectURL( displayedFiles[1] )}
              alt="uploaded">
          </div>
        </div>
      </div>
    {:else if displayedFiles.length === 3}
      <div class="media">
        {#if options.sensitive === true}
          <div class="media-sensitive">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
            <p>Content warning: Sensitive content</p>
            <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
            <div><span>Show</span></div>
          </div>
        {/if}

        <div class="left">
          <div class="image-box">
            <img 
              src={URL.createObjectURL( displayedFiles[0] )}
              alt="uploaded">
          </div>
        </div>
  
        <div class="right">
          <div class="top">
            <div class="image-box">
              <img 
                src={URL.createObjectURL( displayedFiles[1] )}
                alt="uploaded">
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              <img 
                src={URL.createObjectURL( displayedFiles[2] )}
                alt="uploaded">
            </div>
          </div>
        </div>
      </div>
  
    {:else if displayedFiles.length === 4}
      <div class="media">
        {#if options.sensitive === true}
          <div class="media-sensitive">
            <sl-icon src="/icons/eye-slash.svg"></sl-icon>
            <p>Content warning: Sensitive content</p>
            <p>The Tweet author flagged this Tweet as showing sensitive content.</p>
            <div><span>Show</span></div>
          </div>
        {/if}

        <div class="left">
          <div class="top">
            <div class="image-box">
              <img 
                src={URL.createObjectURL( displayedFiles[0] )}
                alt="uploaded">
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              <img 
                src={URL.createObjectURL( displayedFiles[2] )}
                alt="uploaded">
            </div>
          </div>
        </div>
  
        <div class="right">
          <div class="top">
            <div class="image-box">
              <img 
                src={URL.createObjectURL( displayedFiles[1] )}
                alt="uploaded">
            </div>
          </div>
          <div class="bottom">
            <div class="image-box">
              <img 
                src={URL.createObjectURL( displayedFiles[3] )}
                alt="uploaded">
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
        src="/icons/arrow-repeat.svg">
      </sl-icon>
  
      <sl-icon
        src="/icons/heart.svg">
      </sl-icon>
  
      <sl-icon
        src="/icons/bar-chart.svg">
      </sl-icon>
  
      <sl-icon
        src="/icons/upload.svg">
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
    padding: 12px 16px 0 16px;
    max-width: 566px;
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
    margin-right: 12px;
  }

  .outer-frame > .gutter > .pfp {
    height: 48px;
    width: 48px;
    border-radius: 48px;
    background: var(--sl-color-neutral-400);
  }

  .outer-frame > .main {
    flex: 1;
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

  .outer-frame > .main > header > sl-icon {
    font-size: 15px;
    color: #536471;
  }




  .outer-frame > .main > section {
    font-family: var(--sl-font-family-sans);
    font-size: 14px;
    color: #0f1419;
    margin-bottom: 12px;
  }

  .outer-frame > .main > .media-single {
    position: relative;
    max-width: 100%;
    margin-bottom: 12px;
    border-radius: 12px;
  }

  .outer-frame > .main > .media-single > .image-box {
    width: 100%;
    height: 100%;
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
  }

  .outer-frame > .main .media-sensitive > div > span {
    font-size: 16px;
    color: #fff;
  }

  .outer-frame > .main > .media {
    position: relative;
    height: 286px;
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
  }

  .outer-frame > .main > .media > .left > .image-box > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .image-box {
    height: 100%;
    width: 100%;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .image-box > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .outer-frame > .main > .media > .left > .top {
    height: 142px;
    border-top-left-radius: 12px;
    margin-bottom: 2px;
  }

  .outer-frame > .main > .media > .left > .bottom {
    height: 142px;
    border-bottom-left-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .top {
    height: 142px;
    border-top-right-radius: 12px;
    margin-bottom: 2px;
  }

  .outer-frame > .main > .media > .right > .bottom {
    height: 142px;
    border-bottom-right-radius: 12px;
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

  .outer-frame > .main > .media > .left > .top > .image-box > img {
    border-top-left-radius: 12px;
  }

  .outer-frame > .main > .media > .left > .bottom > .image-box > img {
    border-bottom-left-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .top > .image-box > img {
    border-top-right-radius: 12px;
  }

  .outer-frame > .main > .media > .right > .bottom > .image-box > img {
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


