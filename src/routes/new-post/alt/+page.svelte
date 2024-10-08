<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";
  import { altStore } from "$lib/stores/alt-store";

  let draftFile, alt, attachments, thread, srcURL;
  let form, previewImage;
  const Render = State.make();
  
  Render.cleanup = () => {
    draftFile = null;
    alt = "";
    attachments = [];
    if ( srcURL != null ) {
      URL.revokeObjectURL( srcURL );
      srcURL = null;
    }
  };

  Render.attachments = ( draft ) => {
    attachments = draft.attachments;
    thread = draft.thread;
  };

  Render.preview = ( value ) => {
    draftFile = value;
    const file = draftFile.file;
    alt = draftFile.alt;

    if ( file != null ) {
      if ( srcURL != null ) {
        URL.revokeObjectURL( srcURL );
      }
      srcURL = URL.createObjectURL( file )
      previewImage.src = srcURL;
    } else {
      previewImage.src = draftFile.url;
    }
  };


  const Handle = {};
  Handle.alt = ( event ) => alt = event.target.value ?? "";
  
  Handle.cancel = () => {
    goto("/new-post");
  };

  Handle.submit = ( event ) => {
    event.preventDefault();

    const index = attachments.findIndex( a => a.name === draftFile.name );
    const match = attachments[ index ];
    const headRow = thread[0] ?? [];
    
    if ( !match ) {
      draftFile.alt = alt;
      attachments.push( draftFile );
      for ( const item of headRow ) {
        item.attachments.push( draftFile.id );
      }
    
    } else if ( draftFile.file?.lastModified !== match.file?.lastModified ) {
      attachments.splice( index, 1 );
      for ( const item of headRow ) {
        const _index = head.attachments.findIndex( id => id === match.id );
        if ( _index > -1 ) {
          item.attachments.splice( _index, 1, draftFile.id );
        }
      }

    } else {
      match.alt = alt;
    }

    // Update the state in the draft structure.
    Draft.updateAspect( "attachments", attachments );
    Draft.updateAspect( "thread", thread );
    goto("/new-post");
  };



  Render.reset();
  onMount(() => {
    Render.listen( "attachments", Render.attachments );
    Render.closers.push( altStore.subscribe( Render.preview ));
    return () => {
      Render.reset();
    };
  });
</script>

<div class="main-child">

  <BackLink heading="Image Configuration"></BackLink>
  
  <form class="gobo-form" bind:this={form} on:submit={Handle.submit}>
    <img
      bind:this={previewImage}
      src="#"
      alt="preview of upload"
    >
    
    <sl-textarea
      on:sl-input={Handle.alt}
      value={alt}
      placeholder="Add alt text"
      size="medium"
      resize="none"
      rows=4>
    </sl-textarea>

    <section class="buttons">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <sl-button
        on:click={Handle.cancel}
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