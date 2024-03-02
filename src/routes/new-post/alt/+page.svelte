<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { draftStore } from "$lib/stores/draft
  import { altStore } from "$lib/stores/alt-store";
  import { allyEvent } from "$lib/helpers/event";
  let form, file, alt, attachments, previewImage;

  const handleContent = function ( event ) {
    alt = event.target.value;
  }

  const submit = function () {
    const index = attachments.findIndex( a => a.file.name === file.name );
    if ( index < 0 ) {
      attachments.push({ file, alt })
    } else {
      attachments[ index ].alt = alt;
    }
    draftStore.update({ attachments })
    goto("/new-post");
  };

  const cancel = allyEvent(function ( event ) {
    goto("/new-post");
  });

  onMount(() => {
    const submitListener = function( event ) {
      event.preventDefault();
      submit();
    };

    form.addEventListener( "submit", submitListener);

    const unsubscribeAlt = altStore.subscribe( function ( data ) {
      file = data.file;
      alt = data.alt;

      if ( file.name != null ) {
        if ( previewImage.src !== "#" ) {
          URL.revokeObjectURL( previewImage.src );
        }
        previewImage.src = URL.createObjectURL( file );
      }
    });

    const unsubscribeDraft = draftStore.subscribe( function ( draft ) {
      attachments = draft.attachments;
    });

    return function () {
      form.removeEventListener( "submit", submitListener);
      unsubscribeAlt();
      unsubscribeDraft();
    };
  });
</script>

<div class="main-child">
  
  <form class="gobo-form" bind:this={form}>
    
    <h2>Image Configuration</h2>

    <img
      bind:this={previewImage}
      src="#"
      alt="preview of upload"
    >
    
    <sl-textarea
      on:sl-input={handleContent}
      value={alt}
      placeholder="Add alt text"
      size="medium"
      resize="none"
      rows=4>
    </sl-textarea>

    <section class="buttons">
      <sl-button
        on:click={cancel}
        on:keydown={cancel}
        class="cancel"
        type="cancel"
        size="medium"
        pill>
        Cancel
      </sl-button>

      <sl-button
        class="submit"
        type="submit"
        size="medium"
        pill>
        Continue
      </sl-button>
    </section>
  </form>
</div>


<style>
  img {
    border-radius: var(--gobo-border-radius);
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