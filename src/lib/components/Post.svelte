<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { humanize } from "$lib/helpers/humanize";
  import { isImage, isVideo } from "$lib/helpers/type.js";

  export let id;
  export let type;
  export let platform;
  export let url;
  export let author;
  export let authorURL;
  export let created;
  export let heading = null;
  export let content;
  export let media = [];
  export let results = [];
  export let total = 0;
  export let fullPage = false;

  let colors = {
    mastodon: "#6364FF",
    reddit: "#ff4500",
    twitter: "#1d9bf0"
  };

  let logo, brandColor;

  if ( platform != null ) {
    logo = `/icons/${ platform }.svg`;
  } else {
    logo = "/icons/circle.svg";
  }

  if ( colors[ platform ] != null ) {
    brandColor = colors[ platform ];
  } else {
    brandColor = "var(--sl-color-netural=1000)";
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

<article
  class="outer-frame"
  style="--brand-color:{ brandColor };"
  >
  <header>
    <div class="id">
      <sl-icon src="{logo}"></sl-icon>
      <a
        href="{authorURL}"
        target="_blank" 
        rel="noopener noreferrer nofollow">
        {author}
      </a>
    </div>   
    <p class="timestamp">{ humanize( created ) }</p>
  </header>
  
  <sl-divider></sl-divider>

  <section class="content" style={fullPage === true ? "max-height:unset" : ""}>
    <a href={`home/article/${id}`}>
      {#if heading != null}
        <h2>{heading}</h2>
      {/if}

      {@html content}
    </a>
  </section>


  {#if media.length === 1}
    <a class="media-single" href="{`/display/${id}/0`}">
      {#if isImage( media[0] )}
        <img 
          src={media[0].url}
          alt="uploaded"
          on:load={handleSingleLoad}>
      {:else if isVideo( media[0] )}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video 
          loop 
          controls
          on:loadedmetadata={handleSingleLoad}>
          <source 
            src={media[0].url}
            type={media[0].type}>
        </video>
      {/if}
    </a>

  {:else if media.length === 2}
    <div class="media">
      <div class="left">
        <a class="media-single" href="{`/display/${id}/0`}">
          {#if isImage( media[0] )}
            <img 
              src={media[0].url}
              alt="uploaded">
          {:else if isVideo( media[0] )}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video loop controls>
              <source 
                src={media[0].url}
                type={media[0].type}
                on:load={media}>
            </video>
          {/if}
        </a>
      </div>

      <div class="right">
        <a class="media-single" href="{`/display/${id}/1`}">
          {#if isImage( media[1] )}
            <img 
              src={media[1].url}
              alt="uploaded">
          {:else if isVideo( media[1] )}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video loop controls>
              <source 
                src={media[1].url}
                type={media[1].type}
                on:load={media}>
            </video>
          {/if}
        </a>
      </div>
    </div>

  {:else if media.length === 3}
    <div class="media">
      <div class="left">
        <a class="media-single" href="{`/display/${id}/0`}">
          {#if isImage( media[0] )}
            <img 
              src={media[0].url}
              alt="uploaded">
          {:else if isVideo( media[0] )}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video loop controls>
              <source 
                src={media[0].url}
                type={media[0].type}
                on:load={media}>
            </video>
          {/if}
        </a>
      </div>

      <div class="right">
        <div class="top">
          <a class="media-single" href="{`/display/${id}/1`}">
            {#if isImage( media[1] )}
              <img 
                src={media[1].url}
                alt="uploaded">
            {:else if isVideo( media[1] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={media[1].url}
                  type={media[1].type}
                  on:load={media}>
              </video>
            {/if}
          </a>
        </div>

        <div class="bottom">
          <a class="media-single" href="{`/display/${id}/2`}">
            {#if isImage( media[2] )}
              <img 
                src={media[2].url}
                alt="uploaded">
            {:else if isVideo( media[2] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={media[2].url}
                  type={media[2].type}
                  on:load={media}>
              </video>
            {/if}
          </a>
        </div>
      </div>
    </div>

  {:else if media.length === 4}
    <div class="media">
      <div class="left">
        <div class="top">
          <a class="media-single" href="{`/display/${id}/0`}">
            {#if isImage( media[0] )}
              <img 
                src={media[0].url}
                alt="uploaded">
            {:else if isVideo( media[0] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={media[0].url}
                  type={media[0].type}
                  on:load={media}>
              </video>
            {/if}
          </a>
        </div>

        <div class="bottom">
          <a class="media-single" href="{`/display/${id}/2`}">
            {#if isImage( media[2] )}
              <img 
                src={media[2].url}
                alt="uploaded">
            {:else if isVideo( media[2] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={media[2].url}
                  type={media[2].type}
                  on:load={media}>
              </video>
            {/if}
          </a>
        </div>
      </div>

      <div class="right">
        <div class="top">
          <a class="media-single" href="{`/display/${id}/1`}">
            {#if isImage( media[1] )}
              <img 
                src={media[1].url}
                alt="uploaded">
            {:else if isVideo( media[1] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={media[1].url}
                  type={media[1].type}
                  on:load={media}>
              </video>
            {/if}
          </a>
        </div>

        <div class="bottom">
          <a class="media-single" href="{`/display/${id}/3`}">
            {#if isImage( media[3] )}
              <img 
                src={media[3].url}
                alt="uploaded">
            {:else if isVideo( media[3] )}
              <!-- svelte-ignore a11y-media-has-caption -->
              <video loop controls>
                <source 
                  src={media[3].url}
                  type={media[3].type}
                  on:load={media}>
              </video>
            {/if}
          </a>
        </div>
      </div>
    </div>
  
  {/if}
  


  {#if type === "question"}
    <section class="question-container">
      <div class="question-box">
        {#each results as result }
          <div class="question">
            <div class="question-value-bar" style="width: {result.value}%;"></div>
            <div class="question-key">{result.key}</div>
            <div class="question-value">{result.value}%</div>
          </div>
        {/each}
      </div>
      <p class="tally">{ new Intl.NumberFormat().format( total ) } Votes</p>
    </section>
  {/if}

  <sl-divider></sl-divider>

  <footer>
    <a
      class="source-link"
      href="{url}"
      target="_blank" 
      rel="noopener noreferrer nofollow">
      Source
    </a>
    <a
      class="why"
      href="/why-am-i-seeing-this">
      Why am I seeing this?
    </a>
  </footer>
</article>

<style>
  .outer-frame {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 1rem 0 1rem 0;
    padding: 0;
    max-width:  36rem;
    border: 2px solid var(--sl-color-neutral-400);
    border-radius: var(--sl-border-radius-medium);
    margin-bottom: 4rem;
  }

  .outer-frame > header {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .outer-frame > header > .id {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  .outer-frame > header > .id > sl-icon {
    flex: 0 0 auto;
    font-size: var(--sl-font-size-x-large);
    margin: 0.5rem 0.5rem 0 1rem;
    color: var(--brand-color);
  }

  .outer-frame > header > .id > a {
    line-break: anywhere;
    margin: 0.5rem 1rem 0 0;
  }

  .outer-frame > header > .id > a:focus {
    line-break: anywhere;
    margin: calc(0.5rem - 2px) calc(1rem - 2px) -2px -2px;
  }

  .outer-frame > header > .timestamp {
    flex: 0 0 auto;
    font-size: var(--sl-font-size-medium);
    margin: 0.5rem 1rem 0 1rem;
    min-width: max-content;
  }

  .outer-frame > sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin: 0.5rem 1rem 0 1rem;
  }



  .outer-frame > footer {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
  }

  .outer-frame > footer > .source-link {
    margin: 0.5rem 0.5rem 0.5rem 1rem;
  }

  .outer-frame > footer > .source-link:focus {
    margin: calc(0.5rem - 2px) calc(0.5rem - 2px) calc(0.5rem - 2px) calc(1rem - 2px);
  }

  .outer-frame > footer > .why {
    margin: 0.5rem 1rem 0.5rem 0.5rem;
  }

  .outer-frame > footer > .why {
    margin: calc(0.5rem - 2px) calc(1rem - 2px) calc(0.5rem - 2px) calc(0.5rem - 2px);
  }



  .outer-frame > .content {
    margin: 1rem 1rem 0 1rem;
    padding: 0;
    max-width: 36rem;
    max-height: 20rem;
    border: none;
    overflow-y: hidden;
  }

  .outer-frame > .content > a {
    text-decoration: none;
    color: unset;
  }

  .outer-frame > .content > a:focus {
    margin: -2px;
  }

  .outer-frame > .content > a > :global( * ) {
    margin-bottom: 1rem;
  }

  .outer-frame > .content > a > :global( p ) {
    font-size: var(--sl-font-size-medium);
  }



  article > .media-single {
    margin: 0rem 1rem 0 1rem;
    padding: 0;
    max-width: 36rem;
    border-radius: var(--sl-border-radius-medium);
    display: flex;
    justify-content: center;
  }

  article > .media-single:focus {
    margin: calc(1rem - 2px) calc(1rem - 2px) -2px calc(1rem - 2px);
  }

  article > .media-single > img {
    object-fit: contain;
    border-radius: var(--sl-border-radius-medium);
  }

  article > .media-single > video {
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
    border-radius: var(--sl-border-radius-medium);
  }



  article > .media {
    position: relative;
    height: 284px;
    max-width: 36rem;
    margin: 0 1rem 0 1rem;
    border-radius: var(--sl-border-radius-medium);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  article > .media > .left,
  article > .media > .right {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  article > .media > .left {
    margin-right: 4px;
  }

  article > .media > .left > .top,
  article > .media > .left > .bottom,
  article > .media > .right > .top,
  article > .media > .right > .bottom {
    height: 140px;
    border-radius: var(--sl-border-radius-medium);
  }

  article > .media > .left > .top,
  article > .media > .right > .top {
    margin-bottom: 4px;
  }

  article > .media .media-single {
    height: 100%;
    width: 100%;
    border-radius: var(--sl-border-radius-medium);
  }

  article > .media .media-single > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: var(--sl-border-radius-medium);
  }

  article > .media .media-single > video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center center;
    background: #000;
    border-radius: var(--sl-border-radius-medium);
  }




  article > .question-container {
    position: relative;
    margin: 0 1rem;
    overflow-y: hidden;
  }

  article > .question-container > .question-box {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  article > .question-container > .question-box > .question {
    position: relative;
    width: 100%;
    height: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    margin: 0.25rem 0 0.25rem 0;
  }

  article > .question-container > .question-box > .question >.question-value-bar {
    height: 100%;
    position: absolute;
    left: 0;
    background-color: var(--sl-color-primary-500);
    border-radius: var(--sl-border-radius-large);
    z-index: 0;
  }

  article > .question-container > .question-box > .question > .question-key {
    padding-left: 0.5rem;
    z-index: 1;
    font-weight: var(--sl-font-weight-bold);
  }

  article > .question-container > .question-box > .question > .question-value {
    z-index: 1;
  }

  article > .question-container > .tally {
    margin-bottom: 0;
  }

</style>


