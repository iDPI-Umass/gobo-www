<script>
  import BlueskyPreview from "$lib/components/new-post/BlueskyPreview.svelte";
  import MastodonPreview from "$lib/components/new-post/MastodonPreview.svelte";
  import RedditPreview from "$lib/components/new-post/RedditPreview.svelte";
  import SmalltownPreview from "$lib/components/new-post/SmalltownPreview.svelte";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { onMount } from "svelte";

  let hasBluesky = false;
  let hasMastodon = false;
  let hasReddit = false;
  let hasSmalltown = false;


  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( async function ( draft ) {      
      let match;
      match = draft.identities.find( i => i.platform === "bluesky" && i.active === true);
      hasBluesky = match != null;

      match = draft.identities.find( i => i.platform === "mastodon" && i.active === true);
      hasMastodon = match != null;

      match = draft.identities.find( i => i.platform === "reddit" && i.active === true);
      hasReddit = match != null;

      match = draft.identities.find( i => i.platform === "smalltown" && i.active === true);
      hasSmalltown = match != null;
    });

    return function () {
      unsubscribeDraft();
    };
  });
</script>


<section class="panel">
  <h2>Preview</h2>
  <p>
    This section provides an approximation of how your posts will appear on 
    each platform once submitted. As you edit your post, these previews will update.
  </p>
</section>


{#if hasBluesky}
  <h3 class="preview-header">Bluesky</h3>
  <BlueskyPreview></BlueskyPreview>
{/if}

{#if hasMastodon}
  <h3 class="preview-header">Mastodon</h3>
  <MastodonPreview></MastodonPreview>
{/if}

{#if hasReddit}
  <h3 class="preview-header">Reddit</h3>
  <RedditPreview></RedditPreview>
{/if}

{#if hasSmalltown}
  <h3 class="preview-header">Smalltown</h3>
  <SmalltownPreview></SmalltownPreview>
{/if}


<style>
  .panel {
    max-width: 36rem;
  }
</style>