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
  let files = [];
  let targetsReddit = false;


  const setIdentities = function () {
    for ( const key in draftData.identities ) {
      const identity = draftData.identities[ key ];
      const match = identities.find( i => i.key === identity.key );

      if ( match == null ) {
        console.log(JSON.stringify(identity, null, 2));
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

    console.log({ identities });
    console.log({ identitySwitches });

    // for ( const identity of identities) {
    //   identitySwitches[ identity.key ].checked = identity.active;
    // }
  };

  const setFiles = function () {
    files = draftData.files;
  }

  const setReddit = function () {
    for ( const identity of identities ) {
      if ( (identity.platform === "reddit") && (identity.active === true) ) {
        targetsReddit = true;
        return;
      }

      targetsReddit = false;
    }
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



  const addFile = function ( file ) {
    console.log( file.name, file );
    draft.update({ files: [ ...files, file ] });
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

  const handlePreview = function( file ) {
    return function ( event ) {
      event.preventDefault();
      preview.set( file );
      goto( "/upload-preview" );
    }
  }

  if ( browser ) {
    onMount( function () {
      unsubscribeScroll = scroll.subscribe( function ({ deltaY }) {
        configFrame.scrollBy( 0, deltaY );
      });

      unsubscribeDraft = draft.subscribe( function ( draft ) {
        draftData = draft;
        setIdentities();
        setFiles();
        setReddit();
      })

      // Pull in registered identities.
      draft.seed([
        { platform: "mastodon", account: "@username@instance.com" },
        { platform: "reddit", account: "u/username" },
        { platform: "twitter", account: "@username" }
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
      size="medium">
      Post Is Sensitive
    </sl-checkbox>

    <sl-select
      label="Post Visibility"
      help-text="This tells GOBO how public your post should be when it submits it to each platform."
      value="public"
      size="medium">
      <sl-option value="public">Public</sl-option>
      <sl-option value="followers">Followers Only</sl-option>
      <sl-option value="private">Private</sl-option>
    </sl-select>

    {#if targetsReddit === true }
      <sl-input
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
            src="/icons/trash.svg">
          </sl-icon-button>
        </div>
      {/each}
    </div>

    <sl-button
      variant="primary"
      size="medium">
      <sl-icon slot="prefix" src="/icons/file-earmark-plus.svg"></sl-icon>
      Add Attachment
    </sl-button>
  </section>

  <sl-divider class="gobo-divider"></sl-divider>




  <section class="panel">
    <h2>Preview</h2>
    <p>
      This section provides an approximation of how your posts will appear on
      on each platform once submitted. As you edit your post above, you can
      checkout these previews for feedback before publishing.
    </p>

    <div class="keyword-table"></div>
    <div class="keyword-table"></div>
    <div class="keyword-table"></div>
    
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
</style>

