<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import { humanize } from "$lib/helpers/humanize";

  export let id;
  export let type;
  export let platform;
  export let url;
  export let avatar;
  export let author;
  export let authorName;
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

  if ( avatar == null ) {
    switch ( platform ) {
      case "mastodon":
        avatar = "https://mastodon.social/avatars/original/missing.png";
        break;
      case "reddit":
        avatar = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png";
        break;
      case "twitter":
        avatar = "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";
        break;
    }
  }

  let sourceCopy;
  switch ( platform ) {
    case "mastodon":
      // Specialize this to name the server?
      sourceCopy = "View on Mastodon";
      break;
    case "reddit":
      sourceCopy = "View on Reddit";
      break;
    case "twitter":
      sourceCopy = "View on Twitter";
      break;
  }



  let logo = `/icons/${ platform }.svg`;
  let brandColor = colors[ platform ];

  let headingSlot1, headingSlot2;
  switch ( platform ) {
    case "mastodon":
      headingSlot1 = authorName;
      headingSlot2 = author;
      break;
    case "reddit":
      headingSlot1 = authorName;
      headingSlot2 = `Posted by ${ author }`;
      break;
    case "twitter":
      headingSlot1 = authorName;
      headingSlot2 = author;
      break;
  }

</script>

<article class="outer-frame">
  <!-- svelte-ignore a11y-missing-content -->
  <a class="card-link" href={`/home/article/${id}`} aria-label="expand post"></a>

  <section class="inner-frame">
    <section class="gutter">
      <img src="{avatar}" alt="profile avatar for this post">
    </section>

    <section class="main">
      
      <header>
        <span class="names">
          <span class="slot1">{ headingSlot1 }</span>
          <span class="slot2">{ headingSlot2 }</span>
        </span>
        <span class="timestamp">{ humanize( created ) }</span>
      </header>

      <section class="content" style={fullPage === true ? "max-height:unset" : ""}>
        {#if heading != null}
          <h2>{heading}</h2>
        {/if}

        {@html content}
      </section>

      {#if media.length > 0}
        <div class="media">
          <PostMedia {id} {media}></PostMedia>
        </div>
      {/if}

      {#if results.length > 0}
        <div class="poll">
          <PostPoll {results} {total}></PostPoll>
        </div>
      {/if}

    </section>

  </section>


  <footer>
    
    <a
      class="why"
      href="/why-am-i-seeing-this">
      <span>Why am I seeing this?</span>
    </a>
    
    <a
      class="source-link"
      href="{url}"
      target="_blank" 
      rel="noopener noreferrer nofollow">
      <sl-icon src="{logo}" style="--color:{brandColor};"></sl-icon>
      {sourceCopy}      
    </a>
   
  </footer>

</article>

<style>
  .outer-frame {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 1rem 0 1rem 0;
    padding: 0;
    max-width: var(--gobo-max-width-primary);
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    margin-bottom: var(--gobo-height-spacer);
  }

  .outer-frame .card-link::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: var(--gobo-border-radius);
    z-index: 1;
  }

  .outer-frame .card-link:focus {
    border: none;
  }

  .outer-frame .card-link:focus::after {
    border: 2px solid var(--gobo-color-primary);
  }

  .outer-frame .inner-frame {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: var(--gobo-height-spacer) var(--gobo-width-spacer) 0 var(--gobo-width-spacer);
  }

  .outer-frame .inner-frame .gutter {
    min-width: max-content;
    flex: 0 0 10%;
  }


  .outer-frame .inner-frame .gutter img {
    height: 2.8125rem;
    width: 2.8125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer);
    border: var(--gobo-border-panel);
  }

  .outer-frame .inner-frame .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  .outer-frame .inner-frame .main header {  
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: var(--gobo-height-spacer-half);
  }

  .outer-frame .inner-frame .main header .names {
    flex: 1 1 80%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  .outer-frame .inner-frame .main header .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    color: var(--gobo-color-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 0 1 auto;
    margin-right: 0.75rem;
  }

  .outer-frame .inner-frame .main header .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1 2 40%;
  }

  .outer-frame .inner-frame .main header .timestamp {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    min-width: max-content;
    flex: 0 0 10%;
    /* Allows graceful internal spacing while wrapped */
    margin-bottom: calc(0.5 * var(--gobo-height-spacer-half));
    margin-left: 0.5rem;
  }




  .outer-frame .inner-frame .main .content {
    max-height: 12rem;
    overflow-y: hidden;
    margin-bottom: var(--gobo-height-spacer);
  }

  .outer-frame .inner-frame .main .content > * {
    margin-bottom: 0.5rem;
  }

  .outer-frame .inner-frame .main .content :global(h2) {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-bold);
  }

  .outer-frame .inner-frame .main .content :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
  }

  .outer-frame .inner-frame .main .content :global(a) {
    position: relative;
    z-index: 2;
  }


  .outer-frame .inner-frame .main .media,
  .outer-frame .inner-frame .main .poll {
    margin-bottom: var(--gobo-height-spacer);
  }

  .outer-frame .inner-frame .main .media :global(a) {
    position: relative;
    z-index: 2;
  }





  .outer-frame footer {
    width: 100%;
    padding: 0.5rem var(--gobo-width-spacer);
    border-top: var(--gobo-border-panel);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .outer-frame footer a {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    z-index: 2;
  }

  .outer-frame footer a {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    font-size: var(--gobo-font-size-detail);
  }

  .outer-frame footer a:focus {
    margin: -2px;
  }

  .outer-frame footer a sl-icon {
    font-size: 1rem;
    color: var(--color);
    margin-right: 0.5rem;
  }

  .outer-frame footer a.source-link {
    color: var(--gobo-color-text-muted);
  }



</style>


