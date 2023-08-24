<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { onMount } from "svelte";

  let content = null;

  const handleContent = function ( event ) {
    draftStore.update({ content: event.target.value });
  }

  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( function ( draft ) {
      content = draft.content;
    });

    return function () {
      unsubscribeDraft();
    };
  });
</script>


<sl-textarea
  on:sl-input={handleContent}
  value={content}
  placeholder="Compose your post here."
  size="medium"
  resize="none"
  rows=4>
</sl-textarea>

<style>
  sl-textarea {
    margin-top: var(--gobo-height-spacer-flex);
  }

  sl-textarea::part(base) {
    font-size: 1.125rem;
    /* height: 7rem; */
    border-radius: var(--gobo-border-radius)
  }

  sl-textarea::part(textarea) {
    padding: 0.5rem 1rem;
  }
</style>