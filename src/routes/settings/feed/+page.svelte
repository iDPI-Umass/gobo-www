<script>
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/switch/switch.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
  import "@shoelace-style/shoelace/dist/components/radio-button/radio-button.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import  "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onDestroy, onMount } from "svelte";
  import { scrollStore } from "$lib/stores/scroll.js";
  import { browser } from "$app/environment";
  import { getGOBOClient } from "$lib/helpers/account";
  let configFrame, unsubscribeScroll;

  if ( browser ) {
    onMount( function () {
      unsubscribeScroll = scrollStore.subscribe( function ({ deltaY }) {
        configFrame.scrollBy( 0, deltaY );
      });
    });

    onDestroy( function () {
      unsubscribeScroll();
    });
  }


  
  let keywordForm, keywordCategory, keywords, keywordButton;

  const loadKeywords = async function () {
    const client = await getGOBOClient();
    const result = await client.getBlockedKeywords();
    keywords = result.keywords;
  };

  const addKeyword = async function () {
    const client = await getGOBOClient();
    const data = new FormData( keywordForm );
    const category = data.get( "category");
    const word = data.get( "word" );
    
    try {
      await client.addBlockedKeyword({
        parameters: { category, word }
      });

      keywords = [ ...keywords, { category, word } ];
      keywordForm.reset();
      keywordCategory.value = "source";
    
    } catch ( error ) {
      // TODO: Visually represent an error here.
      console.error( error );
    }

    
    keywordButton.loading = false;
  };

  const removeKeyword = function ( keyword ) {
    return async function () {
      const client = await getGOBOClient();

      try {
        await client.deleteBlockedKeyword({
          parameters: {
            category: keyword.category,
            word: keyword.word
          }
        });

        keywords.splice( keyword.index, 1 );
        keywords = keywords;
      
      } catch ( error ) {
        // TODO: Visually represent an error here.
        console.error( error );
      }
    };
  }

  if ( browser ) {
    onMount( function () {
      keywordForm.addEventListener( "submit", async function ( event ) {
        event.preventDefault();
        if ( keywordButton.loading !== true ) {
          keywordButton.loading = true;
          await addKeyword();
        }
      });
    });
  }




  // TODO: below is code for fields that were placeholders fields at first 
  //   before being deferred. Integrate this at some point, or delete.

  // import { feedStore } from "$lib/stores/feed-config.js";
  // let unsubscribeConfig;
  // let sortSelect, defaultFeedSort;
  // let engagementSwitch, displayEngagement;  
  // if ( browser ) {
  //   unsubscribeConfig = feedStore.subscribe( function  ( config ) {
  //     defaultFeedSort = feedStore.defaultFeedSort;
  //     displayEngagement = feedStore.displayEngagement;
  //   });

  //   onMount( function () {
  //     sortSelect.addEventListener( "sl-change", function ( event ) {
  //       feedStore.setDefaultFeedSort( event.target.value );
  //     });

  //     engagementSwitch.addEventListener( "sl-change", function ( event ) {
  //       feedStore.setDisplayEngagement( event.target.checked );
  //     });

  //     unsubscribeScroll = scrollStore.subscribe( function ({ deltaY }) {
  //       configFrame.scrollBy( 0, deltaY );
  //     });
  //   });

  //   onDestroy( function () {
  //     unsubscribeConfig();
  //     unsubscribeScroll();
  //   });
  // }

  // let accounts = [
  //   { platform: "reddit", account: "u/ProjectOlio" },
  //   { platform: "mastodon", account: "@molly0xfff@hachyderm.io" },
  //   { platform: "twitter", account: "@meakoopa" }
  // ]
</script>

