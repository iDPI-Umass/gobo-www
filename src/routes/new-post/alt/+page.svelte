<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";
  import { altStore } from "$lib/stores/alt-store";

  let alt, attachments, file;
  let form, previewImage;
  const Render = State.make();
  
  Render.cleanup = () => {
    alt = null;
    attachments = [];
    file = {};
  };

  Render.attachments = ( draft ) => {
    attachments = draft.attachments;
  };

  Render.preview = ( data ) => {
    file = data.file;
    alt = data.alt;

    if ( file.name != null ) {
      if ( previewImage.src !== "#" ) {
        URL.revokeObjectURL( previewImage.src );
      }
      previewImage.src = URL.createObjectURL( file );
    }
  };


  const Handle = {};
  Handle.alt = ( event ) => alt = event.target.value;
  
  Handle.cancel = () => {
    goto("/new-post");
  };

  Handle.submit = ( event ) => {
    event.preventDefault();
    
    const attachment = attachments.find( a => a.file.name === file.name );
    if ( attachment == null ) {
      attachments.push({ file, alt })
    } else {
      attachment.alt = alt;
    }

    Draft.updateAspect( "attachments", attachments );
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
  
  <form class="gobo-form" bind:this={form} on:submit={Handle.submit}>
    
    <h2>Image Configuration</h2>

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