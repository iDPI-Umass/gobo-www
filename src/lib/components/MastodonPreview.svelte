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
      if (( value.platform === "mastodon" ) && ( value.active === true )) {
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
  <header>
    <div class="pfp"></div>
    <div class="id">
      <span>{identity.name}</span>
      <span>{identity.account}</span>
    </div>   
    <p class="timestamp">1 s</p>
  </header>

  {#if options.spoilerText != null }
    <div class="spoiler">
      <p>
        {options.spoilerText}
        <span>SHOW MORE</span>
      </p>
    </div>
  {:else}
    <section> {@html content} </section>
  

    {#if displayedFiles.length === 1}
      <div class="media">
        {#if options.sensitive === true}
          <div class="media-sensitive">
            <div>Sensitive content</div>
          </div>
        {/if}
        <div class="left">
          <div class="image-box">
            <img 
              src={URL.createObjectURL( displayedFiles[0] )}
              alt="uploaded">
          </div>
        </div>
      </div>
    {:else if displayedFiles.length === 2}
      <div class="media">
        {#if options.sensitive === true}
          <div class="media-sensitive">
            <div>Sensitive content</div>
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
            <div>Sensitive content</div>
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
            <div>Sensitive content</div>
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
  {/if}

  <footer>
    <sl-icon
      src="/icons/reply-fill.svg">
    </sl-icon>

    <sl-icon
      src="/icons/arrow-repeat.svg">
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
    margin-bottom: 2rem;
    padding: 1rem;
    max-width: 580px;
    background: #fff;
    border: 1px solid var(--sl-color-neutral-400);
    border-radius: var(--sl-border-radius-medium);
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
    background: var(--sl-color-neutral-400);
    margin-right: 10px;
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
  }

  .outer-frame > section {
    font-size: 15px;
    font-family: var(--sl-font-family-sans);
    color: #000;
    margin-bottom: 16px;
  }

  .outer-frame > .media {
    position: relative;
    width: 100%;
    height: 307px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 16px;
    border-radius: 12px;
  }

  .outer-frame > .media > .media-sensitive {
    position: absolute;
    width: 100%;
    height: 307px;
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
    height: calc(50% - 2px);
    margin-bottom: 4px;
  }
    
  .outer-frame > .media .bottom {
    height: calc(50% - 2px);
  }

  .outer-frame > .media .image-box {
    width: 100%;
    height: 100%;
  }

  .outer-frame > .media .image-box > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: 4px;
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


