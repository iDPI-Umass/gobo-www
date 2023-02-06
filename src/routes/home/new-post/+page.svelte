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
  import MastodonPreview from "$lib/components/MastodonPreview.svelte";
  import RedditPreview from "$lib/components/RedditPreview.svelte";
  import TwitterPreview from "$lib/components/TwitterPreview.svelte";
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { scroll } from "$lib/stores/scroll.js";
  import { draft } from "$lib/stores/post-draft.js";
  import { preview } from "$lib/stores/image-preview.js";

  let configFrame, unsubscribeScroll;
  let draftData, unsubscribeDraft;
  let identities = [];
  let identitySwitches = {};
  let options = {};
  let targets = {};
  let content = null;
  let files = [];
  let fileInput;
  


  const setIdentities = function () {
    for ( const key in draftData.identities ) {
      const identity = draftData.identities[ key ];
      const match = identities.find( i => i.key === identity.key );

      if ( match == null ) {
        identities.push( identity );
      } else {
        match.active = identity.active;
      }
    }

    identities.sort( function ( A, B ) {
      if ( A.key < B.key ) {
        return -1;
      } else {
        return 1;
      }
    });

    identities = identities;
  };

  const setTargets = function () {
    const _targets = {}

    for ( const identity of identities ) {
      if ( identity.active === true ) {
        _targets[ identity.platform ] = true;
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
      if ( ! draft.isFile( file ) ) {
        resetFiles = true;
      } else {
        _files.push( file );
      }
    }

    if ( resetFiles === true ) {
      return draft.update({ files: _files });
    }

    files = draftData.files;
  }



  const handleIdentitySwitch = function ( identity ) {
    return function ( event ) {
      draft.updateIdentity({
        [ identity.key ]: { 
          ...identity, 
          active: event.target.checked 
        }
      });
    }
  };



  const handleOptionSensitive = function ( event ) {
    draft.updateOption({ 
      sensitive: event.target.checked 
    });
  };

  const handleOptionVisibility = function ( event ) {
    draft.updateOption({
      visibility: event.target.value 
    });
  };

  const handleOptionTitle = function ( event ) {
    draft.updateOption({
      title: event.target.value 
    });
  };

  const handleOptionSubreddit = function ( event ) {
    draft.updateOption({
      subreddit: event.target.value 
    });
  };



  const handleContent = function ( event ) {
    draft.update({ content: event.target.value });
  }



  const addFile = function ( file ) {
    let match = files.find( f => f.name === file.name );

    if ( match == null ) {
      draft.update({ files: [ ...files, file ] });
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
      preview.set( file );
      goto( "/upload-preview" );
    }
  };

  const handleDelete = function ( file ) {
    return function ( event ) {
      event.preventDefault();
      const index = files.findIndex( f => f.name === file.name );

      if ( index >= 0 ) {
        files.splice( index, 1 );
        draft.update({ files });
      }
    }
  };




  if ( browser ) {
    onMount( function () {
      unsubscribeScroll = scroll.subscribe( function ({ deltaY }) {
        configFrame.scrollBy( 0, deltaY );
      });

      unsubscribeDraft = draft.subscribe( function ( draft ) {
        draftData = draft;
        setIdentities();
        setOptions();
        setTargets();
        setContent();
        setFiles();
      });

      fileInput.addEventListener( "change", function () {
        const _files = fileInput.files;
        if ( _files.length > 0 ) {
          for ( const file of _files ) {
            addFile( file );
          }
          fileInput.value = null;
        }
      });

      // Pull in registered identities.
      draft.seed([
        { platform: "mastodon", account: "@username@instance.com", name: "Username" },
        { platform: "reddit", account: "u/username", name: "Username" },
        { platform: "twitter", account: "@username", name: "Username" }
      ]);
    });;

    onDestroy( function () {
      unsubscribeScroll();
      unsubscribeDraft();
    });
  }

</script>

<section class="gobo-config-frame" bind:this={configFrame}>
  <h1>New Post</h1>

  <section class="panel">
    <h2>Choose Identities</h2>
    <p>
      Select the identities below you'd like to use to create this post. GOBO
      will submit posts to these platforms on your behalf.
    </p>

    {#each identities as identity (identity.key)}
      <div class="identity">
        <sl-switch
          bind:this={identitySwitches[ identity.key ]}
          checked={identity.active}
          on:sl-change={handleIdentitySwitch( identity )}
          size="medium">
        </sl-switch>
        <sl-icon 
          src="/icons/{identity.platform}.svg" 
          style="color:var(--gobo-{identity.platform});"
          size="medium">
        </sl-icon>
        {identity.account}
      </div>
    {/each}
   
  </section>

  <sl-divider class="gobo-divider"></sl-divider>




  <section class="panel">
    <h2>Set Options</h2>
    <p>
      Below are some options to configure your post. They will be applied as
      appropriate when GOBO submits to each platform.
    </p>

    <sl-checkbox
      on:sl-change={handleOptionSensitive}
      checked={options.sensitive}
      size="medium">
      Post Is Sensitive
    </sl-checkbox>

    <sl-select
      on:sl-change={handleOptionVisibility}
      value={options.visibility}
      label="Post Visibility"
      help-text="This tells GOBO how public your post should be when it submits it to each platform."
      size="medium">
      <sl-option value="public">Public</sl-option>
      <sl-option value="followers">Followers Only</sl-option>
      <sl-option value="private">Private</sl-option>
    </sl-select>

    {#if targets.reddit === true }
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
    {/if}
  </section>

  <sl-divider class="gobo-divider"></sl-divider>


  <section class="panel">
    <h2>Write Text</h2>
    <p>
      If your post contains text, you can compose it here. GOBO will submit
      this to each platform on your behalf.
    </p>

    <sl-textarea
      on:sl-input={handleContent}
      value={content}
      label="Post Body"
      size="medium"
      rows=12>
    </sl-textarea>
  </section>

  <sl-divider class="gobo-divider"></sl-divider>


  <section class="panel">
    <h2>Attach Media</h2>
    <p>
      Attach media files to be associated with this post. GOBO will submit
      these to each platform on your behalf.
    </p>

    <div 
      class="keyword-table" 
      ondragover="return false" 
      on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}>
      {#each files as file (file.name)}
        <div class="table-row">
          <sl-icon-button
            class="primary"
            label="Preview File" 
            src="/icons/search.svg"
            on:click={handlePreview( file )}
            on:keypress={handlePreview( file )}>
          </sl-icon-button>
          <span>{ file.name }</span>
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

    <sl-button
      on:click={handleFileChrome}
      on:keypress={handleFileChromeKey}
      variant="primary"
      size="medium">
      <sl-icon slot="prefix" src="/icons/file-earmark-plus.svg"></sl-icon>
      Add Attachment
    </sl-button>

    <input 
      bind:this={fileInput}
      type="file"
      multiple=true
      class="hidden">
  </section>

  <sl-divider class="gobo-divider"></sl-divider>




  <section class="panel">
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

  <sl-divider class="gobo-divider"></sl-divider>




  <section class="panel">
    <h2>Publish</h2>
    <p>
      Publish your post. GOBO will issue requests to each of the platforms 
      you specified.
    </p>

    <div class="buttons">
      <sl-button
        class="discard-button"
        variant="danger"
        size="medium">
        Discard Draft
      </sl-button>

      <sl-button
        class="publish-button"
        variant="primary"
        size="medium">
        Publish
      </sl-button>
    </div>
   
  </section>

  <sl-divider class="gobo-divider"></sl-divider>
</section>

<style>
  .panel.extra-wide {
    max-width: unset;
  }

  .identity {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    height: 3rem;
  }

  .identity > sl-switch {
    margin-left: 0.25rem;
    margin-right: 0.5rem;
  }

  .identity > sl-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }

  .panel > .identity {
    margin-bottom: 0;
  }

  .hidden {
    display: none;
  }

  sl-button {
    align-self: flex-end;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  h3.preview-header {
    margin-bottom: 0.5rem;
  }
</style>

