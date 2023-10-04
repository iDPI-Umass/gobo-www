<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostSyndication from "$lib/components/PostSyndication.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import PostShared from "$lib/components/PostShared.svelte";
  import PostActions from "$lib/components/PostActions.svelte";
  import { humanize } from "$lib/helpers/humanize.js";
  import { render } from "$lib/helpers/markdown.js";
  import { goto } from "$app/navigation";
  import { Cache } from "$lib/resources/cache.js";
  import * as h from "$lib/components/post-helpers.js";

  export let identity;

  export let centerID;
  export let id;
  export let platform;
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

  export let fullPage = false;

  let unused = [ platform_id, visibility, reply, url, created, updated ];
  let source = Cache.getSource( source_id );

  let sharedPosts = [];
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

  
  let logo = h.getLogo( platform );
  let { headingSlot1, headingSlot2 } = h.getHeadingSlots( source );
  let avatar = h.getAvatar( source );
  let avatarFallback = h.getAvatarFallback( source );
  let sourceCopy = h.getSourceCopy( platform );
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
  };

  const isLink = function ( element ) {
    if ( element.tagName === "A" ) {
      return true;
    } else if ( element.tagName === "ARTICLE" ) {
      return false;
    } else {
      return hasLinkParent( element )
    }
  };

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


  <div class="inner-frame">
    <aside class="gutter">
      <img 
        src="{avatar}" 
        alt={`avatar for ${ headingSlot1 }`}
        onerror="this.onerror=null;this.src='{avatarFallback}'"
      >
      <div class="spine"></div>
    </aside>

    <div class="main">
      
      <header>
        <div class="names">
          <div class="slot1">{ headingSlot1 }</div>
          {#if headingSlot2}
            <div class="slot2">{ headingSlot2 }</div>
          {/if}
        </div>
        <time datetime="published">{ humanize( published ) }</time>
      </header>

      {#if renderedContent}
        <section class="content" style={fullPage === true ? "max-height:unset" : ""}>
          {#if title != null}
            <h2>{title}</h2>
          {/if}

          {@html renderedContent}          
        </section>
      {/if}

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
        <PostShared
          {identity} 
          centerID={centerID}
          {...post}
          marginTop={renderedContent ? "1rem" : "6.5px"}
          >
        </PostShared>
      {/each}

      <PostActions 
        {identity} 
        post={id} 
        {platform}
        marginBottom="1rem"
        >
      </PostActions>

    </div>

  </div>

</article>

<style>

  .inner-frame {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 0 var(--gobo-width-spacer-flex) 0 var(--gobo-width-spacer-flex);
  }

  .inner-frame .gutter {
    min-width: max-content;
  }


  .inner-frame .gutter img {
    height: 2.8125rem;
    width: 2.8125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-half);
    border: var(--gobo-border-panel);
  }

  .inner-frame .gutter .spine {
    height: calc(100% - 2.8125rem);
    width: 4px;
    background-color: var(--gobo-color-primary);
    margin-left: calc((2.8125rem / 2) - 2px);
  }

  .inner-frame .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    min-width: 0;
  }

  .inner-frame .main header {  
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .inner-frame .main header .names {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
  }

  .inner-frame .main header .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    color: var(--gobo-color-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 0.75rem;
  }

  .inner-frame .main header .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .inner-frame .main header time {
    flex-shrink: 0;
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    min-width: max-content;
    margin-left: 0.75rem;
  }




  .inner-frame .main .content {
    max-height: var(--max-height);
    overflow-y: hidden;
    margin-bottom: 0;
    mask-image: var(--gradient);
    -webkit-mask-image: var(--gradient)
  }

  .inner-frame .main .content :global(h2) {
    font-size: 1.125rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 0.5rem;
  }

  .inner-frame .main .content :global(h3) {
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 1rem;
  }

  .inner-frame .main .content :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-bottom: 1rem;
  }

  .inner-frame .main .content :global(a) {
    position: relative;
  }

  .inner-frame .main .content :global(:last-child) {
    margin-bottom: 0;
  }


  .inner-frame .main .media,
  .inner-frame .main .poll {
    margin-bottom: 0;
    margin-top: var(--gobo-height-spacer-half);
  }

  .inner-frame .main .media :global(a) {
    position: relative;
  }
</style>


