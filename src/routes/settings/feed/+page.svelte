<script>
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
  import { onDestroy, onMount } from "svelte";
  import { config } from "$lib/stores/feed-config.js";
  import { scroll } from "$lib/stores/scroll.js";
  import { browser } from "$app/environment";
  let unsubscribeConfig;
  let configFrame, unsubscribeScroll;
  let sortSelect, defaultFeedSort;
  let engagementSwitch, displayEngagement;
  let keywordForm;
  
  if ( browser ) {
    unsubscribeConfig = config.subscribe( function  ( config ) {
      defaultFeedSort = config.defaultFeedSort;
      displayEngagement = config.displayEngagement;
    });

    onMount( function () {
      sortSelect.addEventListener( "sl-change", function ( event ) {
        config.setDefaultFeedSort( event.target.value );
      });

      engagementSwitch.addEventListener( "sl-change", function ( event ) {
        config.setDisplayEngagement( event.target.checked );
      });

      unsubscribeScroll = scroll.subscribe( function ({ deltaY }) {
        configFrame.scrollBy( 0, deltaY );
      });
    });

    onDestroy( function () {
      unsubscribeConfig();
      unsubscribeScroll();
    });
  }

  let words = [ 
    "list", 
    "of", 
    "all", 
    "blocked", 
    "keywords", "super long phrase that will not fit within one width because it is impossibly long"
  ];

  let accounts = [
    { platform: "reddit", account: "u/ProjectOlio" },
    { platform: "mastodon", account: "@molly0xfff@hachyderm.io" },
    { platform: "twitter", account: "@meakoopa" }
  ]
</script>

<section class="gobo-config-frame" bind:this={configFrame}>
  <BackLink
    href="/settings"
    heading="Feed Settings">
  </BackLink>

  <section class="panel">
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
      displayed in Gobo.
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
    <h2>Blocked Keywords</h2>
    <p>
      Control which words and phrases you would like to exclude from your 
      Gobo feed. You can add phrases below or delete any listed in the table.
    </p>
    
    <div class="keyword-table">
      {#each words as word (word)}
        <div class="table-row">
          <span>{ word }</span>
          <sl-icon-button
            class="danger"
            label="Delete Keyword" 
            src="/icons/trash.svg"></sl-icon-button>
        </div>
      {/each}
      </div>

    <form bind:this={keywordForm} class="gobo-form">
      <sl-input
        name="blocked-keyword"
        size="medium"></sl-input>

      <sl-button
        type="submit"
        variant="primary"
        size="medium">
        Add Keyword
      </sl-button>
    </form>
  </section>

  <sl-divider class="gobo-divider"></sl-divider>

  <section class="panel">
    <h2>Prioritized Accounts</h2>
    <p>
      Control which accounts you would like Gobo to emphasize when preparing
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

  <sl-divider class="gobo-divider"></sl-divider>
</section>

<style>

</style>