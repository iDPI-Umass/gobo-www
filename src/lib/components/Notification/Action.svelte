<script>
  import { humanize } from "$lib/helpers/humanize.js";
  import * as h from "$lib/engines/post.js";

  export let source;
  export let type;
  export let notified;

  let logo = h.getLogo( source.platform );
  let { headingSlot1 } = h.getHeadingSlots( source );
  let avatar = h.getAvatar( source );
  let avatarFallback = h.getAvatarFallback( source );

  let action;
  switch ( type ) {
    case "repost":
      action = "reposted your post.";
      break;
    case "like":
      action = "liked your post.";
      break;
    case "follow":
      action = "followed you.";
      break;
    default:
      action = "unknown notification";
  }

</script>


<div class="outer">
  <div class="top">
    <img 
      src="{avatar}" 
      alt={`avatar for ${ headingSlot1 }`}
      onerror="this.onerror=null;this.src='{avatarFallback}'"
    >
    <time datetime="notified">{ humanize( notified ) }</time>
  </div>
  

  <div class="content">
    <p>
      <a 
        href={source.url}
        rel="noopener noreferrer nofollow">
          { headingSlot1 }
      </a>
      {action}
    </p> 
  </div>
  
</div>

<style>

  .outer {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .top img {
    height: 2rem;
    width: 2rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-half);
    border: var(--gobo-border-panel);
  }

  .top time {
    flex-shrink: 0;
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    min-width: max-content;
    margin-left: 0.75rem;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0.25rem;
  }

  .content a {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
  }

</style>


