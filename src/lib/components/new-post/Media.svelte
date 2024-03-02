<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State, Draft, Options, Media } from "$lib/engines/draft.js";
  import { previewStore } from "$lib/stores/image-preview.js";
  import { altStore } from "$lib/stores/alt-store.js"

  let options, attachments
  let fileInput;
  const Render = State.make();

  Render.cleanup = () => {
    options = {};
    attachments = [];
  };

  Render.cycle = ( draft ) => {
    for ( const attachment of draft.attachments ) {
      if ( !Media.isFile( attachment.file )) {
        attachments = [];
        Draft.updateAspect( "attachments", attachments );
      }
    }
    attachments = draft.attachments;
  };

  Render.options = ( draft ) => {
    options = draft.options
  };



  const File = {};
  File.add = ( file ) => {
    const index = attachments.findIndex( a => a.file.name === file.name );

    if ( index < 0 ) {
      altStore.set({ file, alt: null });
      goto("/new-post/alt");
    } else {
      const match = attachments[ index ];
      if ( file.lastModified !== match.file.lastModified ) {
        altStore.set({ file, alt: match.alt });
        attachments.splice( index, 1 );
        Draft.updateAspect( "attachments", attachments );
        goto( "/new-post/alt" );
      }
    }
  };

  File.listen = () => {
    const _files = fileInput.files;
    if ( _files.length > 0 ) {
      for ( const file of _files ) {
        addFile( file );
      }
      fileInput.value = null;
    }
  };



  const Handle = {};
  Handle.sensitive = ( event ) => {
    Options.handle( "sensitive", event );
  };
  Handle.dragEnter = ( event ) => {
    event.preventDefault();
  };
  Handle.dragLeave = ( event ) => {
    event.preventDefault();
  };
  Handle.drop = ( event ) => {
    event.preventDefault();

    // Support both item list and file interfaces.
    if ( event.dataTransfer.items ) {

      [ ...event.dataTransfer.items ].forEach(( item ) => {
        // If dropped items aren't files, reject them
        if ( item.kind === "file" ) {
          const file = item.getAsFile();
          addFile( file );
        }
      });

    } else {
      [ ...event.dataTransfer.files ].forEach(( file ) => {
        addFile( file );
      });
    }
  };

  Handle.fileChrome = ( event ) => {
    fileInput.click();
  };
  Handle.fileChromeKey = ( event ) => {
    if ( event.key === "Enter" ) {
      fileInput.click();
    }
  };
  Handle.preview = ( attachment ) => {
    return ( event ) => {
      event.preventDefault();
      previewStore.set( attachment );
      goto( "/upload-preview" );
    }
  };
  Handle.delete = ( attachment ) => {
    return ( event ) => {
      event.preventDefault();
      if ( event.type === "keypress" && event.key !== "Enter" ) {
        return;
      }

      const index = attachments.findIndex( a => a.file.name === attachment.file.name );

      if ( index >= 0 ) {
        attachments.splice( index, 1 );
        Draft.updateAspect( "attachments", attachments );
      }
    }
  };
  Handle.edit = ( attachment ) => {
    return ( event ) => {
      event.preventDefault();
      if ( event.type === "keypress" && event.key !== "Enter" ) {
        return;
      }
      altStore.set( attachment );
      goto("/new-post/alt");
    };
  }



  Render.reset();
  onMount(() => {
    Render.listen( "attachments", Render.cycle );
    Render.listen( "options", Render.options );
    fileInput.addEventListener( "change", File.listen );
    return () => {
      Render.reset();
      fileInput.removeEventListener( "change", File.listen );
    };
  });
</script>


<h2>Attach Media</h2>
  
<sl-checkbox
  on:sl-change={Handle.sensitive}
  checked={options.sensitive}
  size="medium">
  Mark Media as Sensitive
</sl-checkbox>

<div 
  class="gobo-table" 
  ondragover="return false" 
  on:dragenter={Handle.dragEnter}
  on:dragleave={Handle.dragLeave}
  on:drop={Handle.drop}>
  {#each attachments as attachment (attachment.file.name)}
    <div class="table-row">
      <a
        href="/upload-preview"
        on:click={Handle.preview( attachment )}
        on:keypress={Handle.preview( attachment )}>
        { attachment.file.name }
      </a>
      <sl-icon-button
        class="danger"
        label="Delete File" 
        src="/icons/trash.svg"
        on:click={Handle.delete( attachment )}
        on:keypress={Handle.delete( attachment )}>>
      </sl-icon-button>
      <sl-icon-button
        class="warning"
        label="Edit Alt" 
        src="/icons/pencil-square.svg"
        on:click={Handle.edit( attachment )}
        on:keypress={Handle.edit( attachment )}>>
      </sl-icon-button>
    </div>
  {/each}
</div>

<input 
  bind:this={fileInput}
  type="file"
  multiple=true
  class="hidden">


<div class="buttons">
  <sl-button
    on:click={Handle.fileChrome}
    on:keypress={Handle.fileChromeKey}
    size="medium"
    class="submit"
    pill>
    Add Attachment
  </sl-button>
</div>

<style>
  sl-checkbox {
    margin-top: var(--gobo-height-spacer-flex);
  }

  .gobo-table {
    height: 20rem;
    margin-top: var(--gobo-height-spacer-flex);
  }

  .table-row sl-icon-button {
    margin-left: 1rem;
  }

  .buttons {
    border-top: none;
    padding-top: var(--gobo-height-spacer-flex);
  }
</style>