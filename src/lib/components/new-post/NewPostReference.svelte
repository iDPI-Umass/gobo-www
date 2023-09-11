<script>
  import Post from "$lib/components/Post.svelte"
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { getPost } from "$lib/resources/post.js";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { onMount } from "svelte";

  let reference = null;
  let title = "";
  let referenceReady = false;

  const handleContent = function ( event ) {
    draftStore.update({ content: event.target.value });
  }

  const loadPost = async function ({ reply, quote }) {
    if ( reply != null ) {
      reply.data = await getPost( reply );
      draftStore.update({ reply });
    } else {
      quote.data = await getPost( quote );
      draftStore.update({ quote });
    }
  };

  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( async function ( draft ) {
      reference = draft.reply ?? draft.quote;
      if ( reference == null ) {
        title = "";
        referenceReady = false;
        return;
      }

      if ( draft.reply != null ) {
        title = "Replying To:"
      }
      if ( draft.quote != null ) {
        title = "Quote:"
      }

      if ( reference.data == null ) {
        await loadPost( draft );
      }

      referenceReady = true;
    });

    return function () {
      unsubscribeDraft();
    };
  });


</script>

<section>
  {#if reference != null}
    {#if referenceReady !== true}
      <Spinner></Spinner>
    {:else}
      <Post 
        identity={reference.identity}
        {...reference.data}
        fullPage={true}>
      </Post>
    {/if}
  {/if}
</section>

<style>
  section {
    padding-top: var(--gobo-height-spacer);
  }
</style>

