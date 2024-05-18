<script>
  import { filesize } from "filesize";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State, Draft, Options, Media } from "$lib/engines/draft.js";
  import { DraftFile } from "$lib/engines/draft-file.js";
  import { Platforms } from "$lib/engines/platforms/index.js";
  import { previewStore } from "$lib/stores/image-preview.js";
  import { altStore } from "$lib/stores/alt-store.js"

  let fileInput;
  let options, attachments, acceptTypes;
  const Render = State.make();

  Render.cleanup = () => {
    options = {};
    attachments = [];
    acceptTypes = "";
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

  Render.identities = () => {
    acceptTypes = Platforms.getAcceptable().join( "," ) || ".text";
  };


  const Image = {};
  Image.add = async ( file ) => {
    const index = attachments.findIndex( a => a.name === file.name );
    
    if ( index < 0 ) {
      const draftFile = await DraftFile.fromFile( file );
      altStore.set( draftFile );
      goto("/new-post/alt");
    
    } else {
      const match = attachments[ index ];
      if ( file.lastModified !== match.file?.lastModified ) {
        const draftFile = await DraftFile.fromFile( file );
        altStore.set( draftFile );
        attachments.splice( index, 1 );
        Draft.updateAspect( "attachments", attachments );
        goto( "/new-post/alt" );
      }
    }
  };


  const Attachment = {};
  Attachment.add = async ( file ) => {
    const index = attachments.findIndex( a => a.name === file.name );

    if ( index < 0 ) {
      const draftFile = await DraftFile.fromFile( file );
      attachments.push( draftFile );
      Draft.updateAspect( "attachments", attachments );
    
    } else {
      const match = attachments[ index ];
      if ( file.lastModified !== match.file?.lastModified ) {
        const draftFile = await DraftFile.fromFile( file );
        attachments.splice( index, 1, draftFile );
        Draft.updateAspect( "attachments", attachments );
      }
    }
  };


  const File = {};
  File.add = ( file ) => {
    if ( Media.isImage( file )) {
      Image.add( file );
    } else {
      Attachment.add( file );
    }
  };

  File.addMany = async ( files ) => {
    for ( const file of files ) {
      const attachment = attachments.find( a => a.name === file.name );
      if ( attachment == null ) {
        const draftFile = await DraftFile.fromFile( file );
        attachments.push( draftFile );
      }
    }
    attachments = attachments;
    Draft.updateAspect( "attachments", attachments );
  };

  File.listen = () => {
    const _files = fileInput.files;
    if ( _files.length > 0 ) {
      for ( const file of _files ) {
        File.add( file );
      }
      fileInput.value = null;
    }
  };



  const Handle = {};
  
  Handle.sensitive = ( event ) => {
    Options.handle( "attachments", "sensitive", event );
  };

  Handle.inputFiles = () => {
    if ( fileInput.files.length === 1 ) {
      File.add( fileInput.files[0] );
    } else if ( fileInput.files.length > 1 ) {
      File.addMany( fileInput.files );
    }
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
    const files = [];
    if ( event.dataTransfer.items ) {
      for ( const item of event.dataTransfer.items ) {
        // If dropped items aren't files, reject them
        if ( item.kind === "file" ) {
          files.push( item.getAsFile() );
        }
      }
    } else {
      for ( const file of event.dataTransfer.files ) {
        files.push( file );
      }
    }

    if ( files.length === 1 ) {
      File.add( files[0] );
    } else if ( files.length > 1 ) {
      File.addMany( files );
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
      if ( event.type === "keydown" && event.key !== "Enter" ) {
        return;
      }

      const index = attachments.findIndex( a => a.name === attachment.name );

      if ( index >= 0 ) {
        attachments.splice( index, 1 );
        Draft.updateAspect( "attachments", attachments );
      }
    }
  };
  
  Handle.edit = ( attachment ) => {
    return ( event ) => {
      event.preventDefault();
      if ( event.type === "keydown" && event.key !== "Enter" ) {
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
    Render.listen( "identities", Render.identities );
    fileInput.addEventListener( "change", Handle.inputFiles );
    return () => {
      Render.reset();
      fileInput.removeEventListener( "change", Handle.inputFiles );
    };
  });


  export function dragEnter( event ) {
    Handle.dragEnter( event );
  }
  export function dragLeave( event ) {
    Handle.dragLeave( event );
  }
  export function drop( event ) {
    Handle.drop( event );
  }
</script>





<div class="buttons">
  <h2>Attach Media</h2>

  <sl-button
    on:click={Handle.fileChrome}
    on:keydown={Handle.fileChromeKey}
    size="medium"
    class="submit"
    pill>
    Add Attachment
  </sl-button>
</div>


{#if attachments.length > 0 }
  <div 
    class="gobo-table">
    {#each attachments as attachment (attachment.name)}
      <div class="table-row">
        <div class="metadata">
          
          {#if Media.canPreview(attachment)}
            <a
              href="/upload-preview"
              on:click={Handle.preview( attachment )}
              on:keydown={Handle.preview( attachment )}>
              { attachment.name }
            </a>
          {:else}
            <p>{ attachment.name }</p>
          {/if}

          <p>
            Size: {filesize( attachment.size )}
          </p>
        </div>
        
        {#if Media.isImage(attachment.file)}
          <sl-icon-button
            class="warning"
            label="Edit Alt" 
            src="/icons/pencil-square.svg"
            on:click={Handle.edit( attachment )}
            on:keydown={Handle.edit( attachment )}>>
          </sl-icon-button>
        {/if}
        
        <sl-icon-button
          class="danger"
          label="Delete File" 
          src="/icons/trash.svg"
          on:click={Handle.delete( attachment )}
          on:keydown={Handle.delete( attachment )}>>
        </sl-icon-button>
      
      </div>
    {/each}
  </div>

  <sl-checkbox
    on:sl-change={Handle.sensitive}
    checked={options.sensitive}
    size="medium">
    Mark Media as Sensitive
  </sl-checkbox>
{/if}

<input 
  bind:this={fileInput}
  type="file"
  multiple=true
  class="hidden"
  accept={acceptTypes}
/>


<style>
  sl-checkbox {
    margin-top: var(--gobo-height-spacer-flex);
  }

  .gobo-table {
    min-height: 3rem;
    margin-top: var(--gobo-height-spacer-flex);
  }

  .table-row {
    display: flex;
    gap: 1rem;
  }

  .table-row > .metadata {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    justify-content: start;
    align-items: start;
  }

  .table-row > .metadata > a {
    word-break: break-all;
  }

  .table-row > .metadata > p {
    font-size: 1rem !important;
    margin: 0 !important;
  }

  .buttons {
    border-top: none;
    padding-top: 0;
    justify-content: space-between;
    align-items: center;
  }

  .buttons h2 {
    margin: 0 !important;
  }
</style>