<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostSyndication from "$lib/components/PostSyndication.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import { humanize } from "$lib/helpers/humanize.js";
  import { render } from "$lib/helpers/markdown.js";
  import { goto } from "$app/navigation";
  import { Cache } from "$lib/resources/cache.js";

  export let identity;
  export let centerID;

  export let id;
  export let source_id;
  export let base_url;
  export let title = null;
  export let content = null;
  export let url;
  export let published;
  export let attachments = [];
  export let shares = [];
  export let reply = null;
  export let poll = null;

  export let platform_id;
  export let visibility = null;
  export let created;
  export let updated;
  export let terminal = false;

  export let fullPage = false;

  let unused = [ platform_id, visibility, reply, created, updated, url ];

  
  let platform;
  if ( base_url == "https://bsky.app" ) {
    platform = "bluesky";
  } else if ( base_url == "https://www.reddit.com" ) {
    platform = "reddit";
  } else {
    platform = "mastodon";
  }


  let source = Cache.getSource( source_id );
  let avatar = source.icon_url;
  let avatarFallback;
  switch ( platform ) {
    case "mastodon":
    case "bluesky":
      avatarFallback = "https://mastodon.social/avatars/original/missing.png";
      break;
    case "reddit":
      avatarFallback = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png";
      break;
  }

  let sharedPosts = [];
  // Prevent graph sprawl in feed.
  if ( terminal !== true ) {
    for ( const item of shares ) {
      const post = Cache.getPost( item );
      if ( post == null ) {
        console.error(`expected post ${item}, but it appears to be missing from graph`);
      } else {
        sharedPosts.push( post );
      }
    }

    // Correct errors in graph that produce multiple shares.
    // TODO: Look for errors in either feed response constructor or feed intermediary constructor.
    if ( sharedPosts.length > 1 ) {
      sharedPosts = [ sharedPosts[0] ];
    }
  }


  let sourceCopy;
  switch ( platform ) {
    case "bluesky":
      sourceCopy = "View on Bluesky";
      break;
    case "mastodon":
      // Specialize this to name the server?
      sourceCopy = "View on Mastodon";
      break;
    case "reddit":
      sourceCopy = "View on Reddit";
      break;
  }



  let logo = `/icons/${ platform }.svg`;
  let headingSlot1, headingSlot2;
  switch ( platform ) {
    case "bluesky":
      headingSlot1 = source.name;
      headingSlot2 = `@${source.username}`;
      break;
    case "mastodon":
      headingSlot1 = source.name;
      headingSlot2 = `@${source.username}`;
      break;
    case "reddit":
      headingSlot1 = `r/${source.name}`;
      break;
  }

  let renderedContent = render( content );

  let mediaEmbeds = attachments.filter( a => /^(image|video)\//.test(a.type) );
  let textEmbeds = attachments.filter( a => /^application\/json/.test(a.type) );

  const styles = {}
  if ( fullPage === true ) {
    styles.cursor = "inherit";
  } else {
    styles.cursor = "pointer";
  }
  
  styles.maxHeight = "15rem";
  styles.gradientStop = "10rem";
  if ( fullPage === true ) {
    styles.gradient = "none"
  } else {
    styles.gradient = "linear-gradient( 180deg, #000 var(--gradient-stop), transparent )"
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

  const hasButtonParent = function ( element ) {
    if ( element.parentNode.tagName === "SL-BUTTON" ) {
      return true;
    } else if ( element.parentNode.tagName === "ARTICLE" ) {
      return false;
    } else {
      return hasButtonParent( element.parentNode );
    }
  };

  const isButton = function ( element ) {
    if ( element.tagName === "SL-BUTTON" ) {
      return true;
    } else if ( element.tagName === "ARTICLE" ) {
      return false;
    } else {
      return hasButtonParent( element )
    }
  };

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

    // Bail if agent clicked a button.
    if ( isButton(event.target) ) {
      return;
    }

    // Bail if the agent is trying to highlight text for non-link purposes.
    if ( window.getSelection().toString().length > 0 ) {
      return;
    }

    // Go to the post's main page.
    goto( `/post/${ identity }/${ centerID }`);
  }

</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<article 
  class="outer-frame" 
  tabindex={fullPage ? undefined : "0"} 
  aria-label={fullPage ? undefined : "gobo-post"}
  role={fullPage ? undefined : "link"}
  style:--cursor="{styles.cursor}"
  style:--max-height="{styles.maxHeight}"
  style:--gradient-stop="{styles.gradientStop}"
  style:--gradient="{styles.gradient}" 
  on:click={handleClick}
  on:keydown={handleClick}>


  <div class="inner-frame" style:--margin-top="1rem">
    <div class="main">
      
      <header>
        <img 
          src="{avatar}" 
          alt={`avatar for ${ headingSlot1 }`}
          onerror="this.onerror=null;this.src='{avatarFallback}'"
        >
        <div class="names">
          <div class="slot1">{ headingSlot1 }</div>
          {#if headingSlot2}
            <div class="slot2">{ headingSlot2 }</div>
          {/if}
        </div>
        <time datetime="published">{ humanize( published ) }</time>
      </header>

      <section class="content" style={fullPage === true ? "max-height:unset" : ""}>
        {#if title != null}
          <h2>{title}</h2>
        {/if}

        {#if renderedContent}
          {@html renderedContent}
        {/if}
      </section>

      {#if mediaEmbeds.length > 0}
        <div class="media">
          <PostMedia {identity} {id} attachments={mediaEmbeds}></PostMedia>
        </div>
      {:else if textEmbeds.length > 0}
        <div class="text-embed">
          <PostSyndication attachments={textEmbeds}></PostSyndication>
        </div>
      {/if}

      {#if poll}
        <div class="poll">
          <PostPoll {poll}></PostPoll>
        </div>
      {/if}

      {#each sharedPosts as post}
        <svelte:self 
          {identity}
          centerID={centerID} 
          {...post} 
          terminal={true}/>
      {/each}

    </div>

  </div>

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
    margin-bottom: 0;
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
    margin-top: var(--margin-top);
    border-left: 4px solid var(--gobo-color-text);
    padding-left: var(--gobo-width-spacer-half);
  }


  .outer-frame .inner-frame img {
    height: 1.40625rem;
    width: 1.40625rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-half);
    border: var(--gobo-border-panel);
  }

  .outer-frame .inner-frame .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    min-width: 0;
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
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
    align-self: flex-start;
  }

  .outer-frame .inner-frame .main header .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    color: var(--gobo-color-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 0.75rem;
  }

  .outer-frame .inner-frame .main header .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .outer-frame .inner-frame .main header time {
    flex-shrink: 0;
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    min-width: max-content;
    margin-left: 0.75rem;
    align-self: flex-start;
  }




  .outer-frame .inner-frame .main .content {
    max-height: var(--max-height);
    overflow-y: hidden;
    margin-bottom: 0;
    mask-image: var(--gradient);
    -webkit-mask-image: var(--gradient)
  }

  .outer-frame .inner-frame .main .media,
  .outer-frame .inner-frame .main .poll {
    margin-top: var(--gobo-height-spacer);
  }

  .outer-frame .inner-frame .main .content :global(h2) {
    font-size: 1.125rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 0.5rem;
  }

  .outer-frame .inner-frame .main .content :global(h3) {
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 1rem;
  }

  .outer-frame .inner-frame .main .content :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-bottom: 1rem;
  }

  .outer-frame .inner-frame .main .content :global(a) {
    position: relative;
  }

  .outer-frame .inner-frame .main .content :global(:last-child) {
    margin-bottom: 0;
  }

  .outer-frame .inner-frame .main .media :global(a) {
    position: relative;
  }
</style>


