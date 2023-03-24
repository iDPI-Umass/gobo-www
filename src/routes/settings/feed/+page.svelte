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
  import { browser } from "$app/environment";
  import { getGOBOClient } from "$lib/helpers/account";

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

<div class="main-child">
  <BackLink
    href="/settings"
    heading="Feed Settings">
  </BackLink>

  <form class="gobo-form" bind:this={keywordForm}>
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
              label="Delete Keyword" 
              src="/icons/trash.svg"></sl-icon-button>
          </div>
        {/each}
      </div>
    {/await}

    <sl-select
      bind:this={keywordCategory}
      name="category"
      value="source"
      label="Block Category"
      size="medium"
      pill>
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

    <div class="buttons">
      <sl-button
        bind:this={keywordButton}
        type="submit"
        class="submit"
        variant="primary"
        size="medium"
        pill>
        Add Keyword
      </sl-button>  
    </div>
    
  </form>
</div>


<style>
  .keyword-table sl-icon-button {
    color: var(--gobo-color-danger);
  }

  .keyword-table .keyword span {
    background: var(--gobo-color-active);
  }

  .gobo-form sl-select {
    align-self: flex-start;
    width: 10rem;
  }
</style>