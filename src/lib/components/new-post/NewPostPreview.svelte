<script>
  import BlueskyPreview from "$lib/components/new-post/BlueskyPreview.svelte";
  import MastodonPreview from "$lib/components/new-post/MastodonPreview.svelte";
  import RedditPreview from "$lib/components/new-post/RedditPreview.svelte";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { onMount } from "svelte";

  let hasBluesky = false;
  let hasMastodon = false;
  let hasReddit = false;


  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( async function ( draft ) {      
      let match;
      match = draft.identities.find( i => i.type === "bluesky" && i.active === true);
      hasBluesky = match != null;

      match = draft.identities.find( i => i.type === "mastodon" && i.active === true);
      hasMastodon = match != null;

      match = draft.identities.find( i => i.type === "reddit" && i.active === true);
      hasReddit = match != null;
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

<h3 class="preview-header">Reddit</h3>
<RedditPreview></RedditPreview>

<!-- {#if hasReddit}
  <h3 class="preview-header">Reddit</h3>
  <RedditPreview></RedditPreview>
{/if} -->


<style>
  .panel {
    max-width: 36rem;
  }
</style>