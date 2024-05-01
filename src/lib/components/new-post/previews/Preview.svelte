<script>
  import Bluesky from "$lib/components/new-post/previews/Bluesky.svelte";
  import Linkedin from "$lib/components/new-post/previews/Linkedin.svelte";
  import Mastodon from "$lib/components/new-post/previews/Mastodon.svelte";
  import Reddit from "$lib/components/new-post/previews/Reddit.svelte";
  import Smalltown from "$lib/components/new-post/previews/Smalltown.svelte";
  import { onMount } from "svelte";
  import { State, Identity } from "$lib/engines/draft.js";

  let hasBluesky, hasLinkedin, hasMastodon, hasReddit, hasSmalltown;
  const Render = State.make();

  Render.cleanup = () => {
    hasBluesky = false;
    hasLinkedin = false;
    hasMastodon = false;
    hasReddit = false;
    hasSmalltown = false;
  }

  Render.cycle = ( draft ) => {
    hasBluesky = Identity.hasBluesky();
    hasLinkedin = Identity.hasLinkedin();
    hasMastodon = Identity.hasMastodon();
    hasReddit = Identity.hasReddit();
    hasSmalltown = Identity.hasSmalltown();
  };


  Render.reset();
  onMount(() => {
    Render.listen( "identities", Render.cycle );
    return () => {
      Render.reset()
    };
  });
</script>


<h2>Preview</h2>
<p>
  This section provides an approximation of how your posts will appear on 
  each platform once submitted. As you edit your post, these previews will update.
</p>


{#if hasBluesky}
  <h3 class="preview-header">Bluesky</h3>
  <Bluesky></Bluesky>
{/if}

{#if hasLinkedin}
  <h3 class="preview-header">LinkedIn</h3>
  <Linkedin></Linkedin>
{/if}

{#if hasMastodon}
  <h3 class="preview-header">Mastodon</h3>
  <Mastodon></Mastodon>
{/if}

{#if hasReddit}
  <h3 class="preview-header">Reddit</h3>
  <Reddit></Reddit>
{/if}

{#if hasSmalltown}
  <h3 class="preview-header">Smalltown</h3>
  <Smalltown></Smalltown>
{/if}


<style>
  .panel {
    max-width: 36rem;
  }
</style>