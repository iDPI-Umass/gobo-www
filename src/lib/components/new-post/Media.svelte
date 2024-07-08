<script>
  import { filesize } from "filesize";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { State, Draft, Options, Media } from "$lib/engines/draft.js";
  import { Thread } from "$lib/engines/thread.js";
  import { DraftFile } from "$lib/engines/draft-file.js";
  import { Platforms } from "$lib/engines/platforms/index.js";
  import * as Helpers from "$lib/engines/platforms/helpers.js";
  import { previewStore } from "$lib/stores/image-preview.js";
  import { altStore } from "$lib/stores/alt-store.js"

  let fileInput;
  let options, attachments, thread, slots, acceptTypes;
  const Render = State.make();

  Render.cleanup = () => {
    options = {};
    attachments = [];
    thread = [];
    slots = [];
    acceptTypes = "";
  };

  Render.cycle = ( draft ) => {
    for ( const attachment of draft.attachments ) {
      if ( !DraftFile.isType(attachment) && !Media.isFile( attachment.file )) {
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

  Render.thread = ( draft ) => {
    thread = draft.thread;
    slots = Helpers.unroll( draft );
  };


  const File = {};

  File.add = ( file ) => {
    const draftFile = DraftFile.fromFile( file );
    altStore.set( draftFile );
    goto("/new-post/alt");
  };

  // TODO: This is similar to the reconcilation we do on the confirmation 
  // page, but there's also a focus on the alt text there. Do want to try to
  // merge these two flows together. And how does alt text fit into the
  // reconcilation? Should we move alt text over to a replacing file?
  File.addMany = ( files ) => {
    for ( const file of files ) {
      const draftFile = DraftFile.fromFile( file )
      const index = attachments.findIndex( a => a.name === draftFile.name );
      const match = attachments[ index ];
      const headRow = thread[0] ?? [];
    
      if ( !match ) {
        attachments.push( draftFile );
        for ( const item of headRow ) {
          item.attachments.push( draftFile.id );
        }
      
      } else if ( draftFile.file?.lastModified !== match.file?.lastModified ) {
        attachments.splice( index, 1 );
        for ( const item of headRow ) {
          const _index = headRow.attachments.findIndex( id => id === match.id );
          if ( _index > -1 ) {
            item.attachments.splice( _index, 1, draftFile.id );
          }
        }
      }
    }
    
    // Update the state in the draft structure.
    Draft.updateAspect( "attachments", attachments );
    Draft.updateAspect( "thread", thread );
  }

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
      if (event.type === "keydown" && event.key !== "Enter" ) {
        return;
      }
      event.preventDefault();
      previewStore.set( attachment );
      goto( "/upload-preview" );
    }
  };
  
  Handle.delete = ( attachment ) => {
    return ( event ) => {
      if (event.type === "keydown" && event.key !== "Enter" ) {
        return;
      }
      event.preventDefault();
      const index = attachments.findIndex( a => a.name === attachment.name );
      if ( index >= 0 ) {
        attachments.splice( index, 1 );
        Draft.updateAspect( "attachments", attachments );
      }
    }
  };
  
  Handle.edit = ( attachment ) => {
    return ( event ) => {
      if (event.type === "keydown" && event.key !== "Enter" ) {
        return;
      }
      event.preventDefault();
      altStore.set( attachment );
      goto("/new-post/alt");
    };
  }

  Handle.anchorClick = ( item, file ) => {
    return ( event ) => {
      if (event.type === "keydown" && event.key !== " " ) {
        return;
      }
      event.preventDefault();
      
      if ( item.attachments.includes(file.id) ) {
        Anchor.remove( item, file );
      } else {
        Anchor.add( item, file );
      }

      // Only update the thread once we're done editing this metadata.
      Draft.updateAspect( "thread", thread );
    };
  };


  // TODO: this probably belongs in the Thread engine. I don't want to broadcast
  // from these functions because you might have multiple edits to make.
  const Anchor = {};

  Anchor.add = ( item, file ) => {
    const match = Thread.find( thread, item.index, item.platform );
    if ( match == null ) {
      console.warn( `unable to match on thread slot ${item.index} ${item.platform}` );
      return;
    }
    match.attachments.push( file.id );
  };

  Anchor.remove = ( item, file ) => {
    const match = Thread.find( thread, item.index, item.platform );
    if ( match == null ) {
      console.warn( `unable to match on thread slot ${item.index} ${item.platform}` );
      return;
    }
    const index = match.attachments.findIndex( id => id === file.id );
    if ( index > -1 ) {
      match.attachments.splice( index, 1 );
    }
  };



  Render.reset();
  onMount(() => {
    Render.listen( "attachments", Render.cycle );
    Render.listen( "options", Render.options );
    Render.listen( "identities", Render.identities );
    Render.listen( "thread", Render.thread );
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
          
          {#if attachment?.size}
            <p>
              Size: {filesize( attachment.size )}
            </p>
          {/if}

          <div class="anchors">
            {#each slots as item (`${item.platform}${item.index}`)}
              <div class="anchor">
                <sl-checkbox
                  on:click={Handle.anchorClick(item, attachment)}
                  on:keydown={Handle.anchorClick(item, attachment)}
                  checked={item.attachments.includes(attachment.id)}
                ></sl-checkbox>  
                <sl-icon src="/icons/{ item.platform }.svg" class="{ item.platform }"></sl-icon>
                <div class="subscript">{item.index + 1}</div>
              </div>
            {/each}
          </div>
        </div>
        
        {#if Media.isImage(attachment)}
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

  .table-row > .metadata > .anchors {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gobo-width-spacer-flex);
  }

  .table-row > .metadata > .anchors > .anchor {
    display: flex;
    height: 1.75rem;
  }
  .table-row > .metadata > .anchors > .anchor > sl-checkbox {
    margin: 0;
    align-self: start;
  }
  .table-row > .metadata > .anchors > .anchor > sl-checkbox::part(control) {
    background: var(--gobo-color-panel);
  }
  .table-row > .metadata > .anchors > .anchor > sl-checkbox::part(control--checked) {
    background: var(--gobo-color-primary);
  }
  .table-row > .metadata > .anchors > .anchor > sl-icon {
    margin: 0;
    margin-top: 0.25rem;
    align-self: start;
    font-size: 1.1rem;
  }
  .table-row > .metadata > .anchors > .anchor > .subscript {
    align-self: end;
    font-size: var(--gobo-font-size-detail);
  }

  /* .table-row > .metadata > .anchors > .anchor {
    display: flex;
  } */

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