<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Post } from "$lib/engines/post.js";

  export let identity = null;
  export let id = null;
  export let styles = {};

  let state, post, content;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    post = null;
    content = null;
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

    content = Post.content( post );
    styles.marginTop ??= "0";
    styles.maxHeight ??= "unset"
    state = "ready";
  };

  Render.reset();
  onMount(() => {
    Render.post();
    return () => {
      Render.reset();
    }
  })
</script>


{#if state === "error"}
  <section>
    <p>There was a problem displaying this post content.</p>
  </section>

{:else if state === "loading"}
  <Spinner></Spinner>

{:else if state === "ready"}
  <section
    class="content"
    style:max-height={styles.maxHeight}
    style:margin-top={styles.marginTop}
    >
    {#if post.title != null}
      <h2>{post.title}</h2>
    {/if}

    {#if content}
      {@html content}
    {/if}          
  </section>

{/if}


<style>
  .content {
    max-height: var(--max-height);
    overflow-y: hidden;
    margin-bottom: 0;
    mask-image: var(--gradient);
    -webkit-mask-image: var(--gradient);
  }

  .content :global(h2) {
    font-size: 1.125rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 0.5rem;
  }

  .content :global(h3) {
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-black);
    overflow-wrap: anywhere;
    margin-bottom: 1rem;
  }

  .content :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-bottom: 1rem;
  }
  .content :global(p:last-of-type) {
    margin-bottom: 0;
  }

  .content :global(a) {
    position: relative;
  }

  .content :global(:last-child) {
    margin-bottom: 0;
  }

  .content :global(pre) {
    white-space: pre-wrap;
  }
</style>