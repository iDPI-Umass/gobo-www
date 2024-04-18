<script>
  import { humanize } from "$lib/helpers/humanize.js";
  import { Source } from "$lib/engines/post.js";

  export let source;
  export let notification;

  let { type, notified } = notification;

  let { headingSlot1 } = Source.headings( source );
  let avatar = Source.avatar( source );
  let fallback = Source.fallback( source );

  let action;
  switch ( type ) {
    case "like":
      action = "liked your direct message.";
      break;
    case "direct message":
      action = "sent you a direct message.";
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
      onerror="this.onerror=null;this.src='{fallback}'"
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


