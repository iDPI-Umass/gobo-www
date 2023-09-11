<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";  
  import NewPostReference from "$lib/components/new-post/NewPostReference.svelte";
  import NewPostBody from "$lib/components/new-post/NewPostBody.svelte";
  import NewPostMedia from "$lib/components/new-post/NewPostMedia.svelte";
  import NewPostIdentities from "$lib/components/new-post/NewPostIdentities.svelte";
  import NewPostOptions from "$lib/components/new-post/NewPostOptions.svelte";
  import NewPostPublish from "$lib/components/new-post/NewPostPublish.svelte";

  import MastodonPreview from "$lib/components/new-post/MastodonPreview.svelte";
  import RedditPreview from "$lib/components/new-post/RedditPreview.svelte";
  import TwitterPreview from "$lib/components/new-post/BlueskyPreview.svelte";
  import NewPostPreview from "$lib/components/new-post/NewPostPreview.svelte";


</script>

<div class="main-child">
  <header>
    <h1>New Post</h1>
  </header>
  
  <form class="gobo-form">

    <section class="panel">
      <NewPostReference></NewPostReference>
    </section>
  
    <section class="panel">
      <NewPostBody></NewPostBody>
    </section>
  
  
    <section class="panel">
      <NewPostMedia></NewPostMedia>
    </section>
  
  
    <section class="panel">
      <NewPostIdentities></NewPostIdentities>
    </section>

    <section class="panel">
      <NewPostOptions></NewPostOptions>
    </section>
    
    <section class="panel extra-wide">
      <NewPostPreview></NewPostPreview>
    </section>
  
    <section class="panel publish">
      <NewPostPublish></NewPostPublish>     
    </section>
  
  </form>
</div>


<style>

  .gobo-form {
    margin-top: 0;
    padding: 0;
  }

  .gobo-form .panel {
    padding: 0 var(--gobo-width-spacer-flex) var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    margin: 0;
    border-bottom: var(--gobo-border-panel);
  }

  .gobo-form .panel:empty {
    padding: 0;
    margin: 0;
    border-bottom: none;
  }

  .gobo-form .panel :global(h2) {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-medium);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-form .panel :global(h3) {
    font-size: var(--gobo-font-size-large);
    font-weight: var(--gobo-font-weight-black);
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
  }

  .gobo-form .panel :global(p) {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
</style>

