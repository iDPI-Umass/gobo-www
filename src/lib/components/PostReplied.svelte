<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Gutter from "$lib/components/Post/Gutter.svelte";
  import Heading from '$lib/components/Post/Heading.svelte';
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostSyndication from "$lib/components/PostSyndication.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import PostShared from "$lib/components/PostShared.svelte";
  import PostActions from "$lib/components/PostActions.svelte";
  import PostSharedFiltered from "$lib/components/PostSharedFiltered.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import { Post, Click } from "$lib/engines/post.js";

  export let centerID;
  export let identity = null;
  export let id = null;
  export let fullPage = false;

  let state, post, source, content, published;
  let share, thread, actionTarget, embeds, styles;
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
      console.error("render post: post ID is null");
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
      goto( `/post/${ identity }/${ centerID }`);
    }
  };
  

  Render.reset();
  onMount(() => {
    Render.post();
    return () => {
      Render.reset();
    };
  });
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
  on:click={Handle.click}
  on:keydown={Handle.click}>

  {#if state === "error"}
    <p>There was a problem displaying this post.</p>
  
  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "ready"}
    <div class="inner-frame">
      <Gutter {source} hasSpine={true}></Gutter>

      <div class="main">
        
        <header>
          <Heading {source}></Heading>
          <time datetime="published">{ published }</time>
        </header>

        {#if content}
          <section class="content" style={fullPage === true ? "max-height:unset" : ""}>
            {#if post.title != null}
              <h2>{post.title}</h2>
            {/if}

            {@html content}          
          </section>
        {/if}

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
              {centerID}
              id={share.id}
              marginTop={content ? "1rem" : "6.5px"}
            ></PostShared>
          {/if}
        {/if}

        <PostActions 
          {identity}
          platform={post.platform}
          post={actionTarget}
          marginBottom="1rem">
        </PostActions>

      </div>

    </div>

  {/if}

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
    -webkit-mask-image: var(--gradient);
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

  .outer-frame .inner-frame .main .content :global(pre) {
    white-space: pre-wrap;
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


