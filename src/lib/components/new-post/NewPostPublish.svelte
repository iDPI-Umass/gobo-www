<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import * as Post from "$lib/resources/post.js";


  let draft = {};
  let publishButton;

  const dispatch = function ( f ) {
    return function ( event ) {
      event.preventDefault();
      if ( event.type === "keypress" ) {
        if ( event.key === "Enter" ) {
          f(event);
        }
      } else {
        f(event)
      }
    };
  };

  const publish = async function () {
    if ( publishButton.loading === true ) {
      return;
    }
    
    publishButton.loading = true;
    await Post.publish( draft );
    draftStore.clear();
    publishButton.loading = false;
    goto("/home");
  };


  const handleDiscard = dispatch( draftStore.clear );
  const handlePublish = dispatch( publish );


  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( function ( _draft ) {
      draft = _draft
    });

    return function () {
      unsubscribeDraft();
    };
  });
</script>


<h2>Publish</h2>
<p>
  Publish your post. Gobo will issue requests to each of the platforms 
  you specified.
</p>

<div class="buttons">
  <sl-button
    on:click={handleDiscard}
    on:keypress={handleDiscard}
    class="cancel"
    size="medium"
    pill>
    Discard Draft
  </sl-button>

  <sl-button
    bind:this={publishButton}
    on:click={handlePublish}
    on:keypress={handlePublish}
    class="submit"
    size="medium"
    pill>
    Publish
  </sl-button>
</div>

<style>
  p {
    margin: 0;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
  }

  .buttons sl-button {
    margin-bottom: 0;
    width: 10rem;
  }
</style>