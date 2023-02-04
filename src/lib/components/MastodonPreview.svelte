<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { humanize } from "$lib/helpers/humanize";

  export let identities;
  export let content;
  export let options;
  export let files;

  let identity = identities.find( function ( i ) {
    return ( i.platform === "mastodon" ) && ( i.active === true );
  });

  let created = new Date();
  let name = identity.name;
  let address = identity.account;
  let displayedFiles = files.slice( 0, 4 );
</script>

<article class="outer-frame">
  <header>
    <div class="pfp"></div>
    <div class="id">
      <span>{name}</span>
      <span>{address}</span>
    </div>   
    <p class="timestamp">{ humanize( created ) }</p>
  </header>

  <section> {content} </section>

  {#if displayedFiles.length === 1}
    <div class="media">
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
    max-width: 32rem;
    border: 1px solid var(--sl-color-neutral-400);
    border-radius: 0;
    background: #fff;
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

  .outer-frame > section {
    font-size: 15px;
    font-family: var(--sl-font-family-sans);
    color: #000;
    margin-bottom: 16px;
  }

  .outer-frame > .media {
    width: 100%;
    height: 307px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 16px;
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