<section class="gobo-config-frame" bind:this={configFrame}>
  <BackLink
    href="/settings"
    heading="Feed Settings">
  </BackLink>

  <section class="panel">
    <h2>Blocked Keywords</h2>
    <p>
      Control which words and phrases you would like to exclude from your 
      GOBO feed. You can add phrases below or delete any listed in the table.
    </p>
    
    {#await loadKeywords()}
      <Spinner></Spinner>
    {:then}
      <div class="keyword-table">
        {#each keywords as keyword, index (`${keyword.category}${keyword.word}`)}
          <div class="table-row">
            <span class="keyword">
              <span>{ keyword.category }</span>
            </span>
            <span class="phrase">{ keyword.word }</span>
            <sl-icon-button
              on:click={removeKeyword({ ...keyword, index })}
              on:keypress={removeKeyword({ ...keyword, index })}
              class="danger"
              label="Delete Keyword" 
              src="/icons/trash.svg"></sl-icon-button>
          </div>
        {/each}
      </div>
    {/await}

    <form bind:this={keywordForm} class="gobo-form">
      <sl-select
        bind:this={keywordCategory}
        name="category"
        value="source"
        label="Block Category"
        size="medium">
        <sl-option value="source">Source</sl-option>
        <sl-option value="username">Username</sl-option>
        <sl-option value="keyword">Keyword</sl-option>
        <sl-option value="url">URL</sl-option>
      </sl-select>
      
      <sl-input
        name="word"
        label="Block Pattern"
        help-text="GOBO will match against this text to block targeted content from your feed."
        autocomplete="off"
        size="medium">
      </sl-input>

      <sl-button
        bind:this={keywordButton}
        type="submit"
        variant="primary"
        size="medium">
        Add Keyword
      </sl-button>
    </form>
  </section>

  <sl-divider class="gobo-divider"></sl-divider>

  <!-- <section class="panel">
    <h2>Default Sorting</h2>
    <p>
      Set the default sort behavior for your Home Feed.
    </p>
    

    <sl-select
      bind:this={sortSelect}  
      name="feed-sort"
      value="{defaultFeedSort}"
      size="medium">
      <sl-option value="chronological-descending">Newest to Oldest</sl-option>
      <sl-option value="chronological-ascending">Oldest to Newest</sl-option>
      <sl-option value="popular-descending">Most Popular</sl-option>
      <sl-option value="by-platform">Prioritized By Platform</sl-option>
    </sl-select>
  </section>

  <sl-divider class="gobo-divider"></sl-divider>

  <section class="panel">
    <h2>Display Engagement</h2>
    <p>
      Control whether you'd like to see engagement feedback values on posts
      displayed in GOBO.
    </p>
    

    <sl-switch
      bind:this={engagementSwitch}
      checked={displayEngagement}
      size="medium">
      Display Engagement Metrics
    </sl-switch>
  </section>

  <sl-divider class="gobo-divider"></sl-divider>

  <section class="panel">
    <h2>Prioritized Accounts</h2>
    <p>
      Control which accounts you would like GOBO to emphasize when preparing
      your feed. You can add accounts below or delete any listed in the table.
    </p>
    
    <div class="keyword-table">
      {#each accounts as account (account.account)}
        <div class="table-row">
          <sl-icon 
            src="/icons/{ account.platform }.svg" 
            style="color: var(--gobo-{account.platform});">
          </sl-icon>
          <span>{ account.account }</span>
          <sl-icon-button
            class="danger"
            label="Delete Keyword" 
            src="/icons/trash.svg"></sl-icon-button>
        </div>
      {/each}
    </div>

    <form bind:this={keywordForm} class="gobo-form">
      <sl-select
        name="prioritized-account-platform"
        label="Platform"
        value="mastodon"
        size="medium">
        <sl-option value="mastodon">Mastodon</sl-option>
        <sl-option value="reddit">Reddit</sl-option>
        <sl-option value="twitter">Twitter</sl-option>
      </sl-select>

      <sl-input
        name="prioritized-account"
        label="Account"
        size="medium"></sl-input>

      <sl-button
        type="submit"
        variant="primary"
        size="medium">
        Add Account
      </sl-button>
    </form>
  </section>

  <sl-divider class="gobo-divider"></sl-divider> -->
</section>

<style>

</style>