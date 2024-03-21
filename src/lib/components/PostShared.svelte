<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import SharedHeading from "$lib/components/Post/SharedHeading.svelte";
  import PostSharedFiltered from "$lib/components/PostSharedFiltered.svelte";
  import PostMedia from "$lib/components/PostMedia.svelte";
  import PostSyndication from "$lib/components/PostSyndication.svelte";
  import PostPoll from "$lib/components/PostPoll.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import { Post, Click } from "$lib/engines/post.js";

  export let centerID;
  export let identity = null;
  export let id = null;
  export let fullPage = false;
  export let marginTop = "0";

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
    <sl-alert variant="danger" open>
      <sl-icon slot="icon" src="/icons/exclamation-circle.svg"></sl-icon>
      There was a problem displaying this post.
    </sl-alert>
  
  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "ready"}


    <div class="inner-frame" style:--margin-top="{marginTop}">
      <div class="main">
        
        <header>
          <SharedHeading {source} ></SharedHeading>
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
            <svelte:self
              {identity}
              {centerID}
              id={share.id}
              marginTop="1rem"
            />
          {/if}
        {/if}
      </div>

    </div>

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
    align-self: flex-start;
  }




  .outer-frame .inner-frame .main .content {
    max-height: var(--max-height);
    overflow-y: hidden;
    margin-bottom: 0;
    mask-image: var(--gradient);
    -webkit-mask-image: var(--gradient);
  }

  .outer-frame .inner-frame .main .media,
  .outer-frame .inner-frame .main .poll {
    margin-top: var(--gobo-height-spacer-half);
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

  .outer-frame .inner-frame .main .content :global(pre) {
    white-space: pre-wrap;
  }

  sl-alert::part(base) {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }
</style>


