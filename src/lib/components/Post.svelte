<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Gutter from "$lib/components/Post/Gutter.svelte";
  import Heading from '$lib/components/Post/Heading.svelte';
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostSyndication from "$lib/components/PostSyndication.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import PostShared from "$lib/components/PostShared.svelte";
  import PostSharedFiltered from "$lib/components/PostSharedFiltered.svelte";
  import PostReplied from "$lib/components/PostReplied.svelte";
  import PostRepliedFiltered from "$lib/components/PostRepliedFiltered.svelte";
  import PostConnector from "$lib/components/PostConnector.svelte";
  import PostActions from "$lib/components/PostActions.svelte";
  import Footer from "$lib/components/Post/Footer.svelte";
  import { humanize } from "$lib/helpers/humanize.js";
  import { render } from "$lib/helpers/markdown.js";
  import { goto } from "$app/navigation";
  import { Cache } from "$lib/resources/cache.js";
  import * as h from "$lib/engines/post.js";

  export let identity;

  export let id;
  export let platform;
  export let source_id;
  export let base_url;
  export let title = null;
  export let content = null;
  export let url;
  export let proxyURL = null;
  export let published;
  export let attachments = [];
  export let shares = [];
  export let threads = [];
  export let poll = null;

  export let platform_id;
  export let visibility = null;
  export let created;
  export let updated;

  export let fullPage = false;
  export let showWhy = true;

  let unused = [ base_url, platform_id, visibility, created, updated ];
  let footer = { platform, proxyURL, url };
  let source = Cache.getSource( source_id );
  let sharedPost = h.getShare( shares );
  let threadPosts = h.getThreads( threads );
  let actionTarget = h.getActionTarget({ id, content, sharedPost });
  let { headingSlot1, headingSlot2 } = h.getHeadingSlots( source );
  let avatar = h.getAvatar( source );
  let avatarFallback = h.getAvatarFallback( source );
  let renderedContent = render( content );
  let mediaEmbeds = attachments.filter( a => /^(image|video)\//.test(a.type) );
  let textEmbeds = attachments.filter( a => /^application\/json/.test(a.type) );
  let clickURL = `/post/${ identity }/${ id }`

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
      goto( clickURL );
    }
  };

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
  style:margin-top="{fullPage ? '2rem' : '0'}" 
  on:click={handleClick}
  on:keydown={handleClick}>

  {#if fullPage === true}

    {#each threadPosts as threadPost (threadPost.id)}
      {#if h.isFilteredPost(threadPost)}
        <PostRepliedFiltered></PostRepliedFiltered>
      {:else}
        <PostReplied 
          {identity} 
          centerID={id}
          {...threadPost}
          {fullPage}>
        </PostReplied>
      {/if}
      
    {/each}
  
  {:else}

    {#if threadPosts.length > 2}

      {#if h.isFilteredPost(threadPosts.at(0))}
        <PostRepliedFiltered></PostRepliedFiltered>
      {:else}
        <PostReplied 
          {identity} 
          centerID={id}
          {...threadPosts.at(0)}
          {fullPage}>
        </PostReplied>
      {/if}
    
      <PostConnector url={clickURL}></PostConnector>

      {#if h.isFilteredPost(threadPosts.at(-1))}
        <PostRepliedFiltered></PostRepliedFiltered>
      {:else}
        <PostReplied 
          {identity} 
          centerID={id}
          {...threadPosts.at(-1)}
          {fullPage}>
        </PostReplied>
      {/if}
    
    {:else}

      {#each threadPosts as threadPost (threadPost.id)}
        {#if h.isFilteredPost(threadPost)}
          <PostRepliedFiltered></PostRepliedFiltered>
        {:else}
          <PostReplied 
            {identity} 
            centerID={id}
            {...threadPost}
            {fullPage}>
          </PostReplied>
        {/if}
      {/each}

    {/if}

  {/if}

  <div class="inner-frame">
    <Gutter {source}></Gutter>

    <div class="main">
      
      <header>
        <Heading {source} ></Heading>
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

      {#if sharedPost}
        {#if h.isFilteredPost(sharedPost)}
          <PostSharedFiltered></PostSharedFiltered>
        {:else}
          <PostShared
            {identity} 
            centerID={id}
            {...sharedPost}
            marginTop={content ? "1rem" : "6.5px"}
            {fullPage}>
          </PostShared>
        {/if}
      {/if}

      <PostActions {platform} {identity} post={actionTarget}></PostActions>

    </div>

  </div>


  <Footer post={footer} {showWhy}></Footer>

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
</style>