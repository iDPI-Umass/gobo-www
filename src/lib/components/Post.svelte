<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostSyndication from "$lib/components/PostSyndication.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import PostShared from "$lib/components/PostShared.svelte";
  import PostReplied from "$lib/components/PostReplied.svelte";
  import PostActions from "$lib/components/PostActions.svelte";
  import { humanize } from "$lib/helpers/humanize.js";
  import { render } from "$lib/helpers/markdown.js";
  import { goto } from "$app/navigation";
  import { Cache } from "$lib/resources/cache.js";
  import * as h from "$lib/helpers/post-engine.js";

  export let identity;

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


  let unused = [ platform_id, visibility, created, updated ];
  let source = Cache.getSource( source_id );
  let sharedPost = h.getShare( shares );
  let replyPost = h.getReply( reply );
  let actionTarget = h.getActionTarget({ id, content, sharedPost });
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


  const handleClick = function ( event ) {
    const doesPass = h.filterClickEvent( fullPage, event );
    if ( doesPass ) {
      // Go to the post's main page.
      goto( `/post/${ identity }/${ id }`);
    }
  };</script>

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

  {#if replyPost}
    <PostReplied 
      {identity} 
      centerID={id}
      {...replyPost}
      {fullPage}>
    </PostReplied>
  {/if}

  <div class="inner-frame">
    <aside class="gutter">
      <img 
        src="{avatar}" 
        alt={`avatar for ${ headingSlot1 }`}
        onerror="this.onerror=null;this.src='{avatarFallback}'"
      >
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

      {#if sharedPost}
        <PostShared
          {identity} 
          centerID={id}
          {...sharedPost}
          marginTop={renderedContent ? "1rem" : "6.5px"}
          {fullPage}>
        </PostShared>
      {/if}

      <PostActions {platform} {identity} post={actionTarget}></PostActions>

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
      <span>{sourceCopy}</span>     
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
    padding-top: var(--gobo-height-spacer-flex);
    box-sizing: border-box;
    cursor: var(--cursor);
  }

  @media ( max-width: 680px ) {
    .outer-frame {
      border-radius: 0;
      border-left: none;
      border-right: none;
      margin-bottom: calc(var(--gobo-height-spacer) / 2)
    }
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
    margin: 0 var(--gobo-width-spacer-flex) 0 var(--gobo-width-spacer-flex);
  }

  .outer-frame .inner-frame .gutter {
    min-width: max-content;
  }


  .outer-frame .inner-frame .gutter img {
    height: 2.8125rem;
    width: 2.8125rem;
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
    margin-bottom: 0.25rem;
  }

  .outer-frame .inner-frame .main header .names {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
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
  }




  .outer-frame .inner-frame .main .content {
    max-height: var(--max-height);
    overflow-y: hidden;
    margin-bottom: 0;
    mask-image: var(--gradient);
    -webkit-mask-image: var(--gradient);
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
  .outer-frame .inner-frame .main .content :global(p:last-of-type) {
    margin-bottom: 0;
  }

  .outer-frame .inner-frame .main .content :global(a) {
    position: relative;
  }

  .outer-frame .inner-frame .main .content :global(:last-child) {
    margin-bottom: 0;
  }

  .outer-frame .inner-frame .main .content :global(pre) {
    white-space: pre-wrap;
  }

  .outer-frame .inner-frame .main .media,
  .outer-frame .inner-frame .main .poll {
    margin-bottom: 0;
    margin-top: var(--gobo-height-spacer-half);
  }

  .outer-frame .inner-frame .main .media :global(a) {
    position: relative;
  }





  .outer-frame footer {
    width: 100%;
    height: 2.5rem;
    padding: 0.5rem var(--gobo-width-spacer-flex);
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
    margin-right: 0;
  }

  .outer-frame footer a.source-link {
    color: var(--gobo-color-text-muted);
  }

  .outer-frame footer a.source-link span {
    display: none;
  }

  @media ( min-width: 425px ) {
    .outer-frame footer a.source-link sl-icon {
      margin-right: 0.5rem;
    }

    .outer-frame footer a.source-link span {
      display: inline;
    }
  }





</style>


