<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { scroll } from "$lib/stores/scroll.js";

  let configFrame, unsubscribeScroll;
  let files = [];
  let targetsReddit = false;

  const identities = [
    { platform: "mastodon", account: "@username@instance.com", active: false },
    { platform: "reddit", account: "u/username", active: false },
    { platform: "twitter", account: "@username", active: false }
  ];

  const mastodons = [];
  const reddits = [];
  const twitters = [];
  
  for ( const i of identities ) {
    if ( i.platform === "mastodon" )  {
      mastodons.push( i );
    }
    if ( i.platform === "reddit" )  {
      reddits.push( i );
    }
    if ( i.platform === "twitter" )  {
      twitters.push( i );
    }
  }

  const handleRedditSwitch = function ( account ) {
    return function ( event ) {
      let match = reddits.find( r => r.account === account );
      if ( match != null ) {
        match.active = event.target.checked
      }

      for ( const reddit of reddits ) {
        if ( reddit.active === true ) {
          targetsReddit = true;
          return;
        }
        targetsReddit = false;
      }
    }
  };

  files.push({ path: "/example.png" })

  if ( browser ) {
    onMount( function () {
      unsubscribeScroll = scroll.subscribe( function ({ deltaY }) {
        configFrame.scrollBy( 0, deltaY );
      })
    });;

    onDestroy( function () {
      unsubscribeScroll();
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

    {#each mastodons as mastodon (mastodon.account)}
      <div class="identity">
        <sl-switch
          size="medium">
        </sl-switch>
        <sl-icon src="/icons/mastodon.svg" style="color:var(--gobo-mastodon);"></sl-icon>{mastodon.account}
      </div>
    {/each}

    {#each reddits as reddit (reddit.account)}  
      <div class="identity">
        <sl-switch
          on:sl-change={handleRedditSwitch( reddit.account )}
          size="medium">
        </sl-switch>
        <sl-icon src="/icons/reddit.svg" style="color:var(--gobo-reddit);"></sl-icon>{reddit.account}
      </div>
    {/each}

    {#each twitters as twitter (twitter.account)}
      <div class="identity">
        <sl-switch
          size="medium">
        </sl-switch>
        <sl-icon src="/icons/twitter.svg" style="color:var(--gobo-twitter);"></sl-icon>{twitter.account}
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

    <sl-checkbox>
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
    <h2>Attach Media</h2>
    <p>
      Attach media files to be associated with this post. GOBO will submit
      these to each platform on your behalf.
    </p>

    <div class="keyword-table">
      {#each files as file (file.path)}
        <div class="table-row">
          <sl-icon-button
            class="primary"
            label="Preview File" 
            src="/icons/search.svg">
          </sl-icon-button>
          <span>{ file.path }</span>
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
    <h2>Write Text</h2>
    <p>
      If your post contains text, you can compose it here. GOBO will submit
      this to each platform on your behalf.
    </p>

    <sl-textarea
      label="Post Body"
      size="large">
    </sl-textarea>
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
    <h2>Continue</h2>
    <p>
      Almost there! Once everything is ready, click Continue below. GOBO will
      ready your posts for submission and get a final approval to submit posts
      on your behalf.
    </p>

    <sl-button
      class="continue-button"
      variant="primary"
      size="large">
      Preview
    </sl-button>
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

  sl-button  {
    align-self: flex-end;
  }

  sl-button.continue-button {
    align-self: stretch;
  }
</style>

