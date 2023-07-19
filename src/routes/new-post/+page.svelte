<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import MastodonPreview from "$lib/components/MastodonPreview.svelte";
  import RedditPreview from "$lib/components/RedditPreview.svelte";
  import TwitterPreview from "$lib/components/TwitterPreview.svelte";
  import "$lib/styles/buttons.css";
  import { scrollStore } from "$lib/stores/scroll.js";
  import { draftStore } from "$lib/stores/post-draft.js";
  import { previewStore } from "$lib/stores/image-preview.js";
  import { getGOBOClient } from "$lib/helpers/account.js";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  // TODO: replace this placeholder. sort function import was orphaned by API refactor.
  const sort = function () {}


  let configFrame, draftData;
  let identities = [];
  let allEmpty;
  let identitySwitches = {};
  let options = {};
  let targets = {};
  let content = null;
  let files = [];
  let fileInput;


  const loadIdentities = async function () {
    const client = await getGOBOClient();
    let _identities;
    try {
      let body = await client.identityInfo();
      _identities = body.identities;
    } catch ( error ) {
      console.error( error );
      return;
    }

    if ( _identities.length === 0 ) {
      allEmpty = true;
    } else {
      allEmpty = false;
    }

    _identities = sort( _identities );
    
    // Sync the draft store with data from the GOBO API.

    // Remove any stored identities that GOBO doesn't know about.
    for ( const key in draftData.identities ) {
      const identity = draftData.identities[ key ]
      const match = _identities.find( x => x.key === Number( key ) );
      
      if ( match == null ) {
        delete draftData.identities[ key ];
      } else {
        // Allow stored active flag to take precedence.
        match.active = identity.active; 
      }
    }

    // Add any identities that the store doesn't know about.
    for ( const identity of _identities ) {
      let match = draftData.identities[ identity.key ];
      if ( match == null ) {
        draftData.identities[ identity.key ] = identity;
      } 
    }
    
    // Update both this component and the draft store.
    identities = _identities;
    draftStore.update({ identities: draftData.identities });
  };
  

  const nullEmpty = function ( value ) {
    if ( value == null ) {
      return null
    } else {
      if ( value.length === 0 ) {
        return null;
      } else {
        return value;
      }
    }
  }


  const setTargets = function () {
    const _targets = {}
    for ( const identity of identities ) {
      if ( identity.active === true ) {
        _targets[ identity.type ] = true;
      }
    }

    targets = _targets;
  }

  const setOptions = function () {
    options = draftData.options;
  }

  const setContent = function () {
    content = draftData.content;
  }

  const setFiles = function () {
    let resetFiles = false;
    const _files = [];
    
    for ( const file of draftData.files ) {
      if ( ! draftStore.isFile( file ) ) {
        resetFiles = true;
      } else {
        _files.push( file );
      }
    }

    if ( resetFiles === true ) {
      return draftStore.update({ files: _files });
    }

    files = draftData.files;
  }



  const handleIdentitySwitch = function ( identity ) {
    return function ( event ) {
      identity.active = event.target.checked;
      draftStore.updateIdentity({ [ identity.key ]: identity });
    }
  };



  const handleOptionSensitive = function ( event ) {
    draftStore.updateOption({ 
      sensitive: event.target.checked 
    });
  };

  const handleOptionVisibility = function ( event ) {
    draftStore.updateOption({
      visibility: event.target.value 
    });
  };

  const handleOptionSpoilerText = function ( event ) {
    draftStore.updateOption({ 
      spoilerText: nullEmpty( event.target.value )
    });
  };

  const handleOptionTitle = function ( event ) {
    draftStore.updateOption({
      title: nullEmpty( event.target.value )
    });
  };

  const handleOptionSubreddit = function ( event ) {
    draftStore.updateOption({
      subreddit: nullEmpty( event.target.value )
    });
  };



  const handleContent = function ( event ) {
    draftStore.update({ content: event.target.value });
  }



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




  if ( browser ) {
    onMount( function () {
      const unsubscribeScroll = scrollStore.subscribe( function ({ deltaY }) {
        configFrame.scrollBy( 0, deltaY );
      });

      const unsubscribeDraft = draftStore.subscribe( function ( draft ) {
        draftData = draft;
        setOptions();
        setTargets();
        setContent();
        setFiles();
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
        unsubscribeScroll();
        unsubscribeDraft();
        fileInput.removeEventListener( "change", listener );
      };
    });
  }

</script>

<div class="main-child">
  <h1>New Post</h1>

  <sl-divider></sl-divider>
  
  <form class="gobo-form" bind:this={configFrame}>
  
    <section class="panel body">
      <sl-select
        on:sl-change={handleOptionVisibility}
        name="visibility"
        value={options.visibility}
        size="medium"
        pill>
        <sl-option value="public">Public</sl-option>
        <sl-option value="followers">Followers Only</sl-option>
        <sl-option value="private">Private</sl-option>
      </sl-select>
  
      <sl-textarea
        on:sl-input={handleContent}
        value={content}
        placeholder="Compose your post here."
        size="medium"
        resize="none"
        rows=4>
      </sl-textarea>
    </section>
  
  
    <section class="panel media">
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
  
    </section>
  
  
    <section class="panel identities">
      <h2>Choose Identities</h2>
      
      <p>
        Select the identities below you'd like to use to create this post. GOBO
        will submit posts to these platforms on your behalf.
      </p>
  
  
      {#await loadIdentities()}
    
        <Spinner></Spinner>
    
      {:then}
        
        {#each identities as identity (identity.key)}
          <div class="identity">
            
            <div class="label">
              <sl-icon 
                src="/icons/{identity.type}.svg" 
                class="{identity.type}"
                size="medium">
              </sl-icon>
              {identity.prettyName}
            </div>
  
            <sl-switch
              bind:this={identitySwitches[ identity.key ]}
              checked={identity.active}
              on:sl-change={handleIdentitySwitch( identity )}
              size="medium">
            </sl-switch>
            
          </div>
        {/each}
      
      {/await}
     
    </section>
  
  
    {#if (targets.mastodon === true) || (targets.reddit === true) }
      <section class="panel options">
        <h2>Identity Specific Options</h2>
        <p>
          Below are some options to configure your post. They will be applied as
          appropriate when GOBO submits to each platform.
        </p>
      </section>
  
  
  
      {#if targets.mastodon === true }
        <section class="panel options">
          <div class="subheading">
            <sl-icon 
              src="/icons/mastodon.svg"
              class="mastodon">
            </sl-icon>
            <h3>Mastodon</h3>
          </div>
  
          <sl-input
            on:sl-input={handleOptionSpoilerText}
            value={options.spoilerText}
            label="Spoiler Text"
            help-text="Provide text that will contextualize content behind warning."
            autocomplete="off"
            size="medium">
          </sl-input>
        </section>
      {/if}
  
      {#if targets.reddit === true }
        <section class="panel options">
          <div class="subheading">
            <sl-icon 
              src="/icons/reddit.svg"
              class="reddit">
            </sl-icon>
            <h3>Reddit</h3>
          </div>
  
          <sl-input
            on:sl-input={handleOptionTitle}
            value={options.title}
            label="Post Title"
            help-text="Provide a title that will appear in your Reddit post."
            size="medium">
          </sl-input>
        
          <sl-input
            on:sl-input={handleOptionSubreddit}
            value={options.subreddit}
            label="Target Subreddit"
            help-text="This is the subreddit where GOBO will submit your post."
            size="medium">
          </sl-input>
        </section>
      {/if}
    {/if}
  
  
    <section class="panel preview">
      <h2>Preview</h2>
      <p>
        This section provides an approximation of how your posts will appear on
        on each platform once submitted. As you edit your post above, you can
        checkout these previews for feedback before publishing.
      </p>
    </section>
  
  
  
    <section class="panel extra-wide">
      {#if targets.mastodon === true}
        <h3 class="preview-header">Mastodon</h3>
        <MastodonPreview></MastodonPreview>
      {/if}
  
      {#if targets.reddit === true}
      <h3 class="preview-header">Reddit</h3>
        <RedditPreview></RedditPreview>
      {/if}
  
      {#if targets.twitter === true}
      <h3 class="preview-header">Twitter</h3>
        <TwitterPreview></TwitterPreview>
      {/if}
      
    </section>
  
  
    <section class="panel publish">
      <h2>Publish</h2>
      <p>
        Publish your post. GOBO will issue requests to each of the platforms 
        you specified.
      </p>
  
      <div class="buttons">
        <sl-button
          class="cancel"
          size="medium"
          pill>
          Discard Draft
        </sl-button>
  
        <sl-button
          class="submit"
          size="medium"
          pill>
          Publish
        </sl-button>
      </div>
     
    </section>
  
  </form>
</div>


<style>
  h1 {
    margin-bottom: var(--gobo-height-spacer-half);
  }

  sl-divider {
    margin-bottom: var(--gobo-height-spacer);
  }

  .gobo-form {
    margin-top: 0;
    padding: 0;
  }

  .gobo-form .panel > * {
    margin-bottom: 1rem;
  }

  .gobo-form .panel > :last-child {
    margin-bottom: 0;
  }

  .gobo-form .panel {
    padding: 0 var(--gobo-width-spacer) var(--gobo-height-spacer) var(--gobo-width-spacer);
    border-bottom: var(--gobo-border-panel);
  }

  .gobo-form .panel:first-child {
    padding-top: var(--gobo-height-spacer);
  }

  .gobo-form .panel:last-child {
    border-bottom: var(--gobo-height-spacer);
  }

  .gobo-form .panel h2 {
    font-size: var(--gobo-font-size-x-large);
    font-weight: var(--gobo-font-weight-medium);
  }

  .gobo-form .panel h3 {
    font-size: var(--gobo-font-size-large);
    font-weight: var(--gobo-font-weight-black);
  }



  .panel.body sl-select {
    align-self: flex-start;
    width: 12rem;
  }

  .panel.body sl-select::part(combobox) {
    font-weight: var(--gobo-font-weight-medium);
  }

  .panel.body sl-textarea::part(base) {
    font-size: 1.125rem;
    /* height: 7rem; */
    border-radius: var(--gobo-border-radius)
  }

  .panel.body sl-textarea::part(textarea) {
    padding: 1rem;
  }




  .panel.media .keyword-table {
    height: 20rem;
  }



  .panel.identities .identity {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    margin-bottom: 0;
    border-radius: var(--gobo-border-radius);
    border: var(--gobo-border-panel);
    margin-bottom: var(--gobo-height-spacer-half);
    padding: var(--gobo-height-spacer) var(--gobo-width-spacer);
  }

  .panel.identities .identity:last-child {
    margin-bottom: 0;
  }

  .panel.identities .identity > * {
    margin-bottom: 0;
  }

  .panel.identities .identity .label {
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  .panel.identities .identity sl-switch {
    margin-left: 0.25rem;
    margin-right: 0.5rem;
  }
  
  .panel.identities .identity sl-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }

  .panel.options .subheading {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .panel.options .subheading sl-icon {
    font-size: 1.25rem;
    margin-right: var(--gobo-width-spacer-half);
    margin-bottom: 0;
  }


  .panel.publish p {
    margin: 0;
  }

  .panel.publish .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
  }

  .panel.publish .buttons sl-button {
    margin-bottom: 0;
    width: 10rem;
  }

</style>

