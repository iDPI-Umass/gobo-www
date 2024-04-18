<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Identity } from "$lib/engines/identity.js";
  import { Post } from "$lib/engines/post.js";

  export let identity = null;
  export let notification = null;
  export let source = null;

  let state, logo, copy, url;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    logo = null;
    copy = null;
    url = "#";
  };


  const Handle = {};

  Handle.error = ( f ) => {
    return async () => {
      try {
        await f()
      } catch ( error ) {
        console.error( error );
        state = "error";
      }
    };
  };


  Render.footer = Handle.error( async () => {
    if ( identity == null ) {
      console.error("render notification footer: identity is null");
      state = "error";
      return;
    }

    if ( notification == null ) {
      console.error("render notification footer: notification is null");
      state = "error";
      return;
    }

    if ( source == null ) {
      console.error("render notification footer: source is null");
      state = "error";
      return;
    }

    logo = Post.logo( source );
    copy = Post.copy( source );
    url = await Render.url();
    if ( url == null ) {
      console.error("problem rendering url for notification footer");
      state = "error";
      return;
    }
    state = "ready";
  });

  Render.directMessageURL = async () => {
    let match, baseURL;
    switch ( notification.platform ) {
      case "mastodon":
        match = await Identity.find( identity );
        baseURL = match.base_url; 
        return new URL( "/conversations", baseURL ).href;
      default:
        console.error(`we do not yet support building a URL for the in-platform location of direct messages for platform ${platform}`);
        return;
    }
  };

  // TODO: It just turns out that all the platforms use /notifications.
  //    perhaps formally breaking them all out is overkill.
  Render.fallbackURL = async () => {
    let match, baseURL;
    switch ( notification.platform ) {
      case "bluesky":
        match = await Identity.find( identity );
        baseURL = match.base_url; 
        return new URL( "/notifications", baseURL ).href;
      case "mastodon":
        match = await Identity.find( identity );
        baseURL = match.base_url; 
        return new URL( "/notifications", baseURL ).href;
      case "reddit":
        match = await Identity.find( identity );
        baseURL = match.base_url; 
        return new URL( "/notifications", baseURL ).href;
      case "smalltown":
        match = await Identity.find( identity );
        baseURL = match.base_url; 
        return new URL( "/notifications", baseURL ).href;
      default:
        console.error(`we do not yet support building a URL for the in-platform location of notifications for platform ${platform}`);
        return;
    }
  };

  Render.url = async () => {
    switch ( notification.type ) {
      case "like":
      case "direct message":
        return await Render.directMessageURL();
      default:
        console.error("unable to match notification to appropriate frame.");
        return;
    }
  };


  Render.reset();
  onMount(() => {
    Render.footer();
    return () => {
      Render.reset();
    }
  });
</script>


<footer>
  {#if state === "error"}
    <p>There was a problem rendering this view.</p>
  
  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "ready"}
    <a
      class="source-link"
      href="{ url }"
      target="_blank" 
      rel="noopener noreferrer nofollow">
      <sl-icon src="{ logo }" class="{ source.platform }"></sl-icon>
      <span>{ copy }</span>     
    </a>
  {/if}
</footer>


<style>
  footer {
    width: 100%;
    height: 2.5rem;
    padding: 0.5rem var(--gobo-width-spacer-flex);
    margin-top: var(--gobo-height-spacer-flex);
    border-top: var(--gobo-border-panel);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: end;
  }


  footer a {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    font-size: var(--gobo-font-size-detail);
  }

  footer a sl-icon {
    font-size: 1rem;
    margin-right: 0;
  }

  footer a.source-link {
    color: var(--gobo-color-text-muted);
  }

  footer a.source-link span {
    display: none;
  }

  @media ( min-width: 425px ) {
    footer a.source-link sl-icon {
      margin-right: 0.5rem;
    }

    footer a.source-link span {
      display: inline;
    }
  }
</style>