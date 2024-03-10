<script>
  import * as h from "$lib/engines/post.js";

  export let baseURL;
  export let notification;
  export let source;
  export let post = {};

  const { platform, type } = notification;
  
  let logo = h.getLogo( platform );
  let sourceCopy = h.getSourceCopy( platform );

  const getDirectMessageURL = () => {    
    switch ( platform ) {
      case "mastodon":
        return new URL( "/conversations", baseURL ).href;
      default:
        console.error(`we do not yet support building a URL for the in-platform location of direct messages for platform ${platform}`);
        return "#"
    }
  };

  let url;
  switch ( type ) {
    case "repost":
    case "like":
      url = post.proxyURL ?? post.url;
      break;
    case "follow":
      url = source.url;
      break;
    case "direct message":
      url = getDirectMessageURL();
      break;
    default:
      url = "#";
      console.error("unable to match notification to appropriate frame.");
  }

</script>


<footer>

  <a
    class="source-link"
    href="{ url }"
    target="_blank" 
    rel="noopener noreferrer nofollow">
    <sl-icon src="{ logo }" class="{ platform }"></sl-icon>
    <span>{ sourceCopy }</span>     
  </a>
 
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