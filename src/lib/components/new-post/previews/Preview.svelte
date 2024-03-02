<script>
  import Bluesky from "$lib/components/new-post/previews/Bluesky.svelte";
  import Mastodon from "$lib/components/new-post/previews/Mastodon.svelte";
  import Reddit from "$lib/components/new-post/previews/Reddit.svelte";
  import Smalltown from "$lib/components/new-post/previews/Smalltown.svelte";
  import { draftStore } from "$lib/stores/draft.js";
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
  <Bluesky></Bluesky>
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