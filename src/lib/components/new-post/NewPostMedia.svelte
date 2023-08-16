<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { previewStore } from "$lib/stores/image-preview.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";


  let options = {};
  let files = [];
  let fileInput;

  const handleOptionSensitive = function ( event ) {
    draftStore.updateOption({ 
      sensitive: event.target.checked 
    });
  };

  const addFile = function ( file ) {
    let match = files.find( f => f.name === file.name );

    if ( match == null ) {
      draftStore.update({ files: [ ...files, file ] });
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


  const handlePreview = function( file ) {
    return function ( event ) {
      event.preventDefault();
      previewStore.set( file );
      goto( "/upload-preview" );
    }
  };

  const handleDelete = function ( file ) {
    return function ( event ) {
      event.preventDefault();
      const index = files.findIndex( f => f.name === file.name );

      if ( index >= 0 ) {
        files.splice( index, 1 );
        draftStore.update({ files });
      }
    }
  };

  onMount( function () {
    const unsubscribeDraft = draftStore.subscribe( function ( draft ) {
      for ( const file of draft.files ) {
        if ( ! draftStore.isFile( file ) ) {
          files = [];
          draftStore.update({ files });
        }
      }

      options = draft.options;
      files = draft.files;
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
  class="keyword-table" 
  ondragover="return false" 
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}>
  {#each files as file (file.name)}
    <div class="table-row">
      <a
        href="/upload-preview"
        on:click={handlePreview( file )}
        on:keypress={handlePreview( file )}>
        { file.name }
      </a>
      <sl-icon-button
        class="danger"
        label="Delete File" 
        src="/icons/trash.svg"
        on:click={handleDelete( file )}
        on:keypress={handleDelete( file )}>>
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

  .keyword-table {
    height: 20rem;
    margin-top: var(--gobo-height-spacer-flex);
  }
</style>