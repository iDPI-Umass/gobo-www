<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import MastodonOptions from "$lib/components/new-post/MastodonOptions.svelte";
  import RedditOptions from "$lib/components/new-post/RedditOptions.svelte";
  import SmalltownOptions from "$lib/components/new-post/SmalltownOptions.svelte";
  import { onMount } from "svelte";
  import { State, Identity, Lock } from "$lib/engines/draft.js";

  let heading, options, hasMastodon, hasReddit, hasSmalltown;
  const Render = State.make();

  Render.cleanup = () => {
    heading = "Identity Specific Options"
    options = {};
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

  Render.identities = ( draft ) => {
    hasMastodon = Identity.hasMastodon();
    hasSmalltown = Identity.hasSmalltown();

    // In Reddit, replies are comments, not full posts. So don't show options.
    if ( draft.reply != null ) {
      hasReddit = false;
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


{#if hasMastodon || hasReddit || hasSmalltown }
  <section class="panel">
    <h2>{heading}</h2>
  </section>
  
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
</style>