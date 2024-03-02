<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { draftStore } from "$lib/stores/draft.js";
  import { previewStore } from "$lib/stores/image-preview.js";
  import { altStore } from "$lib/stores/alt-store.js"
  import * as DraftImage from "$lib/resources/draft-image";

  let options = {};
  let attachments = [];
  let fileInput;

  const handleOptionSensitive = function ( event ) {
    draftStore.updateOption({ 
      sensitive: event.target.checked 
    });
  };

  const addFile = function ( file ) {
    const index = attachments.findIndex( a => a.file.name === file.name );

    if ( index < 0 ) {
      altStore.set({ file, alt: null });
      goto("/new-post/alt");
    } else {
      const match = attachments[ index ];
      if ( file.lastModified !== match.file.lastModified ) {
        altStore.set({ file, alt: match.alt });
        attachments.splice( index, 1 );
        draftStore.update({ attachments });
        goto("/new-post/alt");
      }
    }
  }

  const handleDragEnter = function ( event ) {
    event.preventDefault();
  };

  const handleDragLeave = function ( event ) {
    event.preventDefault();
  };

  const handleDrop = function ( event ) {
    event.preventDefault();

    // Support both item list and file interfaces.
    if ( event.dataTransfer.items ) {

      [ ...event.dataTransfer.items ].forEach( function ( item ) {
        // If dropped items aren't files, reject them
        if ( item.kind === "file" ) {
          const file = item.getAsFile();
          addFile( file );
        }
      });

    } else {
      [ ...event.dataTransfer.files ].forEach( function ( file ) {
        addFile( file );
      });
    }
  };

  const handleFileChrome = function ( event ) {
    fileInput.click();
  };

  const handleFileChromeKey = function ( event ) {
    if ( event.key === "Enter" ) {
      fileInput.click();
    }
  };


  const handlePreview = function( attachment ) {
    return function ( event ) {
      event.preventDefault();
      previewStore.set( attachment );
      goto( "/upload-preview" );
    }
  };

  const handleDelete = function ( attachment ) {
    return function ( event ) {
      event.preventDefault();
      if ( event.type === "keypress" && event.key !== "Enter" ) {
        return;
      }

      const index = attachments.findIndex( a => a.file.name === attachment.file.name );

      if ( index >= 0 ) {
        attachments.splice( index, 1 );
        draftStore.update({ attachments });
      }
    }
  };

  const handleEdit = function ( attachment ) {
    return function ( event ) {
      event.preventDefault();
      if ( event.type === "keypress" && event.key !== "Enter" ) {
        return;
      }
      altStore.set( attachment );
      goto("/new-post/alt");
    };
  }

  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( function ( draft ) {
      for ( const attachment of draft.attachments ) {
        if ( ! draftStore.isFile( attachment.file ) ) {
          attachments = [];
          draftStore.update({ attachments });
        }
      }

      options = draft.options;
      attachments = draft.attachments;
    });

    const listener = function () {
      const _files = fileInput.files;
      if ( _files.length > 0 ) {
        for ( const file of _files ) {
          addFile( file );
        }
        fileInput.value = null;
      }
    };

    fileInput.addEventListener( "change", listener );

    return function () {
      unsubscribeDraft();
      fileInput.removeEventListener( "change", listener );
    };
  });
</script>


<h2>Attach Media</h2>
  
<sl-checkbox
  on:sl-change={handleOptionSensitive}
  checked={options.sensitive}
  size="medium">
  Mark Media as Sensitive
</sl-checkbox>

<div 
  class="gobo-table" 
  ondragover="return false" 
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}>
  {#each attachments as attachment (attachment.file.name)}
    <div class="table-row">
      <a
        href="/upload-preview"
        on:click={handlePreview( attachment )}
        on:keypress={handlePreview( attachment )}>
        { attachment.file.name }
      </a>
      <sl-icon-button
        class="danger"
        label="Delete File" 
        src="/icons/trash.svg"
        on:click={handleDelete( attachment )}
        on:keypress={handleDelete( attachment )}>>
      </sl-icon-button>
      <sl-icon-button
        class="warning"
        label="Edit Alt" 
        src="/icons/pencil-square.svg"
        on:click={handleEdit( attachment )}
        on:keypress={handleEdit( attachment )}>>
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
    on:click={handleFileChrome}
    on:keypress={handleFileChromeKey}
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