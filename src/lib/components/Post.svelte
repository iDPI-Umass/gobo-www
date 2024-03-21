<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
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

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import { Post, Click } from "$lib/engines/post.js";

  export let identity = null;
  export let id = null;
  export let fullPage = false;
  export let showWhy = true;

  let state, post, source, content, published;
  let share, thread, actionTarget, embeds, styles;
  let clickURL = `/post/${ identity }/${ id }`;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    post = null;
    source = null;
    content = null;
    published = null;
    share = null;
    thread = [];
    actionTarget = null;
    embeds = {};
    styles = {};
  };

  Render.post = async () => {
    if ( identity == null ) {
      console.error("render post: identity is null");
      state = "error";
      return;
    }

    if ( id == null ) {
      state = "error";
      return;
    }

    post = await Post.get({ identity, id });
    if ( post == null ) {
      state = "error";
      return;
    }

    source = Post.source( post );
    if ( source == null ) {
      state = "error";
      return;
    }

    content = Post.content( post );
    published = Post.published( post );
    share = Post.share( post );
    thread = Post.thread( post );
    actionTarget = Post.actionTarget( post );
    embeds = Post.embeds( post );
    styles = Post.styles( post, { fullPage });
    state = "ready";
  };


  const Handle = {};
  Handle.click = ( event ) => {
    if ( state === "ready" && Click.passes( fullPage, event )) {
      goto( clickURL );
    }
  };


  Render.reset();
  onMount(() => {
    Render.post();
    return () => {
      Render.reset();
    };
  })

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
  on:click={Handle.click}
  on:keydown={Handle.click}>

  {#if state === "error"}
    <sl-alert variant="danger" open>
      <sl-icon slot="icon" src="/icons/exclamation-circle.svg"></sl-icon>
      There was a problem displaying this post.
    </sl-alert>
  
  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "ready"}
    {#if fullPage === true}

      {#each thread as ref (ref.id)}
        {#if Post.isFiltered( ref )}
          <PostRepliedFiltered></PostRepliedFiltered>
        {:else}
          <PostReplied 
            {identity} 
            centerID={id}
            id={ref.id}
            {fullPage}>
          </PostReplied>
        {/if}
        
      {/each}
    
    {:else}

      {#if thread.length > 2}

        {#if Post.isFiltered(thread.at(0))}
          <PostRepliedFiltered></PostRepliedFiltered>
        {:else}
          <PostReplied 
            {identity} 
            centerID={id}
            id={thread.at(0).id}
            {fullPage}>
          </PostReplied>
        {/if}
      
        <PostConnector url={clickURL}></PostConnector>

        {#if Post.isFiltered(thread.at(-1))}
          <PostRepliedFiltered></PostRepliedFiltered>
        {:else}
          <PostReplied 
            {identity} 
            centerID={id}
            id={thread.at(-1).id}
            {fullPage}>
          </PostReplied>
        {/if}
      
      {:else}

        {#each thread as ref (ref.id)}
          {#if Post.isFiltered(ref)}
            <PostRepliedFiltered></PostRepliedFiltered>
          {:else}
            <PostReplied 
              {identity} 
              centerID={id}
              id={ref.id}
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
          <time datetime="published">{ published }</time>
        </header>

        <section class="content" style={fullPage === true ? "max-height:unset" : ""}>
          {#if post.title != null}
            <h2>{post.title}</h2>
          {/if}

          {#if content}
            {@html content}
          {/if}          
        </section>

        {#if embeds.media.length > 0}
          <div class="media">
            <PostMedia {identity} {id} attachments={embeds.media}></PostMedia>
          </div>
        {:else if embeds.text.length > 0}
          <div class="text-embed">
            <PostSyndication attachments={embeds.text}></PostSyndication>
          </div>
        {/if}

        {#if post.poll}
          <div class="poll">
            <PostPoll poll={post.poll}></PostPoll>
          </div>
        {/if}

        {#if share}
          {#if Post.isFiltered(share)}
            <PostSharedFiltered></PostSharedFiltered>
          {:else}
            <PostShared
              {identity} 
              centerID={id}
              id={share.id}
              marginTop={content ? "1rem" : "6.5px"}
              {fullPage}>
            </PostShared>
          {/if}
        {/if}

        <PostActions 
          {identity}
          platform={post.platform}
          post={actionTarget}>
        </PostActions>

      </div>

    </div>


    <Footer {identity} {post} {showWhy}></Footer>

  {/if}
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

  sl-alert::part(base) {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    margin-top: 0;
  }
</style>