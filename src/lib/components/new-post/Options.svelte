<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import LinkedinOptions from "$lib/components/new-post/LinkedinOptions.svelte";
  import MastodonOptions from "$lib/components/new-post/MastodonOptions.svelte";
  import RedditOptions from "$lib/components/new-post/RedditOptions.svelte";
  import SmalltownOptions from "$lib/components/new-post/SmalltownOptions.svelte";
  import { onMount } from "svelte";
  import { State, Identity, Lock, Options } from "$lib/engines/draft.js";

  let heading, options, hasLinkedin, hasMastodon, hasReddit, hasSmalltown;
  const Render = State.make();

  Render.cleanup = () => {
    heading = "Identity Specific Options"
    options = {};
    hasLinkedin = false;
    hasMastodon = false;
    hasReddit = false;
    hasSmalltown = false;
  };

  Render.cycle = ( draft ) => {
    if ( Lock.isRequired() ) {
      heading = "Options";
    } else {
      heading = "Identity Specific Options";
    }

    options = draft.options;
  };

  Render.subreddit = ( draft ) => {
    let subreddit;
    if ( draft.reply?.data != null ) {
      const id = draft.reply.data.feed[0];
      const reply = draft.reply.data.posts.find( p => p.id === id );
      const source = draft.reply.data.sources.find( s => s.id == reply.source_id );
      subreddit = source.name;
    }
   
    Options.update( "reddit", "subreddit", subreddit );
    Options.update( "general", "title", "" );
  };

  Render.identities = ( draft ) => {
    hasLinkedin = Identity.hasLinkedin();
    hasMastodon = Identity.hasMastodon();
    hasSmalltown = Identity.hasSmalltown();

    // In Reddit, replies are comments, not full posts.
    // Dont' show options, but set them automatically.
    if ( draft.reply != null ) {
      hasReddit = false;
      Render.subreddit( draft ); 
    } else {
      hasReddit = Identity.hasReddit();
    }
  };


  Render.reset();
  onMount(() => {
    Render.listen( "options", Render.cycle );
    Render.listen( "identities", Render.identities );
    return () => {
      Render.reset();
    };
  });
</script>


{#if hasLinkedin || hasMastodon || hasReddit || hasSmalltown }
  <h2>{heading}</h2>

  {#if hasLinkedin }
    <LinkedinOptions></LinkedinOptions>
  {/if}

  {#if hasMastodon }
    <MastodonOptions></MastodonOptions>
  {/if}

  {#if hasReddit }
    <RedditOptions></RedditOptions>
  {/if}

  {#if hasSmalltown }
    <SmalltownOptions></SmalltownOptions>
  {/if}
{/if}

<style>
  :global(.panel):first-of-type {
    margin-top: 1rem;
  }
  
  :global(.panel) {
    margin-top: 1.5rem;
  }

  @media( min-width: 768px ) {
    :global(.panel) {
      margin-top: 3rem;
    }
  }
</style>