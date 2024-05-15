<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/badge/badge.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Identity } from "$lib/engines/identity.js";
  import { Filter } from "$lib/engines/filter.js";
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
  };


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

<nav>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <sl-button
    class="home {current === 'home' ? "current" : ""}"
    pill
    href="/home"
    on:click={Handle.refreshHome}>
    <div slot="prefix">
      <sl-icon class="home" src="/icons/home.svg" slot="prefix"></sl-icon>
    </div>
    Home
  </sl-button>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <sl-button
    class="notifications {current === "notifications" ? "current" : ""}"
    pill
    href="/notifications"
    on:click={Handle.refreshNotifications}>
    <div slot="prefix">
      <sl-icon class="notifications" src="/icons/bell.svg" slot="prefix"></sl-icon>
      {#if notificationCount > 0}
        <sl-badge pill part="badge">{notificationCount}</sl-badge>
      {/if}
    </div>
    Notifications
  </sl-button>  

  <sl-button
    class="posts {current === "posts" ? "current" : ""}"
    pill
    href="/posts">
    <div slot="prefix">
      <sl-icon src="/icons/send.svg" slot="prefix"></sl-icon>
    </div>
    Posts
  </sl-button>

  <sl-button
    class="settings {current === "settings" ? "current" : ""}"
    pill
    href="/settings">
    <div slot="prefix">
      <sl-icon class="settings" src="/icons/gear.svg" slot="prefix"></sl-icon>
    </div>
    Settings
  </sl-button>

  <sl-button
    class="cta"
    pill
    href="/new-post">
    <div slot="prefix">
      <sl-icon slot="prefix" src="/icons/pencil-square.svg"></sl-icon>
    </div>
    New Post
  </sl-button>
</nav>

<style>
  nav {
    display: none;
    background: var(--gobo-color-panel);
    border-right: var(--gobo-border-panel);
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0;
    padding: var(--gobo-width-spacer);
    z-index: 10;
  }

  nav > sl-button {
    width: 100%;
    margin-bottom: var(--gobo-height-spacer);
  }

  nav > sl-button::part(base) {
    height: 2.375rem;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background: var(--gobo-color-panel);
    color: var(--gobo-color-text-menu);
    border: none;
  }

  nav > sl-button::part(label) {
    display: none;
  }

  nav > sl-button::part(prefix) {
    position: relative;
    width: 3rem;
    height: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }

  nav > .home::part(prefix) {
    font-size: 1.25rem; 
  }

  nav > .notifications::part(prefix) {
    font-size: 1.25rem;
  }

  nav > .posts::part(prefix) {
    font-size: 1.25rem; 
  }

  nav > .settings::part(prefix) {
    font-size: 1.25rem; 
  }

  nav > .cta::part(base) {
    background: var(--gobo-color-primary);
    color: var(--gobo-color-primary-text);
    border: 1px solid var(--gobo-color-primary);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
  }

  nav > .cta::part(prefix) {
    font-size: 1.25rem;
  }

  nav > .cta::part(label) {
    color: #FFFFFF;
    font-weight: var(--gobo-font-weight-black);
    padding-right: 0;
  }

  nav > .current::part(base) {
    background: var(--gobo-color-null);
  }

  nav > .current::part(label) {
    position: relative;
    font-weight: var(--gobo-font-weight-black);
  }

  nav > .current::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 10%;
    width: 4px;
    height: 80%;
    border-radius: 4px;
    background: var(--gobo-color-primary);
  }

  /* This is awful, but including the badge is messing up the alignment across
      the buttons. "top" is accessing more vertical space than the others.
      and needing a container to be the badge parent and button prefix slot
      is awkward. There's probaby a better way to do to this. */
  nav :global(sl-icon) {
    margin-top: 0.65rem;
    margin-left: 0;
  }

  nav :global(sl-icon.home) {
    margin-top: 0.65rem;
    margin-left: 0.1rem;
  }

  nav :global(sl-icon.notifications) {
    margin-top: 0.65rem;
    margin-left: 0.1rem;
  }

  nav :global(sl-icon.settings) {
    margin-top: 0.65rem;
    margin-left: 0.1rem;
  }

  nav > .notifications :global(sl-badge) {
    position: absolute;
    top: -25%;
    right: 0;
  }

  nav > .notifications :global(sl-badge::part(base)) {
    color: #FFFFFF;
    font-weight: var(--gobo-font-weight-black);
    border: none;
  }

  @media ( min-width: 1300px ) {
    nav {
      min-width: 16.125rem;
    }

    nav > sl-button::part(label) {
      display: block;
      padding-left: 0;
      font-size: var(--gobo-font-size-large);
      font-weight: var(--gobo-font-weight-medium);
    }

    nav > .cta::part(prefix) {
      display: none;
      width: 0;
    }
  }

  @media ( min-width: 750px ) {
    nav {
      display: flex;
    }
  }
</style>