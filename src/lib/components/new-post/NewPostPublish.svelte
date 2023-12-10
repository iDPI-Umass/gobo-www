<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import * as Post from "$lib/resources/post.js";
  import { allyEvent } from "$lib/helpers/event";
  import * as linkify from 'linkifyjs';


  let draft = {};
  let publishButton;

  const isValid = function () {
    console.log(draft);

    const active = draft.identities.filter( i => i.active === true );
   

    if ( active.length === 0 ) {
      draftStore.update({ alert: "Must select an identity to publish this post." });
      return false;
    }

    for ( const identity of active ) {
      if ( identity.platform === "bluesky" && draft.content != null ) {
        const links = linkify.find(draft.content, "url");
        let length = draft.content.length;
        let surplus = 0;
        for ( const link of links ) {
          const url = new URL( link.href );
          if ( url.pathname.length > 16 ) {
            surplus += ( url.pathname.length - 16 );
          }
          if (link.value.startsWith("https://")) {
            surplus += 8;
          }
          else if (link.value.startsWith("http://")) {
            surplus += 7;
          }
        }
        length = length - surplus;
        if ( length > 300 ){
          draftStore.update({ alert: "Bluesky does not accept posts with more than 300 characters." });
          return false;
        }
      }

      if ( identity.platform === "mastodon" && draft.content?.length > 500 ) {
        draftStore.update({ alert: "Mastodon does not accept posts with more than 500 characters." });
        return false;
      }

      if ( identity.platform === "reddit" && draft.content?.length > 40000 ) {
        draftStore.update({ alert: "Reddit does not accept posts with more than 40,000 characters." });
        return false;
      }

      return true;
    }
  };

  const publish = async function () {
    if ( publishButton.loading === true ) {
      return;
    }

    if ( isValid() !== true ) {
      return;
    }
    
    publishButton.loading = true;
    await Post.publish( draft );
    draftStore.clear();
    publishButton.loading = false;
    goto("/home");
  };


  const handleDiscard = allyEvent( draftStore.clear );
  const handlePublish = allyEvent( publish );


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
  Gobo will issue requests to each of the identities you specified.
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
    border-top: none;
    padding-top: 0;
  }

  .buttons sl-button {
    margin-bottom: 0;
    width: 10rem;
  }
</style>