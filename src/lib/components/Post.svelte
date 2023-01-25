<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { humanize } from "$lib/helpers/humanize";

  export let id;
  export let type;
  export let platform;
  export let url;
  export let author;
  export let authorURL;
  export let created;
  export let heading = null;
  export let content;
  export let image = null;
  export let video = null;
  export let results = [];
  export let total = 0;

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

  {#if type === "article"}
    <section class="article-container">
      {#if heading != null}
        <h2>{heading}</h2>
      {/if}

      {@html content}
    </section>
  {/if}

  {#if type === "note"}
    <section class="note-container">
      {@html content}
    </section>
  {/if}

  {#if type === "image"}
    
    <section class="image-container">
      {@html content}
      <a class="image-box" href="{`/display/${id}`}">
        <img src="{image}">
      </a>
    </section>
  {/if}

  {#if type === "video"}
    <section class="video-container">
      {@html content}
      <div class="video-box">
        <video controls loop>
          <source src="{video}"/>
        </video>
      </div>
    </section>
  {/if}

  {#if type === "question"}
    <section class="question-container">
      {@html content}
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

  .outer-frame > section {
    margin: 1rem 1rem 0 1rem;
    padding: 0;
    max-width:  36rem;
    border: none;
  }

  .outer-frame > section > :global( * ) {
    margin-bottom: 1rem;
  }

  .outer-frame > section > :global( p ) {
    font-size: var(--sl-font-size-medium);
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




  article > .article-container {
    max-height: 60vh;
    overflow-y: scroll;
  }

  article > .note-container {
    overflow-y: hidden;
  }

  article > .image-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    max-height: 60vh;
    /* overflow-y: scroll; */
  }



  article > .image-container > .image-box {
    align-self: center;
    position: relative;
    width: min(calc(100vw - 4rem), 30rem);
    height: min(30vh, 20rem);
  }

  article > .image-container > .image-box > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }



  article > .video-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    max-height: 60vh;
    /* overflow-y: scroll; */
  }

  article > .video-container > .video-box {
    align-self: center;
    position: relative;
    width: min(calc(100vw - 4rem), 30rem);
    height: min(30vh, 20rem);
  }

  article > .video-container > .video-box > video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }



  article > .question-container {
    position: relative;
    max-height: 60vh;
    overflow-y: scroll;
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


