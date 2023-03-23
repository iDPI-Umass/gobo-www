<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import { humanize } from "$lib/helpers/humanize";
  import { goto } from "$app/navigation";

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

  // Trace DOM parents until we get to overall post article.
  const hasLinkParent = function ( element ) {
    if ( element.parentNode.tagName === "A" ) {
      return true;
    } else if ( element.parentNode.tagName === "ARTICLE" ) {
      return false;
    } else {
      return hasLinkParent( element.parentNode );
    }
  }

  const isLink = function ( element ) {
    if ( element.tagName === "A" ) {
      return true;
    } else if ( element.tagName === "ARTICLE" ) {
      return false;
    } else {
      return hasLinkParent( element )
    }
  }

  const handleClick = function ( event ) {
    // Bail if this is a non-Enter key press event.
    if ( (event.type === "keydown") && (event.key !== "Enter") ) {
      return;
    }

    // Bail if this is already the post's main page.
    if ( fullPage === true ) {
      return;
    }

    // Bail if agent clicked a legit link.
    if ( isLink( event.target ) ) {
      return;
    }

    // Bail if the agent is trying to highlight text for non-link purposes.
    if ( window.getSelection().toString().length > 0 ) {
      return;
    }

    // Go to the post's main page.
    goto( `/post/${ id }`);
  }

</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<article 
  class="outer-frame" 
  tabindex={fullPage ? undefined : "0"} 
  aria-label={fullPage ? undefined : "gobo-post"}
  role={fullPage ? undefined : "link"}
  style="--cursor:{fullPage ? "inherit" : "pointer"};"
  on:click={handleClick}
  on:keydown={handleClick}>


  <div class="inner-frame">
    <aside class="gutter">
      <img src="{avatar}" alt={`avatar for ${ headingSlot1 }`}>
    </aside>

    <div class="main">
      
      <header>
        <span class="names">
          <span class="slot1">{ headingSlot1 }</span>
          <span class="slot2">{ headingSlot2 }</span>
        </span>
        <time datetime="created">{ humanize( created ) }</time>
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

    </div>

  </div>


  <footer>
    
    <a
      class="why"
      href="/why-am-i-seeing-this">
      Why am I seeing this?
    </a>
    
    <a
      class="source-link"
      href="{url}"
      target="_blank" 
      rel="noopener noreferrer nofollow">
      <sl-icon src="{logo}" class="{platform}"></sl-icon>
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
    max-width: var(--gobo-max-width-primary);
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    margin-bottom: var(--gobo-height-spacer);
    box-sizing: border-box;
    cursor: var(--cursor);
  }

  .outer-frame:focus-visible {
    outline: 2px solid var(--gobo-color-primary);
  }

  @supports not selector(:focus-visible) {
    .outer-frame:focus {
      outline: 2px solid var(--gobo-color-primary);
    }
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

  .outer-frame .inner-frame .main header time {
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
  }


  .outer-frame .inner-frame .main .media,
  .outer-frame .inner-frame .main .poll {
    margin-bottom: var(--gobo-height-spacer);
  }

  .outer-frame .inner-frame .main .media :global(a) {
    position: relative;
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


  .outer-frame footer a sl-icon {
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  .outer-frame footer a.source-link {
    color: var(--gobo-color-text-muted);
  }



</style>


