<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/badge/badge.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Feed } from "$lib/engines/feed.js";
  import { Feed as Notifications } from "$lib/engines/notification.js";
  import * as notificationStores from "$lib/stores/notification.js";

  export let current;

  let notificationCount;
  const Render = State.make();
  Render.cleanup = () => {
    notificationCount = 0;
  };

  Render.count = ( value ) => {
    notificationCount = value.count;
  }


  const Handle = {};
  
  Handle.refreshHome = () => {
    if ( current === "home" ) {
      Feed.refresh();
    }
  };
  
  Handle.refreshNotifications = () => {
    if ( current === "notifications" ) {
      Notifications.refresh();
    }
  };

  Render.reset();
  onMount(() => {
    Render.listen( notificationStores.count, Render.count );
    return () => {
      Render.reset();
    };
  });
</script>

<footer>
  <nav>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-button
      pill
      href="/home"
      class="{current === "home" ? "current" : ""}"
      on:click={Handle.refreshHome}>
      <div slot="prefix">
        <sl-icon src="/icons/home.svg"></sl-icon>
      </div>
    </sl-button>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-button
      pill
      href="/notifications"
      class="notifications {current === "notifications" ? "current" : ""}"
      on:click={Handle.refreshNotifications}>
      <div slot="prefix">
        <sl-icon src="/icons/bell.svg" slot="prefix"></sl-icon>
        {#if notificationCount > 0}
          <sl-badge pill part="badge">{notificationCount}</sl-badge>
        {/if}
      </div>
    </sl-button>

    <sl-button
      pill
      href="/new-post"
      class="{current === "new post" ? "current" : ""}">
      <div slot="prefix">
        <sl-icon src="/icons/pencil-square.svg"></sl-icon>
      </div>
    </sl-button>

    <!-- <sl-button
      <sl-icon src="/icons/search.svg"></sl-icon>
      href="/search"></sl-button> -->

    <sl-button
      pill
      href="/posts"
      class="{current === "posts" ? "current" : ""} posts">
      <div slot="prefix">
        <sl-icon src="/icons/send.svg"></sl-icon>
      </div>
    </sl-button>

    <sl-button
      pill
      href="/settings"
      class="{current === "settings" ? "current" : ""}">
      <div slot="prefix">
        <sl-icon src="/icons/gear.svg"></sl-icon>
      </div>
    </sl-button>

  </nav>
</footer>


<style>
  footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: var(--gobo-color-panel);
    border-top: var(--gobo-border-panel);
    z-index: 10;
  }


  footer > nav {
    flex: 1 0 100%;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  footer > nav > sl-button {
    margin: 6px 0 12px 0;
    font-size: 26px;
    color: var(--gobo-color-text);
  }

  footer > nav > sl-button::part(base):hover,
  footer > nav > sl-button::part(base):focus {
    color: var(--gobo-color-text);
  }


  nav > sl-button::part(base) {
    height: 2.375rem;
    padding: 0.333rem 1rem;
    height: 100%;
    background: var(--gobo-color-panel);
    color: var(--gobo-color-text-menu);
    border: none;
  }

  nav > sl-button::part(label) {
    padding: 0;
    font-size: var(--gobo-font-size-large);
    font-weight: var(--gobo-font-weight-medium);
  }

  nav > sl-button::part(prefix) {
    width: 1.625rem;
    height: 1.625rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin-right: 0;
  }

  nav > sl-button::part(prefix) {
    font-size: 1.25rem; 
  }

  nav > .current::part(base) {
    background: var(--gobo-color-null);
  }

  nav > .current::part(label) {
    position: relative;
    font-weight: var(--gobo-font-weight-black);
  }

  nav > .current::part(base)::before {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 10%;
    height: 4px;
    width: 80%;
    border-radius: 4px;
    background: var(--gobo-color-primary);
  }

  /* This is awful, but including the badge is messing up the alignment across
      the buttons. "top" is accessing more vertical space than the others.
      and needing a container to be the badge parent and button prefix slot
      is awkward. There's probaby a better way to do to this. */
  nav :global(sl-icon) {
    margin-top: 0.75rem;
  }

  nav > .notifications :global(sl-badge) {
    position: absolute;
    top: 0;
    right: 3%;
  }

  nav > .notifications :global(sl-badge::part(base)) {
    color: #FFFFFF;
    font-weight: var(--gobo-font-weight-black);
    border: none;
  }

  @media ( min-width: 750px ) {
    footer {
      display: none;
    }
  }
</style>